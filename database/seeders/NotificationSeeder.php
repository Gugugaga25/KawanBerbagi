<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DonaturNotification;
use App\Models\User;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereIn('id_role_user', ['RL02PAN', 'RL03DON'])->get();

        if ($users->isEmpty()) {
            $this->command->warn("No users found to seed notifications.");
            return;
        }

        $this->command->info("=== SEEDING NOTIFICATIONS ===");

        $notificationsTemplates = [
            [
                'type' => 'status_update',
                'title' => 'Status Donasi Diperbarui',
                'body' => 'Donasi barang Anda telah diterima oleh pihak panti asuhan.',
                'data' => ['id_donation' => rand(1, 10), 'status' => 'Diterima'],
            ],
            [
                'type' => 'thank_you',
                'title' => 'Ucapan Terima Kasih Baru',
                'body' => 'Panti Asuhan telah mengirimkan pesan ucapan terima kasih atas bantuan Anda.',
                'data' => ['id_donation' => rand(1, 10)],
            ],
            [
                'type' => 'resi_reminder',
                'title' => 'Pengingat Input Resi',
                'body' => 'Jangan lupa untuk memasukkan nomor resi pengiriman untuk donasi Anda yang sedang diproses.',
                'data' => ['id_donation' => rand(1, 10)],
            ],
            [
                'type' => 'system',
                'title' => 'Selamat Datang di KawanBerbagi',
                'body' => 'Terima kasih telah bergabung menjadi bagian dari kebaikan KawanBerbagi.',
                'data' => [],
            ],
            [
                'type' => 'status_update',
                'title' => 'Donasi Uang Diverifikasi',
                'body' => 'Pembayaran donasi uang sebesar Rp 250.000 telah berhasil diverifikasi oleh sistem.',
                'data' => ['nominal' => 250000, 'status' => 'Sukses'],
            ],
        ];

        $totalNotifications = 0;
        foreach ($users as $user) {
            $numNotifs = rand(2, 3);
            for ($i = 0; $i < $numNotifs; $i++) {
                $template = $notificationsTemplates[array_rand($notificationsTemplates)];
                DonaturNotification::create([
                    'id_user' => $user->id_user,
                    'type' => $template['type'],
                    'title' => $template['title'],
                    'body' => $template['body'],
                    'data' => $template['data'],
                    'is_read' => rand(0, 1) === 1,
                    'created_at' => now()->subHours(rand(1, 72)),
                ]);
                $totalNotifications++;
            }
        }

        $this->command->info("Seeding notifications completed ({$totalNotifications} notifications generated)!");
    }
}
