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

        // ================= 2. PANTI ASUHAN (10) =================
        $numShelters = 10;
        $this->command->info("Role: Panti Asuhan (Generating {$numShelters} shelters)");

        $shelterBanners = [
            'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80',
        ];

        $shelterProfiles = [
            'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        ];

        $postImages = [
            'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
        ];

        $donorProfiles = [
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        ];

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

            // Generate 5-8 activity posts for this shelter
            $posts = [];
            $numPosts = rand(5, 8);
            $samplePostTexts = [
                'Alhamdulillah, kegiatan doa bersama dan belajar sore anak-anak panti berlangsung dengan penuh khidmat. Terima kasih kepada para donatur yang selalu mendampingi langkah kami.',
                'Penyaluran bantuan paket makanan sehat dan susu untuk adik-adik hari ini berjalan lancar. Senyum mereka adalah kebahagiaan kita semua.',
                'Kerja bakti pembersihan area perpustakaan panti dan penataan buku-buku cerita baru. Anak-anak sangat bersemangat membaca buku-buku baru ini!',
                'Kunjungan pemeriksaan kesehatan rutin bulan ini bersama tim medis sukarelawan. Seluruh adik-adik panti dalam kondisi sehat walafiat.',
                'Kreativitas tanpa batas! Hari ini anak-anak panti belajar membuat kerajinan tangan dari bahan daur ulang. Hasil karya mereka luar biasa indah.',
                'Terima kasih atas bantuan donasi sembako yang telah sampai di panti kami. Bantuan ini sangat berarti untuk kebutuhan konsumsi sehari-hari anak-anak.',
                'Suasana kebersamaan saat makan malam bersama seluruh penghuni panti. Terima kasih Kakak-kakak donatur atas kepeduliannya!',
                'Pelatihan komputer dasar dan bimbingan belajar untuk anak-anak tingkat SMP/SMA agar lebih siap menghadapi ujian mendatang.',
            ];

            for ($p = 0; $p < $numPosts; $p++) {
                $posts[] = [
                    'id' => time() - ($p * 86400) - rand(100, 3600),
                    'content' => $samplePostTexts[$p % count($samplePostTexts)],
                    'image' => $postImages[$p % count($postImages)],
                    'time' => now()->subDays($p)->subHours(rand(1, 12))->toISOString(),
                    'likes' => rand(2, 25),
                    'liked_by' => [(string)rand(1, 5), (string)rand(6, 10)],
                ];
            }

            // Generate 2-3 pengurus
            $pengurus = [
                [
                    'id' => time() - 1000 - ($i * 10),
                    'nama' => $faker->name,
                    'jabatan' => 'Ketua Yayasan',
                    'image' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
                ],
                [
                    'id' => time() - 2000 - ($i * 10),
                    'nama' => $faker->name,
                    'jabatan' => 'Bendahara & Operasional',
                    'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
                ],
                [
                    'id' => time() - 3000 - ($i * 10),
                    'nama' => $faker->name,
                    'jabatan' => 'Koordinator Pengasuh',
                    'image' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
                ],
            ];

            // Generate 1-2 audit reports
            $laporanAudits = [
                [
                    'id' => time() - 5000 - ($i * 10),
                    'judul' => 'Laporan Transparansi Keuangan & Audit 2026',
                    'file_pdf' => 'documents/dummy_audit.pdf',
                    'tanggal' => now()->subMonths(1)->format('d M Y'),
                ],
            ];

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
                'dokumentasi_panti' => $postImages[$i % count($postImages)],
                'foto_banner' => $shelterBanners[$i % count($shelterBanners)],
                'foto_profil' => $shelterProfiles[$i % count($shelterProfiles)],
                'posts' => $posts,
                'pengurus' => $pengurus,
                'laporan_audits' => $laporanAudits,
                'deskripsi' => $faker->paragraph,
                'website' => 'https://' . Str::slug($pantiName) . '.or.id',
                'tahun_berdiri' => rand(1995, 2022),
                'username' => Str::slug($pantiName) . '-' . rand(100, 999),
            ]);

            $this->command->info("- Email: {$pantiUser->email} | Yayasan: {$shelter->nama_yayasan}");

            // Generate 3-5 needs for this shelter
            $numNeeds = rand(3, 5);
            $categories = array_keys($needTemplates);
            shuffle($categories);
            
            for ($j = 0; $j < $numNeeds; $j++) {
                $category = $categories[$j % count($categories)];
                $templates = $needTemplates[$category];
                $template = $templates[array_rand($templates)];
                
                Need::create([
                    'id_shelter' => $shelter->id_shelter,
                    'nama_kebutuhan' => $template[0],
                    'jumlah' => rand(20, 100),
                    'terkumpul' => 0,
                    'satuan' => $template[1],
                    'is_mendesak' => rand(0, 3) === 0, // 25% chance of urgent
                    'kategori' => $category,
                    'target_date' => now()->addDays(rand(5, 30))->toDateString(),
                ]);
            }
        }
        $this->command->info("--------------------------------------------------");

        // ================= 3. DONATUR (10) =================
        $numDonors = 10;
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
                'foto_profil' => $donorProfiles[$k % count($donorProfiles)],
            ]);

            $this->command->info("- Email: {$donorUser->email} | Nama: {$donor->nama_lengkap}");
        }
        $this->command->info("==================================================");
    }
}
