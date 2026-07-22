<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Need;
use App\Models\Donor;
use App\Models\Shelter;
use App\Models\Donation;
use App\Models\CashDonation;
use Illuminate\Support\Str;

class DonationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = fake('id_ID');

        $donors = Donor::all();
        $needs = Need::all();
        $shelters = Shelter::all();

        if ($donors->isEmpty() || $needs->isEmpty() || $shelters->isEmpty()) {
            $this->command->warn("Missing base records to seed donations. Run UserSeeder first.");
            return;
        }

        $this->command->info("=== SEEDING DONATIONS ===");

        // ================= 1. GOODS DONATIONS (5-15 per Donor) =================
        $this->command->info("Seeding Goods Donations (5-15 per donor)...");
        $couriers = ['JNE Reguler', 'GrabExpress', 'Gojek Instant', 'SiCepat Reguler', 'J&T Express', 'JNE Trucking'];
        $statuses = ['Pending', 'Diproses', 'Dikirim', 'Diterima', 'Batal'];

        foreach ($donors as $donor) {
            $numDonations = rand(5, 15);
            for ($i = 0; $i < $numDonations; $i++) {
                $need = $needs->random();
                $status = $statuses[array_rand($statuses)];
                $qty = rand(1, min(15, $need->jumlah));

                $donationData = [
                    'id_needs' => $need->id_needs,
                    'id_donor' => $donor->id_donor,
                    'jumlah_donasi' => $qty,
                    'status' => $status,
                    'pesan' => $faker->sentence(),
                ];

                if (in_array($status, ['Dikirim', 'Diterima'])) {
                    $donationData['kurir'] = $couriers[array_rand($couriers)];
                    $donationData['resi'] = 'RES' . strtoupper(Str::random(10));
                }

                if ($status === 'Diterima') {
                    $donationData['bukti_penerimaan'] = 'bukti_penerimaan/dummy_bukti_' . rand(1, 4) . '.jpg';
                    $donationData['ucapan_terimakasih'] = 'Terima kasih banyak atas donasinya. Bantuan ' . $need->nama_kebutuhan . ' ini sangat membantu anak-anak.';
                }

                Donation::create($donationData);
            }
        }

        // Update 'terkumpul' count in Needs table based on accepted donations (status = 'Diterima')
        foreach ($needs as $need) {
            $totalReceived = Donation::where('id_needs', $need->id_needs)
                ->where('status', 'Diterima')
                ->sum('jumlah_donasi');
            
            $need->update([
                'terkumpul' => min($need->jumlah, $totalReceived),
            ]);
        }

        // ================= 2. CASH DONATIONS (10-20 per Shelter) =================
        $this->command->info("Seeding Cash Donations (10-20 per shelter)...");
        $paymentMethods = ['Transfer Bank', 'QRIS', 'E-Wallet (Gopay/OVO)', 'Kartu Kredit'];
        $cashStatuses = ['Sukses', 'Pending', 'Batal'];

        foreach ($shelters as $shelter) {
            $numCashDonations = rand(10, 20);
            for ($j = 0; $j < $numCashDonations; $j++) {
                $randomDonor = $donors->random();
                $cashStatus = $cashStatuses[array_rand($cashStatuses)];

                CashDonation::create([
                    'id_donor' => $randomDonor->id_donor,
                    'id_shelter' => $shelter->id_shelter,
                    'nominal' => rand(5, 100) * 10000, // 50.000 to 1.000.000
                    'metode_pembayaran' => $paymentMethods[array_rand($paymentMethods)],
                    'pesan' => rand(0, 2) === 0 ? null : $faker->sentence(), // 33% chance of null message
                    'is_anonim' => rand(0, 5) === 0, // 16% chance of anonymous
                    'developer_tip' => rand(0, 10) === 0, // 9% chance of tip
                    'status' => $cashStatus,
                ]);
            }
        }

        $this->command->info("Seeding completed successfully!");
    }
}
