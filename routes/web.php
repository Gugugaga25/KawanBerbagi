<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route penengah pasca-login (Auto-redirect sesuai role/tabel data)
Route::get('/dashboard', function () {
    $userId = auth()->id();

    // 1. Cek apakah user terdaftar sebagai Panti
    $isPanti = \App\Models\Shelter::where('id_user', $userId)->exists();
    if ($isPanti) {
        return redirect()->route('panti.dashboard');
    }

    // 2. Cek apakah user terdaftar sebagai Donatur
    $isDonatur = \App\Models\Donor::where('id_user', $userId)->exists();
    if ($isDonatur) {
        return redirect()->route('donatur.dashboard');
    }

    // Jika bukan panti/donatur (misal admin pusat), arahkan ke dashboard default
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');



    Route::post('/donatur/donasi', [App\Http\Controllers\Donatur\DonasiController::class, 'store'])->name('donatur.donasi.store');

    // ================= ROUTE DASHBOARD ADMIN =================
    Route::get('/admin/dashboard', function () {
        $pantis = \App\Models\Shelter::with('user')->get()->map(function ($panti) {
            return [
                'id' => $panti->id_shelter,
                'nama' => $panti->nama_yayasan,
                'alamat' => $panti->alamat,
                'status' => $panti->status ?? 'Pending',
                'pimpinan' => $panti->nama_penanggung_jawab,
                'email' => $panti->user ? $panti->user->email : '',
                'phone' => $panti->no_telepon ?? '',
                'anak' => $panti->jumlah_anak ?? 0,
                'akta_yayasan' => $panti->akta_yayasan,
                'sk_kemenkumham' => $panti->sk_kemenkumham,
                'izin_operasional' => $panti->izin_operasional,
                'npwp_yayasan' => $panti->npwp_yayasan,
                'orgPhotoUrl' => $panti->dokumentasi_panti ? asset('storage/' . $panti->dokumentasi_panti) : null,
            ];
        });

        $donaturs = \App\Models\Donor::with('user')->get()->map(function ($donor) {
            return [
                'id' => $donor->id_donor,
                'nama' => $donor->nama_lengkap,
                'email' => $donor->user ? $donor->user->email : '',
                'total' => 'Rp 0',
                'frekuensi' => 0,
                'tier' => 'Bronze',
                'terakhir' => '-',
                'phone' => $donor->no_wa,
                'city' => $donor->kota,
            ];
        });

        $needs = \App\Models\Need::with(['shelter', 'donations.donor'])->get()->map(function ($need) {
            return [
                'id' => $need->id_needs,
                'barang' => $need->nama_kebutuhan,
                'panti' => $need->shelter ? $need->shelter->nama_yayasan : '-',
                'terkumpul' => $need->terkumpul,
                'target' => $need->jumlah,
                'satuan' => $need->satuan,
                'mendesak' => $need->is_mendesak,
                'status' => $need->terkumpul >= $need->jumlah ? 'Terpenuhi' : 'Berjalan',
                'created_at' => $need->created_at ? $need->created_at->format('d M Y, H:i') : '-',
                'donations' => $need->donations->map(function ($d) {
                    return [
                        'id' => $d->id_donation,
                        'donor_name' => $d->donor ? $d->donor->nama_lengkap : 'Anonim',
                        'jumlah' => $d->jumlah_donasi,
                        'status' => $d->status,
                        'tanggal' => $d->created_at ? $d->created_at->format('d M Y') : '-',
                    ];
                }),
            ];
        });

        $activeShelters = \App\Models\Shelter::where('status', 'Active')->get()->map(function ($s) {
            return [
                'id' => $s->id_shelter,
                'nama' => $s->nama_yayasan,
            ];
        });

        return Inertia::render('Admin/AdminDashboard', [
            'pantis' => $pantis,
            'donaturs' => $donaturs,
            'needs' => $needs,
            'activeShelters' => $activeShelters,
        ]);
    })->name('admin.dashboard');

    // ================= ROUTE DASHBOARD PANTI =================
    Route::get('/panti/dashboard', function () {
        $panti = \App\Models\Shelter::where('id_user', auth()->id())->with('user')->first();

        $needs = [];
        $donations = [];

        if ($panti) {
            $needs = \App\Models\Need::where('id_shelter', $panti->id_shelter)->get()->map(function ($need) {
                return [
                    'id' => $need->id_needs,
                    'barang' => $need->nama_kebutuhan,
                    'target' => $need->jumlah,
                    'terkumpul' => $need->terkumpul,
                    'satuan' => $need->satuan,
                    'mendesak' => $need->is_mendesak,
                    'kategori' => $need->kategori,
                    'target_date' => $need->target_date,
                    'status' => $need->terkumpul >= $need->jumlah ? 'selesai' : 'aktif',
                ];
            });

            $donations = \App\Models\Donation::whereIn('id_needs', function ($query) use ($panti) {
                $query->select('id_needs')->from('needs')->where('id_shelter', $panti->id_shelter);
            })->with(['need', 'donor'])->get()->map(function ($donation) {
                return [
                    'id' => 'TRX-' . str_pad($donation->id_donation, 3, '0', STR_PAD_LEFT),
                    'id_raw' => $donation->id_donation,
                    'date' => $donation->created_at ? $donation->created_at->format('d M Y') : '-',
                    'name' => $donation->donor ? $donation->donor->nama_lengkap : 'Anonim',
                    'type' => 'Barang',
                    'val' => $donation->jumlah_donasi . ' ' . ($donation->need ? $donation->need->satuan : 'Pcs'),
                    'status' => $donation->status,
                    'bukti' => $donation->bukti_penerimaan ? asset('storage/' . $donation->bukti_penerimaan) : null,
                    'detail' => [
                        'kurir' => $donation->kurir ?? '-',
                        'resi' => $donation->resi ?? '-',
                        'msg' => $donation->pesan ?? 'Tidak ada pesan.',
                        'thanks_msg' => $donation->ucapan_terimakasih ?? '',
                    ]
                ];
            });
        }

        return Inertia::render('Panti/PantiDashboard', [
            'pantiData' => $panti,
            'needs' => $needs,
            'donations' => $donations
        ]);
    })->name('panti.dashboard');

    // ================= ROUTE DASHBOARD DONATUR =================
    Route::get('/donatur/dashboard', function () {
        // Mengambil data donatur yang sedang login saat ini
        $donatur = \App\Models\Donor::where('id_user', auth()->id())->with('user')->first();

        $myDonations = [];
        $needs = [];

        if ($donatur) {
            // 1. Riwayat donasi yang pernah dikirim oleh donatur ini
            $allDonations = \App\Models\Donation::where('id_donor', $donatur->id_donor)
                ->with(['need.shelter'])
                ->latest()
                ->get();

            $myDonations = $allDonations->map(function ($d) {
                return [
                    'id' => 'TRX-' . str_pad($d->id_donation, 3, '0', STR_PAD_LEFT),
                    'id_raw' => $d->id_donation,
                    'tanggal' => $d->created_at ? $d->created_at->format('d M Y') : '-',
                    'barang' => $d->need ? $d->need->nama_kebutuhan : 'Kebutuhan Dihapus',
                    'panti' => $d->need && $d->need->shelter ? $d->need->shelter->nama_yayasan : '-',
                    'jumlah' => $d->jumlah_donasi,
                    'satuan' => $d->need ? $d->need->satuan : 'Pcs',
                    'status' => $d->status,
                    'kurir' => $d->kurir ?? '-',
                    'resi' => $d->resi ?? '-',
                ];
            });

            // 2. 3 donasi terbaru untuk overview (lacak donasi)
            $recentDonations = $allDonations->take(3)->map(function ($d) {
                $stageMap = ['Diproses' => 0, 'Dikirim' => 1, 'Diterima' => 2];
                return [
                    'id_raw' => $d->id_donation,
                    'id' => 'TRX-' . str_pad($d->id_donation, 3, '0', STR_PAD_LEFT),
                    'item' => $d->need ? $d->need->nama_kebutuhan : 'Kebutuhan Dihapus',
                    'org' => $d->need && $d->need->shelter ? $d->need->shelter->nama_yayasan : '-',
                    'status' => $d->status,
                    'stage' => $stageMap[$d->status] ?? 0,
                    'kurir' => $d->kurir ?? '-',
                    'resi' => $d->resi ?? '-',
                ];
            });

            // 3. Stats
            $totalDonasi = $allDonations->count();
            $pantiTerbantu = $allDonations->filter(function ($d) {
                return $d->need && $d->need->shelter;
            })->pluck('need.shelter.id_shelter')->unique()->count();

            // 4. Donasi yang butuh input resi (status Diproses tapi belum ada resi)
            $needsResi = $allDonations->filter(function ($d) {
                return $d->status === 'Diproses' && (!$d->resi || $d->resi === '-');
            })->take(1)->map(function ($d) {
                return [
                    'id_raw' => $d->id_donation,
                    'item' => $d->need ? $d->need->nama_kebutuhan : '-',
                ];
            })->values();

            // 5. Daftar kebutuhan panti lain yang berstatus aktif/belum terpenuhi
            $needs = \App\Models\Need::with('shelter')
                ->whereHas('shelter', function ($query) {
                    $query->where('status', 'Active');
                })
                ->where('terkumpul', '<', \DB::raw('jumlah'))
                ->get()
                ->map(function ($need) {
                    return [
                        'id' => $need->id_needs,
                        'org' => $need->shelter ? $need->shelter->nama_yayasan : '-',
                        'location' => $need->shelter ? $need->shelter->alamat : '-',
                        'item' => $need->nama_kebutuhan,
                        'category' => $need->kategori ?? 'Lainnya',
                        'unit' => $need->satuan,
                        'filled' => $need->terkumpul,
                        'total' => $need->jumlah,
                        'urgent' => (bool) $need->is_mendesak,
                    ];
                });

            // 6. Kebutuhan mendesak (untuk overview)
            $urgentNeeds = $needs->filter(fn($n) => $n['urgent'])->take(4)->values();
        }

        return Inertia::render('Donatur/DonaturDashboard', [
            'donaturData' => $donatur ? [
                'id_donor'     => $donatur->id_donor,
                'nama_lengkap' => $donatur->nama_lengkap,
                'no_wa'        => $donatur->no_wa,
                'kota'         => $donatur->kota,
                'foto_profil'  => $donatur->foto_profil ? asset('storage/' . $donatur->foto_profil) : null,
                'email'        => $donatur->user ? $donatur->user->email : '',
                'member_since' => $donatur->created_at ? $donatur->created_at->format('M Y') : '-',
            ] : null,
            'myDonations'     => $myDonations ?? [],
            'needs'           => $needs ?? [],
            'recentDonations' => $recentDonations ?? [],
            'urgentNeeds'     => $urgentNeeds ?? [],
            'stats'           => [
                'totalDonasi'   => $totalDonasi ?? 0,
                'pantiTerbantu' => $pantiTerbantu ?? 0,
            ],
            'needsResi'       => $needsResi ?? [],
        ]);
    })->name('donatur.dashboard');


    // ================= ACTIONS & AKSI MANAJEMEN PANTI =================
    Route::post('/panti/kebutuhan', [App\Http\Controllers\Panti\KebutuhanController::class, 'store'])->name('panti.kebutuhan.store');
    Route::patch('/panti/kebutuhan/{id}', [App\Http\Controllers\Panti\KebutuhanController::class, 'update'])->name('panti.kebutuhan.update');
    Route::delete('/panti/kebutuhan/{id}', [App\Http\Controllers\Panti\KebutuhanController::class, 'destroy'])->name('panti.kebutuhan.destroy');

    Route::post('/panti/donasi/{id}/konfirmasi', [App\Http\Controllers\Panti\DonasiController::class, 'konfirmasi'])->name('panti.donasi.konfirmasi');
    Route::patch('/panti/profil', [App\Http\Controllers\Panti\ProfilController::class, 'update'])->name('panti.profil.update');

    // ================= ACTIONS & AKSI MANAJEMEN DONATUR =================
    // Halaman checkout: pilih jumlah kuota & metode pengiriman untuk sebuah kebutuhan
    Route::get('/kebutuhan/{id}/donasi', [App\Http\Controllers\Donatur\DonasiController::class, 'checkout'])
        ->name('donatur.donasi.checkout');

    // Halaman detail satu donasi milik donatur yang sedang login
    Route::get('/donasi/{id}', [App\Http\Controllers\Donatur\DonasiController::class, 'show'])
        ->name('donatur.donasi.show');

    Route::post('/donatur/donasi', [App\Http\Controllers\Donatur\DonasiController::class, 'store'])->name('donatur.donasi.store');
    Route::patch('/donatur/donasi/{id}/resi', [App\Http\Controllers\Donatur\DonasiController::class, 'updateResi'])->name('donatur.donasi.updateResi');
    Route::post('/donatur/profil', [App\Http\Controllers\Donatur\ProfilController::class, 'update'])->name('donatur.profil.update');
    Route::patch('/donatur/profil', [App\Http\Controllers\Donatur\ProfilController::class, 'update']);
    Route::patch('/donatur/profil/email', [App\Http\Controllers\Donatur\ProfilController::class, 'updateEmail'])->name('donatur.profil.updateEmail');
    Route::patch('/donatur/profil/password', [App\Http\Controllers\Donatur\ProfilController::class, 'updatePassword'])->name('donatur.profil.updatePassword');

    // Notifikasi donatur
    Route::get('/donatur/notifications', [App\Http\Controllers\Donatur\NotificationController::class, 'index'])->name('donatur.notifications.index');
    Route::patch('/donatur/notifications/{id}/read', [App\Http\Controllers\Donatur\NotificationController::class, 'markAsRead'])->name('donatur.notifications.read');
    Route::patch('/donatur/notifications/read-all', [App\Http\Controllers\Donatur\NotificationController::class, 'markAllRead'])->name('donatur.notifications.readAll');

    // ================= ACTIONS & AKSI MANAJEMEN ADMIN =================
    Route::post('/admin/panti', [App\Http\Controllers\Admin\PantiController::class, 'store'])->name('admin.panti.store');
    Route::patch('/admin/panti/{id}', [App\Http\Controllers\Admin\PantiController::class, 'update'])->name('admin.panti.update');
    Route::get('/admin/panti/{id}/verification', [App\Http\Controllers\Admin\PantiController::class, 'verification'])->name('admin.panti.verification');
    Route::patch('/admin/panti/{id}/status', [App\Http\Controllers\Admin\PantiController::class, 'updateStatus'])->name('admin.panti.updateStatus');
    Route::delete('/admin/panti/{id}', [App\Http\Controllers\Admin\PantiController::class, 'destroy'])->name('admin.panti.destroy');

    Route::post('/admin/donatur', [App\Http\Controllers\Admin\DonaturController::class, 'store'])->name('admin.donatur.store');
    Route::patch('/admin/donatur/{id}', [App\Http\Controllers\Admin\DonaturController::class, 'update'])->name('admin.donatur.update');
    Route::delete('/admin/donatur/{id}', [App\Http\Controllers\Admin\DonaturController::class, 'destroy'])->name('admin.donatur.destroy');

    Route::post('/admin/kebutuhan', [App\Http\Controllers\Admin\KebutuhanController::class, 'store'])->name('admin.kebutuhan.store');
    Route::patch('/admin/kebutuhan/{id}', [App\Http\Controllers\Admin\KebutuhanController::class, 'update'])->name('admin.kebutuhan.update');
    Route::delete('/admin/kebutuhan/{id}', [App\Http\Controllers\Admin\KebutuhanController::class, 'destroy'])->name('admin.kebutuhan.destroy');
});

require __DIR__.'/auth.php';