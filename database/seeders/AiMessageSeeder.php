<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AiMessage;
use App\Models\Donor;

class AiMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $donors = Donor::all();

        if ($donors->isEmpty()) {
            $this->command->warn("No donors found to seed AI messages.");
            return;
        }

        $this->command->info("=== SEEDING AI MESSAGES ===");

        $sampleDialogues = [
            [
                ['sender' => 'user', 'message' => 'Rekomendasikan panti asuhan di dekat wilayah saya yang butuh bantuan bahan makanan mendesak.'],
                ['sender' => 'ai', 'message' => 'Tentu! Berdasarkan kebutuhan mendesak, **Panti Asuhan Kasih Ibu** memerlukan 50 kg Beras Putih Premium dalam 3 hari ke depan. Apakah Anda ingin langsung menyalurkan donasi ke sana?'],
            ],
            [
                ['sender' => 'user', 'message' => 'Bisakah kamu analisa foto kemasan biskuit ini untuk melihat apakah cocok diderma panti?'],
                ['sender' => 'ai', 'message' => 'Hasil Scan AI Vision: Produk adalah Biskuit Gandum (Exp: 15 Des 2026). Produk ini dalam kondisi sangat baik, halal, dan aman disalurkan ke panti asuhan.'],
            ],
            [
                ['sender' => 'user', 'message' => 'Bagaimana cara mengirim donasi pakaian layak pakai?'],
                ['sender' => 'ai', 'message' => 'Anda dapat memilih panti yang membutuhkan kategori **Sandang**, kemudian pilih opsi pengiriman ekspedisi (JNE/GoSend) dan masukkan nomor resi setelah paket dikirim.'],
            ],
        ];

        $totalAiMsgs = 0;
        foreach ($donors->take(5) as $donor) {
            $dialogue = $sampleDialogues[array_rand($sampleDialogues)];
            foreach ($dialogue as $idx => $msg) {
                AiMessage::create([
                    'id_donor' => $donor->id_donor,
                    'sender' => $msg['sender'],
                    'message' => $msg['message'],
                    'metadata' => $msg['sender'] === 'ai' ? ['confidence' => 0.95, 'model' => 'gemini-2.5-flash'] : null,
                    'created_at' => now()->subHours(rand(2, 48))->addMinutes($idx * 2),
                ]);
                $totalAiMsgs++;
            }
        }

        $this->command->info("Seeding AI messages completed ({$totalAiMsgs} messages generated)!");
    }
}
