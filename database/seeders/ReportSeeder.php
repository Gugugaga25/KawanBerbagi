<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Shelter;
use App\Models\Report;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = fake('id_ID');

        // Ambil beberapa user donatur untuk menjadi pelapor
        $donors = User::where('id_role_user', 'RL03DON')->get();
        // Ambil beberapa panti untuk menjadi target laporan
        $shelters = Shelter::all();

        if ($donors->isEmpty() || $shelters->isEmpty()) {
            $this->command->warn("Missing users or shelters to seed reports.");
            return;
        }

        $this->command->info("=== SEEDING REPORTS ===");

        $alasanList = [
            'Informasi profil panti tidak akurat atau palsu.',
            'Diduga melakukan penyalahgunaan dana donasi.',
            'Foto dokumentasi panti terindikasi mengambil dari internet.',
            'Nomor kontak PIC tidak dapat dihubungi secara terus menerus.',
            'Laporan keuangan bulanan tidak transparan atau mencurigakan.'
        ];

        $catatanList = [
            'Saya mencoba mengunjungi alamat panti namun warga sekitar mengatakan panti tersebut sudah lama tutup.',
            'Nominal uang yang dicantumkan dalam laporan penggunaan dana tidak sesuai dengan kuitansi pembelian yang diunggah.',
            'Foto profil panti ini sama persis dengan foto yayasan lain di luar kota.',
            'Saya mencoba mengirim pesan chat dan telepon berkali-kali selama seminggu tidak ada respon sama sekali.',
            'Laporan audit yang diunggah terlihat seperti dokumen template kosong.'
        ];

        $statuses = ['pending', 'diproses', 'selesai', 'ditolak'];

        // Buat 4 laporan dummy
        for ($i = 0; $i < 4; $i++) {
            $reporter = $donors->random();
            $targetShelter = $shelters->random();
            $status = $statuses[$i % count($statuses)];

            Report::create([
                'id_pelapor' => $reporter->id_user,
                'tipe_laporan' => 'panti',
                'id_target' => $targetShelter->id_shelter,
                'judul_target' => $targetShelter->nama_yayasan,
                'alasan' => $alasanList[array_rand($alasanList)],
                'catatan_tambahan' => $catatanList[array_rand($catatanList)],
                'status' => $status,
            ]);
        }

        $this->command->info("Seeding reports completed successfully!");
    }
}
