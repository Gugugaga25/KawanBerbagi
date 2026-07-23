<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\RoleUser;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['id_role_user' => 'RL01ADM', 'role' => 'admin'],
            ['id_role_user' => 'RL02PAN', 'role' => 'panti'],
            ['id_role_user' => 'RL03DON', 'role' => 'donatur'],
        ];

        foreach ($roles as $r) {
            RoleUser::updateOrCreate(['id_role_user' => $r['id_role_user']], $r);
        }
    }
}
