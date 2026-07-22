<?php

namespace App\Services;

use App\Models\Shelter;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Target nomor WA pengiriman (sementara diarahkan ke nomor pengujian sesuai instruksi).
     */
    const TARGET_PHONE_TEST = '081291819276';

    /**
     * Format nomor telepon Indonesia ke format internasional 62xxx
     */
    public static function formatPhoneNumber(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        } elseif (str_starts_with($phone, '8')) {
            $phone = '62' . $phone;
        }

        return $phone;
    }

    /**
     * Buat pesan verifikasi WA untuk Panti
     */
    public static function buildVerificationMessage(Shelter $shelter, string $status, ?string $catatan = null): string
    {
        $namaYayasan = $shelter->nama_yayasan;
        $pic = $shelter->nama_penanggung_jawab;
        $email = $shelter->user->email ?? '-';

        if ($status === 'Active') {
            $msg = "*[KAWANBERBAGI - VERIFIKASI BERHASIL]* 🎉\n\n";
            $msg .= "Halo Bapak/Ibu *$pic* (Pengurus *$namaYayasan*),\n\n";
            $msg .= "Selamat! Pendaftaran panti asuhan Anda di platform KawanBerbagi telah *DISETUJUI & VERIFIKASI AKTIF* oleh Tim Admin.\n\n";
            $msg .= "📋 *Detail Akun:*\n";
            $msg .= "• Nama Panti: $namaYayasan\n";
            $msg .= "• Email: $email\n";
            $msg .= "• Status: Terverifikasi Aktif ✓\n\n";
            $msg .= "Sekarang Anda dapat login ke Panel Panti untuk mulai mempublikasikan kebutuhan barang logistik dan menerima bantuan donasi dari para donatur.\n\n";
            $msg .= "Login sekarang: " . url('/login') . "\n\n";
            $msg .= "Terima kasih,\n_Tim KawanBerbagi_";
        } else {
            $msg = "*[KAWANBERBAGI - INFORMASI VERIFIKASI]* ⚠️\n\n";
            $msg .= "Halo Bapak/Ibu *$pic* (Pengurus *$namaYayasan*),\n\n";
            $msg .= "Terima kasih telah mendaftarkan yayasan Anda di KawanBerbagi. Mohon maaf, berdasarkan hasil peninjauan dokumen, pendaftaran panti Anda saat ini *BELUM DAPAT DISETUJUI / DITOLAK*.\n\n";
            if (!empty($catatan)) {
                $msg .= "📝 *Catatan/Alasan dari Admin:*\n\"$catatan\"\n\n";
            }
            $msg .= "Silakan hubungi tim dukungan kami atau lengkapi dokumen pendukung jika ingin melakukan pengajuan ulang.\n\n";
            $msg .= "Terima kasih,\n_Tim KawanBerbagi_";
        }

        return $msg;
    }

    /**
     * Buat link wa.me direct ke target phone dengan URL-encoded message
     */
    public static function generateWaMeLink(string $phone, string $message): string
    {
        $formatted = self::formatPhoneNumber($phone);
        return 'https://wa.me/' . $formatted . '?text=' . urlencode($message);
    }

    /**
     * Kirim notifikasi WA via Fonnte / WA Gateway API (dengan fallback log jika token belum diisi)
     */
    public static function sendNotification(string $phone, string $message): array
    {
        $formattedPhone = self::formatPhoneNumber($phone);
        $token = env('FONNTE_TOKEN') ?? env('WA_TOKEN');

        Log::info("WhatsApp Notification queued/sent to {$formattedPhone}", [
            'message' => $message,
            'token_exists' => !empty($token)
        ]);

        if (!empty($token)) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => $token,
                ])->post('https://api.fonnte.com/send', [
                    'target' => $formattedPhone,
                    'message' => $message,
                ]);

                return [
                    'success' => $response->successful(),
                    'data' => $response->json(),
                ];
            } catch (\Exception $e) {
                Log::error("Fonnte WA API Error: " . $e->getMessage());
                return [
                    'success' => false,
                    'error' => $e->getMessage(),
                ];
            }
        }

        // Return status fallback jika token API belum diset di .env
        return [
            'success' => true,
            'simulated' => true,
            'message' => 'Logged to laravel.log (Fonnte token not set)'
        ];
    }
}
