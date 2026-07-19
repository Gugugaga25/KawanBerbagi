<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected $apiKey;
    protected $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    protected $model = 'gemini-3.1-flash-lite';

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
    }

    /**
     * Call the Gemini API generateContent endpoint.
     */
    protected function generateContent($prompt, $jsonMode = false)
    {
        if (!$this->apiKey) {
            Log::error('Gemini API key is not configured in .env file.');
            return null;
        }

        $url = "{$this->baseUrl}/{$this->model}:generateContent?key={$this->apiKey}";

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'maxOutputTokens' => 150,
            ]
        ];

        // generationConfig is omitted here to avoid versioning conflicts with responseMimeType
        // Instead, we will clean and extract JSON manually.

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, $payload);

            if ($response->successful()) {
                $data = $response->json();
                return $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
            }

            Log::error('Gemini API request failed', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('Gemini API exception', ['message' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Call the Gemini API generateContent endpoint with conversation history.
     */
    protected function generateContentWithHistory(array $history, $systemInstruction = null)
    {
        if (!$this->apiKey) {
            Log::error('Gemini API key is not configured in .env file.');
            return null;
        }

        $url = "{$this->baseUrl}/{$this->model}:generateContent?key={$this->apiKey}";

        $contents = [];
        foreach ($history as $chat) {
            $contents[] = [
                'role' => $chat['role'] === 'model' ? 'model' : 'user',
                'parts' => [
                    ['text' => $chat['message']]
                ]
            ];
        }

        $payload = [
            'contents' => $contents,
            'generationConfig' => [
                'maxOutputTokens' => 150,
            ]
        ];

        if ($systemInstruction) {
            $payload['systemInstruction'] = [
                'parts' => [
                    ['text' => $systemInstruction]
                ]
            ];
        }

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($url, $payload);

            if ($response->successful()) {
                $data = $response->json();
                return $data['candidates'][0]['content']['parts'][0]['text'] ?? null;
            }

            Log::error('Gemini API request failed', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('Gemini API exception', ['message' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Extract search parameters (item, location, kategori) from conversation history.
     */
    public function extractSearchParams(array $history): array
    {
        $historyStr = "";
        foreach ($history as $h) {
            $roleName = $h['role'] === 'model' ? 'Asisten AI' : 'Donatur';
            $historyStr .= "{$roleName}: {$h['message']}\n";
        }

        $prompt = <<<PROMPT
Analisis percakapan bahasa Indonesia berikut dari donatur yang ingin melakukan donasi ke panti asuhan:
---
{$historyStr}
---

Tugas Anda: Ekstrak parameter pencarian berdasarkan pesan terakhir dari donatur, dengan mempertimbangkan konteks percakapan di atas jika pesan terakhir kurang spesifik (misal: jika donatur sebelumnya mencari "beras di Bandung" lalu bertanya "Ada panti lainnya?", maka item tetap "beras" dan lokasi tetap "bandung").

Ekstrak parameter pencarian dan kembalikan HANYA objek JSON dengan properti berikut:
1. "item": string atau null. Nama barang spesifik yang ingin didonasikan (misal: "baju batik", "beras", "susu bayi"). Lakukan pemetaan sinonim cerdas ke kata benda yang lebih spesifik yang mungkin ada di database (misalnya: jika donatur mengetik "sembako", petakan menjadi "beras" atau "minyak goreng"; jika mengetik "baju bekas" atau "pakaian layak pakai", petakan menjadi "pakaian"; jika mengetik "buku tulis", petakan menjadi "buku").
2. "location": string atau null. Nama kota, kabupaten, atau daerah (misal: "bogor", "bandung", "jakarta timur"). Cukup ambil nama daerah/kotanya saja tanpa kata jalan/jalan raya jika ada.
3. "kategori": string atau null. Harus merupakan salah satu dari kategori berikut sesuai jenis barangnya:
   - "Pangan" (jika berkaitan dengan makanan/minuman seperti beras, minyak, mie instan, bumbu dapur)
   - "Sandang" (jika berkaitan dengan pakaian, kain, selimut, mukena, sarung, sepatu, popok)
   - "Pendidikan" (jika berkaitan dengan buku tulis, alat tulis, buku iqra, meja belajar)
   - "Kesehatan" (jika berkaitan dengan obat-obatan, vitamin, susu formula bayi, hand sanitizer)
   - "Lain-lain" (jika kategori lainnya)

Format output harus berupa JSON valid tanpa markdown code block. Contoh:
{
  "item": "beras",
  "location": "bandung",
  "kategori": "Pangan"
}
PROMPT;

        $response = $this->generateContent($prompt, true);

        if (!$response) {
            return ['item' => null, 'location' => null, 'kategori' => null];
        }

        // Clean markdown code blocks from response if present
        $cleanResponse = trim($response);
        if (str_starts_with($cleanResponse, '```')) {
            $cleanResponse = preg_replace('/^```(?:json)?\s*/i', '', $cleanResponse);
            $cleanResponse = preg_replace('/\s*```$/', '', $cleanResponse);
        }
        $cleanResponse = trim($cleanResponse);

        $decoded = json_decode($cleanResponse, true);
        return is_array($decoded) ? $decoded : ['item' => null, 'location' => null, 'kategori' => null];
    }

    /**
     * Synthesize the final assistant response using the search results and query type.
     */
    public function synthesizeResponse(array $history, array $searchParams, array $shelters, bool $isFallback): string
    {
        $shelterContext = [];
        foreach ($shelters as $s) {
            $needsList = array_map(function($need) {
                return "- {$need['nama_kebutuhan']} (kebutuhan: {$need['jumlah']} {$need['satuan']}, terkumpul: {$need['terkumpul']} {$need['satuan']})";
            }, $s['needs'] ?? []);
            
            $shelterContext[] = "Panti: {$s['nama_yayasan']} (Alamat: {$s['alamat']})\nKebutuhan:\n" . implode("\n", $needsList);
        }
        $shelterContextStr = implode("\n\n", $shelterContext);

        $paramsStr = json_encode($searchParams);
        $fallbackStatus = $isFallback ? 'true' : 'false';

        $systemInstruction = <<<PROMPT
Anda adalah "Asisten AI KawanBerbagi", konsultan pintar AI yang membantu donatur menemukan panti asuhan yang membutuhkan bantuan mereka.
Tugas Anda adalah merespons pesan pengguna secara ramah, sopan, dan persuasif dalam bahasa Indonesia.

Parameter Ekstraksi Saat Ini: {$paramsStr}
Apakah Menggunakan Pencarian Fallback (Kategori Umum): {$fallbackStatus}
Data Panti yang Ditemukan di Database:
---
{$shelterContextStr}
---

ATURAN MERESPONS:
1. Jawablah dengan nada hangat, sopan, dan ramah dalam bahasa Indonesia yang natural.
2. JANGAN membuat daftar/list panti asuhan atau tautan markdown dalam teks jawaban Anda, karena sistem frontend akan otomatis menampilkan daftar panti asuhan tersebut dalam bentuk kartu interaktif tepat di bawah pesan Anda. Cukup jelaskan secara ringkas bahwa Anda menemukan panti asuhan berikut yang sesuai.
3. KETENTUAN FALLBACK PENTING:
   Jika "Apakah Menggunakan Pencarian Fallback" bernilai true, Anda WAJIB menyertakan kalimat peringatan persis atau sangat mirip seperti ini:
   "ini ada yang membutuhkan [KATEGORI/BARANG_UMUM] tapi tidak spesifik [BARANG_SPESIFIK] silakan konfirmasi dahulu ke pantinya"
   Contoh: Jika donatur mencari "baju batik" (Sandang) dan kita mengembalikan panti yang butuh "pakaian hangat/selimut", Anda harus menulis: "ini ada yang membutuhkan baju/pakaian tapi tidak spesifik baju batik silakan konfirmasi dahulu ke pantinya". Sesuaikan kata barang umum dan barang spesifiknya dengan konteks obrolan.
4. Jika tidak ada panti yang ditemukan sama sekali, beri tahu donatur dengan sopan bahwa saat ini belum ada panti asuhan di lokasi tersebut yang mencantumkan kebutuhan tersebut, dan sarankan untuk mencari lokasi terdekat atau jenis bantuan lain.
5. Jaga agar tanggapan Anda sangat singkat dan padat (maksimal 2 kalimat atau kurang dari 40 kata).
PROMPT;

        return $this->generateContentWithHistory($history, $systemInstruction) ?? "Halo! Maaf, saya sedang mengalami kendala koneksi ke server AI. Namun berikut adalah beberapa panti asuhan yang berhasil ditemukan berdasarkan pencarian database.";
    }
}
