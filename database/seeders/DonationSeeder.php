<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Need;
use App\Models\Donor;
use App\Models\Donation;

class DonationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua donatur yang sudah dibuat di UserSeeder
        $donors = Donor::all();
        if ($donors->count() < 3) {
            return;
        }

        $donor1 = $donors[0]; // Rizky Ramadhan
        $donor2 = $donors[1]; // Budi Santoso
        $donor3 = $donors[2]; // Siti Aminah

        // Ambil beberapa kebutuhan panti asuhan
        $needBeras1 = Need::where('nama_kebutuhan', 'Beras Putih Premium')->first();
        $needSusu1 = Need::where('nama_kebutuhan', 'Susu Formula Bayi (6-12 bln)')->first();
        $needSelimut1 = Need::where('nama_kebutuhan', 'Selimut & Pakaian Hangat')->first();

        $needSusu2 = Need::where('nama_kebutuhan', 'Susu Bayi SGM')->first();
        $needBuku2 = Need::where('nama_kebutuhan', 'Buku Iqra & Juz Amma')->first();

        $needSelimut3 = Need::where('nama_kebutuhan', 'Selimut Hangat Tebal')->first();
        $needPopok3 = Need::where('nama_kebutuhan', 'Popok Dewasa Size L')->first();

        $needSeragam4 = Need::where('nama_kebutuhan', 'Seragam SD & Celana')->first();
        $needBeras4 = Need::where('nama_kebutuhan', 'Beras Pandan Wangi')->first();

        // --- Donasi dari Donatur 1 (Rizky Ramadhan) ---
        if ($needBeras1) {
            Donation::create([
                'id_needs' => $needBeras1->id_needs,
                'id_donor' => $donor1->id_donor,
                'jumlah_donasi' => 10,
                'status' => 'Diterima',
                'kurir' => 'Gojek (Instant)',
                'resi' => '-',
                'pesan' => 'Semoga membantu mencukupi kebutuhan beras adik-adik.',
                'bukti_penerimaan' => 'bukti_penerimaan/dummy_bukti.jpg',
            ]);
        }

        if ($needSusu1) {
            Donation::create([
                'id_needs' => $needSusu1->id_needs,
                'id_donor' => $donor1->id_donor,
                'jumlah_donasi' => 2,
                'status' => 'Dikirim',
                'kurir' => 'JNE Reguler',
                'resi' => 'JNE98124912984',
                'pesan' => 'Susu formula untuk balita di panti asuhan.',
            ]);
        }

        if ($needSelimut1) {
            Donation::create([
                'id_needs' => $needSelimut1->id_needs,
                'id_donor' => $donor1->id_donor,
                'jumlah_donasi' => 5,
                'status' => 'Diproses',
                'pesan' => 'Sedang kami kemas dan persiapkan untuk dikirim.',
            ]);
        }

        // --- Donasi dari Donatur 2 (Budi Santoso) ---
        if ($needSusu2) {
            Donation::create([
                'id_needs' => $needSusu2->id_needs,
                'id_donor' => $donor2->id_donor,
                'jumlah_donasi' => 4,
                'status' => 'Diterima',
                'kurir' => 'GrabExpress',
                'resi' => '-',
                'pesan' => 'Semoga susu formula ini berkah buat anak-anak bayi.',
                'bukti_penerimaan' => 'bukti_penerimaan/dummy_susu2.jpg',
            ]);
        }

        if ($needBuku2) {
            Donation::create([
                'id_needs' => $needBuku2->id_needs,
                'id_donor' => $donor2->id_donor,
                'jumlah_donasi' => 10,
                'status' => 'Dikirim',
                'kurir' => 'SiCepat Reguler',
                'resi' => 'SIS9831938928',
                'pesan' => 'Paket buku Iqra dan Juz Amma untuk mengaji sore hari.',
            ]);
        }

        // --- Donasi dari Donatur 3 (Siti Aminah) ---
        if ($needSelimut3) {
            Donation::create([
                'id_needs' => $needSelimut3->id_needs,
                'id_donor' => $donor3->id_donor,
                'jumlah_donasi' => 5,
                'status' => 'Diproses',
                'pesan' => 'Pakaian hangat dan selimut tebal untuk lansia.',
            ]);
        }

        if ($needPopok3) {
            Donation::create([
                'id_needs' => $needPopok3->id_needs,
                'id_donor' => $donor3->id_donor,
                'jumlah_donasi' => 10,
                'status' => 'Diterima',
                'kurir' => 'J&T Express',
                'resi' => 'JT981249129',
                'pesan' => 'Semoga popok dewasa membantu kenyamanan kakek nenek di panti wreda.',
                'bukti_penerimaan' => 'bukti_penerimaan/dummy_popok.jpg',
            ]);
        }

        if ($needBeras4) {
            Donation::create([
                'id_needs' => $needBeras4->id_needs,
                'id_donor' => $donor3->id_donor,
                'jumlah_donasi' => 50,
                'status' => 'Dikirim',
                'kurir' => 'JNE Trucking (JTR)',
                'resi' => 'JTR881298412',
                'pesan' => 'Beras pandan wangi untuk konsumsi harian.',
            ]);
        }
    }
}
