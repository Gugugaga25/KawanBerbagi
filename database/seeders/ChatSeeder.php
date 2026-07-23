<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Chat;
use App\Models\Message;
use App\Models\Donor;
use App\Models\Shelter;
use App\Models\User;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $donors = Donor::with('user')->get();
        $shelters = Shelter::with('user')->get();
        $admin = User::where('id_role_user', 'RL01ADM')->first();

        if ($donors->isEmpty() || $shelters->isEmpty()) {
            $this->command->warn("Donors or Shelters empty. Run UserSeeder first.");
            return;
        }

        $this->command->info("=== SEEDING CHATS & MESSAGES ===");

        // 1. Donor <-> Shelter chats (6 channels)
        for ($i = 0; $i < 6; $i++) {
            $donor = $donors[$i % count($donors)];
            $shelter = $shelters[$i % count($shelters)];

            $chat = Chat::create([
                'id_donor' => $donor->id_donor,
                'id_shelter' => $shelter->id_shelter,
                'id_admin' => null,
            ]);

            $messages = [
                [$donor->user->id_user, "Halo pengurus {$shelter->nama_yayasan}, apakah bantuan beras bisa dikirim besok?"],
                [$shelter->user->id_user, "Halo kak {$donor->nama_lengkap}! Bantuan bisa dikirim kapan saja, kami siap menerima."],
                [$donor->user->id_user, "Baik kak, saya sudah jadwalkan pengiriman via JNE Reguler ya."],
                [$shelter->user->id_user, "Terima kasih banyak atas kebaikan Kak {$donor->nama_lengkap}! Semoga berkah selalu."],
                [$donor->user->id_user, "Sama-sama kak, mohon dicek jika sudah sampai ya."],
            ];

            foreach ($messages as $idx => [$senderId, $msgText]) {
                Message::create([
                    'id_chat' => $chat->id_chat,
                    'id_sender' => $senderId,
                    'message' => $msgText,
                    'is_read' => $idx < count($messages) - 1,
                    'created_at' => now()->subMinutes(100 - ($idx * 15)),
                ]);
            }
        }

        // 2. Donor <-> Admin chats (3 channels)
        if ($admin) {
            for ($j = 0; $j < 3; $j++) {
                $donor = $donors[$j + 6];

                $chat = Chat::create([
                    'id_donor' => $donor->id_donor,
                    'id_shelter' => null,
                    'id_admin' => $admin->id_user,
                ]);

                $adminMsgs = [
                    [$donor->user->id_user, "Halo Admin KawanBerbagi, saya ada kendala saat konfirmasi pembayaran donasi uang."],
                    [$admin->id_user, "Halo Kak {$donor->nama_lengkap}, boleh diinfokan nomor transaksi atau screenshot kendalanya?"],
                    [$donor->user->id_user, "Nomor transaksi #CSH-" . rand(1000, 9999) . ", tadi statusnya masih pending."],
                    [$admin->id_user, "Baik kak, tim kami sudah memverifikasi transaksi tersebut dan statusnya sekarang sudah Sukses!"],
                    [$donor->user->id_user, "Terima kasih banyak atas bantuan respon cepatnya admin!"],
                ];

                foreach ($adminMsgs as $idx => [$senderId, $msgText]) {
                    Message::create([
                        'id_chat' => $chat->id_chat,
                        'id_sender' => $senderId,
                        'message' => $msgText,
                        'is_read' => true,
                        'created_at' => now()->subHours(24 - ($idx * 2)),
                    ]);
                }
            }

            // 3. Shelter <-> Admin chats (3 channels)
            for ($k = 0; $k < 3; $k++) {
                $shelter = $shelters[$k];

                $chat = Chat::create([
                    'id_donor' => null,
                    'id_shelter' => $shelter->id_shelter,
                    'id_admin' => $admin->id_user,
                ]);

                $shelterMsgs = [
                    [$shelter->user->id_user, "Selamat siang Admin, kami ingin memperbarui dokumen perizinan operasional yayasan."],
                    [$admin->id_user, "Selamat siang Pengurus {$shelter->nama_yayasan}. Silakan diunggah dokumen PDF terbaru melalui menu profil panti."],
                    [$shelter->user->id_user, "Sudah kami unggah admin, mohon ditinjau ulang."],
                    [$admin->id_user, "Baik, verifikasi dokumen telah disetujui. Status akun panti Anda tetap Aktif."],
                ];

                foreach ($shelterMsgs as $idx => [$senderId, $msgText]) {
                    Message::create([
                        'id_chat' => $chat->id_chat,
                        'id_sender' => $senderId,
                        'message' => $msgText,
                        'is_read' => true,
                        'created_at' => now()->subDays(2)->addHours($idx * 3),
                    ]);
                }
            }
        }

        $this->command->info("Seeding chats and messages completed (12 chat channels created)!");
    }
}
