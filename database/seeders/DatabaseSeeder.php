<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Hubungkan ulang database untuk membersihkan cache skema PgBouncer (Supabase)
        \Illuminate\Support\Facades\DB::purge();
        \Illuminate\Support\Facades\DB::reconnect();

        $this->call([
            RoleUserSeeder::class,
            UserSeeder::class,
            DonationSeeder::class,
            ReportSeeder::class,
        ]);
    }
}
