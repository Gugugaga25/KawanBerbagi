<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Shelter;
use App\Models\Donor;
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

        Shelter::create([
            'id_user' => $pantiUser->id_user,
            'nama_yayasan' => 'Yayasan Kasih Ibu',
            'nama_penanggung_jawab' => 'Budi Santoso',
            'alamat' => 'Jl. Kasih Ibu No. 123, Bandung',
        ]);

        // 3. Donatur
        $donaturUser = User::create([
            'id_role_user' => 'RL03DON',
            'name' => 'Rizky Ramadhan',
            'email' => 'donatur@kawanberbagi.com',
            'password' => Hash::make('password123'),
        ]);

        Donor::create([
            'id_user' => $donaturUser->id_user,
            'nama_lengkap' => 'Rizky Ramadhan',
            'no_wa' => '081234567890',
            'kota' => 'Jakarta',
        ]);
    }
}
