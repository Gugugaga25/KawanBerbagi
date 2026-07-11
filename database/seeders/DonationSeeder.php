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
        // Temukan donatur dan kebutuhan yang sudah dibuat sebelumnya
        $donor = Donor::first();
        
        $needBeras = Need::where('nama_kebutuhan', 'Beras Putih Premium')->first();
        $needSusu = Need::where('nama_kebutuhan', 'Susu Formula Bayi (6-12 bln)')->first();
        $needSelimut = Need::where('nama_kebutuhan', 'Selimut & Pakaian Hangat')->first();

        if (!$donor) {
            return;
        }

        // Seed data Donasi Masuk
        if ($needBeras) {
            Donation::create([
                'id_needs' => $needBeras->id_needs,
                'id_donor' => $donor->id_donor,
                'jumlah_donasi' => 10,
                'status' => 'Diterima',
                'kurir' => 'Gojek (Instant)',
                'resi' => '-',
                'pesan' => 'Semoga membantu mencukupi kebutuhan beras adik-adik.',
                'bukti_penerimaan' => 'bukti_penerimaan/dummy_bukti.jpg',
            ]);
        }

        if ($needSusu) {
            Donation::create([
                'id_needs' => $needSusu->id_needs,
                'id_donor' => $donor->id_donor,
                'jumlah_donasi' => 2,
                'status' => 'Dikirim',
                'kurir' => 'JNE Reguler',
                'resi' => 'JNE98124912984',
                'pesan' => 'Susu formula untuk balita di panti asuhan.',
            ]);
        }

        if ($needSelimut) {
            Donation::create([
                'id_needs' => $needSelimut->id_needs,
                'id_donor' => $donor->id_donor,
                'jumlah_donasi' => 5,
                'status' => 'Diproses',
                'pesan' => 'Sedang kami kemas dan persiapkan untuk dikirim.',
            ]);
        }
    }
}
