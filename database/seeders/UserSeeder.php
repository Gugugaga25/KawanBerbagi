<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Shelter;
use App\Models\Donor;
use App\Models\Need;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ================= 1. ADMIN =================
        User::create([
            'id_role_user' => 'RL01ADM',
            'name' => 'Admin Utama',
            'email' => 'admin@kawanberbagi.com',
            'password' => Hash::make('password123'),
        ]);

        // ================= 2. PANTI ASUHAN 1 =================
        $pantiUser1 = User::create([
            'id_role_user' => 'RL02PAN',
            'name' => 'Pengurus Yayasan Kasih Ibu',
            'email' => 'panti@kawanberbagi.com',
            'password' => Hash::make('password123'),
        ]);

        $shelter1 = Shelter::create([
            'id_user' => $pantiUser1->id_user,
            'nama_yayasan' => 'Yayasan Kasih Ibu',
            'nama_penanggung_jawab' => 'Budi Santoso',
            'alamat' => 'Jl. Kasih Ibu No. 123, Bandung',
            'status' => 'Active',
        ]);

        Need::create([
            'id_shelter' => $shelter1->id_shelter,
            'nama_kebutuhan' => 'Beras Putih Premium',
            'jumlah' => 50,
            'terkumpul' => 36,
            'satuan' => 'kg',
            'is_mendesak' => false,
            'kategori' => 'Pangan',
            'target_date' => now()->addDays(5)->toDateString(),
        ]);

        Need::create([
            'id_shelter' => $shelter1->id_shelter,
            'nama_kebutuhan' => 'Susu Formula Bayi (6-12 bln)',
            'jumlah' => 20,
            'terkumpul' => 18,
            'satuan' => 'kaleng',
            'is_mendesak' => true,
            'kategori' => 'Kesehatan',
            'target_date' => now()->addDays(2)->toDateString(),
        ]);

        Need::create([
            'id_shelter' => $shelter1->id_shelter,
            'nama_kebutuhan' => 'Selimut & Pakaian Hangat',
            'jumlah' => 30,
            'terkumpul' => 9,
            'satuan' => 'pcs',
            'is_mendesak' => false,
            'kategori' => 'Sandang',
            'target_date' => now()->addDays(14)->toDateString(),
        ]);

        Need::create([
            'id_shelter' => $shelter1->id_shelter,
            'nama_kebutuhan' => 'Minyak Goreng & Bumbu Dapur',
            'jumlah' => 20,
            'terkumpul' => 5,
            'satuan' => 'liter',
            'is_mendesak' => false,
            'kategori' => 'Pangan',
            'target_date' => now()->addDays(21)->toDateString(),
        ]);

        Need::create([
            'id_shelter' => $shelter1->id_shelter,
            'nama_kebutuhan' => 'Buku Tulis & Alat Sekolah',
            'jumlah' => 100,
            'terkumpul' => 100,
            'satuan' => 'paket',
            'is_mendesak' => false,
            'kategori' => 'Pendidikan',
            'target_date' => now()->toDateString(),
        ]);

        // ================= 3. PANTI ASUHAN 2 =================
        $pantiUser2 = User::create([
            'id_role_user' => 'RL02PAN',
            'name' => 'Ahmad Dahlan',
            'email' => 'panti2@kawanberbagi.com',
            'password' => Hash::make('password123'),
        ]);

        $shelter2 = Shelter::create([
            'id_user' => $pantiUser2->id_user,
            'nama_yayasan' => 'Panti Asuhan Nurul Iman',
            'nama_penanggung_jawab' => 'Ahmad Dahlan',
            'alamat' => 'Jl. Raya Bogor No. 45, Kramat Jati, Jakarta Timur',
            'status' => 'Active',
        ]);

        Need::create([
            'id_shelter' => $shelter2->id_shelter,
            'nama_kebutuhan' => 'Susu Bayi SGM',
            'jumlah' => 15,
            'terkumpul' => 8,
            'satuan' => 'kaleng',
            'is_mendesak' => true,
            'kategori' => 'Kesehatan',
            'target_date' => now()->addDays(3)->toDateString(),
        ]);

        Need::create([
            'id_shelter' => $shelter2->id_shelter,
            'nama_kebutuhan' => 'Buku Iqra & Juz Amma',
            'jumlah' => 50,
            'terkumpul' => 20,
            'satuan' => 'pcs',
            'is_mendesak' => false,
            'kategori' => 'Pendidikan',
            'target_date' => now()->addDays(10)->toDateString(),
        ]);

        Need::create([
            'id_shelter' => $shelter2->id_shelter,
            'nama_kebutuhan' => 'Mukena & Sarung Sholat',
            'jumlah' => 30,
            'terkumpul' => 12,
            'satuan' => 'set',
            'is_mendesak' => false,
            'kategori' => 'Sandang',
            'target_date' => now()->addDays(15)->toDateString(),
        ]);

        // ================= 4. PANTI ASUHAN 3 =================
        $pantiUser3 = User::create([
            'id_role_user' => 'RL02PAN',
            'name' => 'Sri Wahyuni',
            'email' => 'panti3@kawanberbagi.com',
            'password' => Hash::make('password123'),
        ]);

        $shelter3 = Shelter::create([
            'id_user' => $pantiUser3->id_user,
            'nama_yayasan' => 'Panti Wreda Bahagia',
            'nama_penanggung_jawab' => 'Sri Wahyuni',
            'alamat' => 'Jl. Kaliurang KM 10, Sleman, Yogyakarta',
            'status' => 'Active',
        ]);

        Need::create([
            'id_shelter' => $shelter3->id_shelter,
            'nama_kebutuhan' => 'Selimut Hangat Tebal',
            'jumlah' => 30,
            'terkumpul' => 9,
            'satuan' => 'pcs',
            'is_mendesak' => true,
            'kategori' => 'Sandang',
            'target_date' => now()->addDays(4)->toDateString(),
        ]);

        Need::create([
            'id_shelter' => $shelter3->id_shelter,
            'nama_kebutuhan' => 'Popok Dewasa Size L',
            'jumlah' => 50,
            'terkumpul' => 25,
            'satuan' => 'pack',
            'is_mendesak' => false,
            'kategori' => 'Kesehatan',
            'target_date' => now()->addDays(8)->toDateString(),
        ]);

        Need::create([
            'id_shelter' => $shelter3->id_shelter,
            'nama_kebutuhan' => 'Minyak Kayu Putih 120ml',
            'jumlah' => 40,
            'terkumpul' => 15,
            'satuan' => 'botol',
            'is_mendesak' => false,
            'kategori' => 'Kesehatan',
            'target_date' => now()->addDays(12)->toDateString(),
        ]);

        // ================= 5. PANTI ASUHAN 4 =================
        $pantiUser4 = User::create([
            'id_role_user' => 'RL02PAN',
            'name' => 'H. Muhammad',
            'email' => 'panti4@kawanberbagi.com',
            'password' => Hash::make('password123'),
        ]);

        $shelter4 = Shelter::create([
            'id_user' => $pantiUser4->id_user,
            'nama_yayasan' => 'Rumah Yatim Cahaya',
            'nama_penanggung_jawab' => 'H. Muhammad',
            'alamat' => 'Jl. Dharmahusada Indah No. 12, Mulyorejo, Surabaya',
            'status' => 'Active',
        ]);

        Need::create([
            'id_shelter' => $shelter4->id_shelter,
            'nama_kebutuhan' => 'Seragam SD & Celana',
            'jumlah' => 50,
            'terkumpul' => 20,
            'satuan' => 'pasang',
            'is_mendesak' => false,
            'kategori' => 'Pendidikan',
            'target_date' => now()->addDays(7)->toDateString(),
        ]);

        Need::create([
            'id_shelter' => $shelter4->id_shelter,
            'nama_kebutuhan' => 'Sepatu Sekolah Hitam',
            'jumlah' => 40,
            'terkumpul' => 10,
            'satuan' => 'pasang',
            'is_mendesak' => false,
            'kategori' => 'Pendidikan',
            'target_date' => now()->addDays(9)->toDateString(),
        ]);

        Need::create([
            'id_shelter' => $shelter4->id_shelter,
            'nama_kebutuhan' => 'Beras Pandan Wangi',
            'jumlah' => 200,
            'terkumpul' => 80,
            'satuan' => 'kg',
            'is_mendesak' => false,
            'kategori' => 'Pangan',
            'target_date' => now()->addDays(20)->toDateString(),
        ]);

        // ================= 6. DONATUR 1 =================
        $donaturUser1 = User::create([
            'id_role_user' => 'RL03DON',
            'name' => 'Rizky Ramadhan',
            'email' => 'donatur@kawanberbagi.com',
            'password' => Hash::make('password123'),
        ]);

        Donor::create([
            'id_user' => $donaturUser1->id_user,
            'nama_lengkap' => 'Rizky Ramadhan',
            'no_wa' => '081234567890',
            'kota' => 'Jakarta',
        ]);

        // ================= 7. DONATUR 2 =================
        $donaturUser2 = User::create([
            'id_role_user' => 'RL03DON',
            'name' => 'Budi Santoso',
            'email' => 'donatur2@kawanberbagi.com',
            'password' => Hash::make('password123'),
        ]);

        Donor::create([
            'id_user' => $donaturUser2->id_user,
            'nama_lengkap' => 'Budi Santoso',
            'no_wa' => '089876543210',
            'kota' => 'Yogyakarta',
        ]);

        // ================= 8. DONATUR 3 =================
        $donaturUser3 = User::create([
            'id_role_user' => 'RL03DON',
            'name' => 'Siti Aminah',
            'email' => 'donatur3@kawanberbagi.com',
            'password' => Hash::make('password123'),
        ]);

        Donor::create([
            'id_user' => $donaturUser3->id_user,
            'nama_lengkap' => 'Siti Aminah',
            'no_wa' => '085522334455',
            'kota' => 'Surabaya',
        ]);
    }
}
