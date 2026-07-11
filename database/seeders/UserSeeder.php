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
        // 1. Admin
        User::create([
            'id_role_user' => 'RL01ADM',
            'name' => 'Admin Utama',
            'email' => 'admin@kawanberbagi.com',
            'password' => Hash::make('password123'),
        ]);

        // 2. Panti
        $pantiUser = User::create([
            'id_role_user' => 'RL02PAN',
            'name' => 'Pengurus Yayasan Kasih Ibu',
            'email' => 'panti@kawanberbagi.com',
            'password' => Hash::make('password123'),
        ]);

        $shelter = Shelter::create([
            'id_user' => $pantiUser->id_user,
            'nama_yayasan' => 'Yayasan Kasih Ibu',
            'nama_penanggung_jawab' => 'Budi Santoso',
            'alamat' => 'Jl. Kasih Ibu No. 123, Bandung',
        ]);

        // Seed Kebutuhan Panti (Needs)
        $needBeras = Need::create([
            'id_shelter' => $shelter->id_shelter,
            'nama_kebutuhan' => 'Beras Putih Premium',
            'jumlah' => 50,
            'terkumpul' => 36,
            'satuan' => 'kg',
            'is_mendesak' => false,
            'kategori' => 'Pangan',
            'target_date' => now()->addDays(5)->toDateString(),
        ]);

        $needSusu = Need::create([
            'id_shelter' => $shelter->id_shelter,
            'nama_kebutuhan' => 'Susu Formula Bayi (6-12 bln)',
            'jumlah' => 20,
            'terkumpul' => 18,
            'satuan' => 'kaleng',
            'is_mendesak' => true,
            'kategori' => 'Balita',
            'target_date' => now()->addDays(2)->toDateString(),
        ]);

        $needSelimut = Need::create([
            'id_shelter' => $shelter->id_shelter,
            'nama_kebutuhan' => 'Selimut & Pakaian Hangat',
            'jumlah' => 30,
            'terkumpul' => 9,
            'satuan' => 'pcs',
            'is_mendesak' => false,
            'kategori' => 'Sandang',
            'target_date' => now()->addDays(14)->toDateString(),
        ]);

        $needMinyak = Need::create([
            'id_shelter' => $shelter->id_shelter,
            'nama_kebutuhan' => 'Minyak Goreng & Bumbu Dapur',
            'jumlah' => 20,
            'terkumpul' => 5,
            'satuan' => 'liter',
            'is_mendesak' => false,
            'kategori' => 'Pangan',
            'target_date' => now()->addDays(21)->toDateString(),
        ]);

        $needBuku = Need::create([
            'id_shelter' => $shelter->id_shelter,
            'nama_kebutuhan' => 'Buku Tulis & Alat Sekolah',
            'jumlah' => 100,
            'terkumpul' => 100,
            'satuan' => 'paket',
            'is_mendesak' => false,
            'kategori' => 'Pendidikan',
            'target_date' => now()->toDateString(),
        ]);

        // 3. Donatur
        $donaturUser = User::create([
            'id_role_user' => 'RL03DON',
            'name' => 'Rizky Ramadhan',
            'email' => 'donatur@kawanberbagi.com',
            'password' => Hash::make('password123'),
        ]);

        $donor = Donor::create([
            'id_user' => $donaturUser->id_user,
            'nama_lengkap' => 'Rizky Ramadhan',
            'no_wa' => '081234567890',
            'kota' => 'Jakarta',
        ]);
    }
}
