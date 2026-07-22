<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Shelter;
use App\Models\Donor;
use App\Models\Need;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = fake('id_ID');

        // ================= 1. ADMIN =================
        $adminEmail = 'admin@kawanberbagi.com';
        $admin = User::create([
            'id_role_user' => 'RL01ADM',
            'name' => 'Admin Utama',
            'email' => $adminEmail,
            'password' => Hash::make('password123'),
        ]);

        $this->command->info("=== GENERATED ACCOUNTS ===");
        $this->command->info("Role: Admin");
        $this->command->info("- Email: {$admin->email} | Password: password123");
        $this->command->info("--------------------------------------------------");

        // ================= 2. PANTI ASUHAN (5-10) =================
        $numShelters = rand(5, 10);
        $this->command->info("Role: Panti Asuhan (Generating {$numShelters} shelters)");

        $needTemplates = [
            'Pangan' => [
                ['Beras Putih Premium', 'kg'],
                ['Minyak Goreng Sawit', 'liter'],
                ['Mie Instan Kaldu Ayam', 'dus'],
                ['Telur Ayam Negeri', 'butir'],
                ['Gula Pasir Kristal', 'kg'],
                ['Susu Formula Bayi', 'kaleng'],
            ],
            'Kesehatan' => [
                ['Masker Medis 3-Ply', 'box'],
                ['Vitamin C 500mg', 'botol'],
                ['Pembalut Wanita', 'pack'],
                ['Popok Bayi/Anak Size M', 'pack'],
                ['Minyak Kayu Putih 120ml', 'botol'],
                ['Kotak P3K Lengkap', 'set'],
            ],
            'Sandang' => [
                ['Selimut Hangat Tebal', 'pcs'],
                ['Pakaian Dalam Anak', 'pcs'],
                ['Kasur Busa Single', 'unit'],
                ['Sajadah & Mukena', 'set'],
                ['Handuk Mandi Serat Bambu', 'pcs'],
            ],
            'Pendidikan' => [
                ['Buku Tulis 58 Lembar', 'pack'],
                ['Paket Alat Tulis (Pensil & Pulpen)', 'paket'],
                ['Tas Ransel Sekolah', 'pcs'],
                ['Buku Iqra Lengkap (1-6)', 'pcs'],
                ['Kamus Bahasa Inggris', 'pcs'],
            ],
        ];

        for ($i = 0; $i < $numShelters; $i++) {
            $pantiName = 'Panti Asuhan ' . $faker->company;
            $pantiEmail = 'panti' . ($i + 1) . '@kawanberbagi.com';
            
            $pantiUser = User::create([
                'id_role_user' => 'RL02PAN',
                'name' => 'Pengurus ' . $pantiName,
                'email' => $pantiEmail,
                'password' => Hash::make('password123'),
            ]);

            $shelter = Shelter::create([
                'id_user' => $pantiUser->id_user,
                'nama_yayasan' => $pantiName,
                'nama_penanggung_jawab' => $faker->name,
                'alamat' => $faker->address,
                'no_telepon' => $faker->phoneNumber,
                'jumlah_anak' => rand(15, 80),
                'status' => 'Active',
                'akta_yayasan' => 'documents/dummy_akta.pdf',
                'sk_kemenkumham' => 'documents/dummy_sk.pdf',
                'izin_operasional' => 'documents/dummy_izin.pdf',
                'npwp_yayasan' => 'documents/dummy_npwp.pdf',
                'dokumentasi_panti' => 'documentation/panti_' . rand(1, 4) . '.jpg',
                'foto_banner' => 'banners/panti_' . rand(1, 4) . '.jpg',
                'foto_profil' => 'profiles/panti_' . rand(1, 4) . '.jpg',
                'deskripsi' => $faker->paragraph,
                'website' => 'https://' . Str::slug($pantiName) . '.or.id',
                'tahun_berdiri' => rand(1995, 2022),
                'username' => Str::slug($pantiName) . '-' . rand(100, 999),
            ]);

            $this->command->info("- Email: {$pantiUser->email} | Yayasan: {$shelter->nama_yayasan}");

            // Generate 3-7 needs for this shelter
            $numNeeds = rand(3, 7);
            $categories = array_keys($needTemplates);
            
            // Shuffle categories to get a random mix
            shuffle($categories);
            
            for ($j = 0; $j < $numNeeds; $j++) {
                $category = $categories[$j % count($categories)];
                $templates = $needTemplates[$category];
                $template = $templates[array_rand($templates)];
                
                Need::create([
                    'id_shelter' => $shelter->id_shelter,
                    'nama_kebutuhan' => $template[0],
                    'jumlah' => rand(10, 100),
                    'terkumpul' => 0,
                    'satuan' => $template[1],
                    'is_mendesak' => rand(0, 4) == 0, // 20% chance of urgent
                    'kategori' => $category,
                    'target_date' => now()->addDays(rand(3, 30))->toDateString(),
                ]);
            }
        }
        $this->command->info("--------------------------------------------------");

        // ================= 3. DONATUR (5-10) =================
        $numDonors = rand(5, 10);
        $this->command->info("Role: Donatur (Generating {$numDonors} donors)");

        for ($k = 0; $k < $numDonors; $k++) {
            $donorName = $faker->name;
            $donorEmail = 'donatur' . ($k + 1) . '@kawanberbagi.com';

            $donorUser = User::create([
                'id_role_user' => 'RL03DON',
                'name' => $donorName,
                'email' => $donorEmail,
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
            ]);

            $donor = Donor::create([
                'id_user' => $donorUser->id_user,
                'nama_lengkap' => $donorName,
                'no_wa' => $faker->phoneNumber,
                'kota' => $faker->city,
                'status' => 'Active',
                'foto_profil' => 'profiles/donor_' . rand(1, 4) . '.jpg',
            ]);

            $this->command->info("- Email: {$donorUser->email} | Nama: {$donor->nama_lengkap}");
        }
        $this->command->info("==================================================");
    }
}
