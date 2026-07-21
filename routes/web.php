<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DonasiController;
use App\Http\Controllers\Admin\NeedController;
use App\Http\Controllers\Admin\PantiController as AdminPantiController;
use App\Http\Controllers\ReportController;

// ================= HALAMAN UTAMA =================
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/profil-panti', function () {
    $pantis = \App\Models\Shelter::where('status', 'Active')->with('needs')->get()->map(function ($panti) {
        return [
            'id' => $panti->id_shelter,
            'nama' => $panti->nama_yayasan,
            'alamat' => $panti->alamat,
            'deskripsi' => $panti->deskripsi ?? 'Panti asuhan yang berdedikasi membimbing dan menyekolahkan anak asuh.',
            'jumlah_anak' => $panti->jumlah_anak ?? 0,
            'image' => $panti->foto_profil ? asset('storage/' . $panti->foto_profil) : ($panti->dokumentasi_panti ? asset('storage/' . $panti->dokumentasi_panti) : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop'),
            'kebutuhan_mendesak' => $panti->needs->where('is_mendesak', true)->take(3)->pluck('nama_kebutuhan')->toArray(),
            'terverifikasi' => true,
        ];
    });

    return Inertia::render('ProfilPanti', [
        'pantis' => $pantis
    ]); 
})->name('profil-panti');

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


// ================= GRUP UTAMA (WAJIB LOGIN) =================
Route::middleware('auth')->group(function () {
    
    // Default Profile Laravel Breeze
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


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
                'id_shelter' => $need->id_shelter,
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

        $laporans = \App\Models\Report::with('pelapor')->orderBy('created_at', 'desc')->get()->map(function ($report) {
            return [
                'id' => $report->id,
                'id_target' => $report->id_target,
                'tipe_laporan' => $report->tipe_laporan,
                'pelapor' => $report->pelapor ? $report->pelapor->name : 'Anonim',
                'terlapor_nama' => $report->judul_target,
                'alasan' => $report->alasan,
                'catatan_tambahan' => $report->catatan_tambahan,
                'tanggal' => $report->created_at->format('Y-m-d'),
                'status' => $report->status,
            ];
        });

        return Inertia::render('Admin/AdminDashboard', [
            'pantis' => $pantis,
            'donaturs' => $donaturs,
            'needs' => $needs,
            'activeShelters' => $activeShelters,
            'laporans' => $laporans,
        ]);
    })->name('admin.dashboard');

    Route::patch('/admin/laporan/{id}/status', [ReportController::class, 'updateStatus'])->name('admin.laporan.status');



    // ================= ROUTE DASHBOARD PANTI =================
    Route::get('/panti/dashboard', function () {
        \App\Models\Donation::cancelExpiredDonations();
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

            $goodsDonations = \App\Models\Donation::whereIn('id_needs', function ($query) use ($panti) {
                $query->select('id_needs')->from('needs')->where('id_shelter', $panti->id_shelter);
            })->with(['need', 'donor'])->get()->map(function ($donation) {
                return [
                    'id' => 'TRX-' . str_pad($donation->id_donation, 3, '0', STR_PAD_LEFT),
                    'id_raw' => $donation->id_donation,
                    'date' => $donation->created_at ? $donation->created_at->format('d M Y') : '-',
                    'created_at_raw' => $donation->created_at,
                    'name' => $donation->is_anonim ? 'Anonim' : ($donation->donor ? $donation->donor->nama_lengkap : 'Anonim'),
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

            $cashDonations = \App\Models\CashDonation::where('id_shelter', $panti->id_shelter)
                ->with(['donor'])
                ->get()
                ->map(function ($cash) {
                    return [
                        'id' => 'TRX-C' . str_pad($cash->id_cash_donation, 3, '0', STR_PAD_LEFT),
                        'id_raw' => $cash->id_cash_donation,
                        'date' => $cash->created_at ? $cash->created_at->format('d M Y') : '-',
                        'created_at_raw' => $cash->created_at,
                        'name' => $cash->is_anonim ? 'Anonim' : ($cash->donor ? $cash->donor->nama_lengkap : 'Anonim'),
                        'type' => 'Dana',
                        'val' => 'Rp ' . number_format($cash->nominal),
                        'status' => $cash->status,
                        'bukti' => null,
                        'detail' => [
                            'kurir' => '-',
                            'resi' => '-',
                            'msg' => $cash->pesan ?? 'Tidak ada pesan.',
                            'thanks_msg' => '',
                        ]
                    ];
                });

            $donations = $goodsDonations->concat($cashDonations)->sortByDesc('created_at_raw')->values()->all();
        }

        return Inertia::render('Panti/PantiDashboard', [
            'pantiData' => $panti,
            'needs' => $needs,
            'donations' => $donations
        ]);
    })->name('panti.dashboard');


    // ================= ROUTE DASHBOARD DONATUR =================
    Route::get('/donatur/dashboard', function () {
        \App\Models\Donation::cancelExpiredDonations();
        $donatur = \App\Models\Donor::where('id_user', auth()->id())->with('user')->first();

        $myDonations = [];
        $needs = [];

        if ($donatur) {
            $goodsDonations = \App\Models\Donation::where('id_donor', $donatur->id_donor)
                ->with(['need.shelter'])
                ->get()
                ->map(function ($d) {
                    return [
                        'id' => 'TRX-' . str_pad($d->id_donation, 3, '0', STR_PAD_LEFT),
                        'id_raw' => $d->id_donation,
                        'tanggal' => $d->created_at ? $d->created_at->format('d M Y') : '-',
                        'created_at' => $d->created_at ? $d->created_at->toIso8601String() : null,
                        'created_at_raw' => $d->created_at,
                        'barang' => $d->need ? $d->need->nama_kebutuhan : 'Kebutuhan Dihapus',
                        'panti' => $d->need && $d->need->shelter ? $d->need->shelter->nama_yayasan : '-',
                        'jumlah' => $d->jumlah_donasi,
                        'satuan' => $d->need ? $d->need->satuan : 'Pcs',
                        'status' => $d->status,
                        'kurir' => $d->kurir ?? '-',
                        'resi' => $d->resi ?? '-',
                        'type' => 'Barang',
                    ];
                });

            $cashDonations = \App\Models\CashDonation::where('id_donor', $donatur->id_donor)
                ->with(['shelter'])
                ->get()
                ->map(function ($c) {
                    return [
                        'id' => 'TRX-C' . str_pad($c->id_cash_donation, 3, '0', STR_PAD_LEFT),
                        'id_raw' => $c->id_cash_donation,
                        'tanggal' => $c->created_at ? $c->created_at->format('d M Y') : '-',
                        'created_at' => $c->created_at ? $c->created_at->toIso8601String() : null,
                        'created_at_raw' => $c->created_at,
                        'barang' => 'Donasi Tunai ' . ($c->developer_tip ? '(Dukung Platform)' : ''),
                        'panti' => $c->shelter ? $c->shelter->nama_yayasan : '-',
                        'jumlah' => $c->nominal,
                        'satuan' => 'Rupiah',
                        'status' => $c->status,
                        'kurir' => '-',
                        'resi' => '-',
                        'type' => 'Dana',
                    ];
                });

            $myDonations = $goodsDonations->concat($cashDonations)->sortByDesc('created_at_raw')->values();

            $recentDonations = $myDonations->take(3)->map(function ($d) {
                $stageMap = ['Diproses' => 0, 'Dikirim' => 1, 'Diterima' => 2, 'Pending' => 0, 'Sukses' => 2];
                return [
                    'id_raw' => $d['id_raw'],
                    'id' => $d['id'],
                    'item' => $d['barang'],
                    'org' => $d['panti'],
                    'status' => $d['status'],
                    'stage' => $stageMap[$d['status']] ?? 0,
                    'kurir' => $d['kurir'],
                    'resi' => $d['resi'],
                    'type' => $d['type'],
                ];
            });

            $totalDonasi = $goodsDonations->count() + $cashDonations->count();
            $pantiTerbantu = $goodsDonations->filter(function ($d) {
                return $d['panti'] !== '-';
            })->pluck('panti')->concat(
                $cashDonations->filter(function ($c) {
                    return $c['panti'] !== '-';
                })->pluck('panti')
            )->unique()->count();

            $needsResi = $goodsDonations->filter(function ($d) {
                return $d['status'] === 'Diproses' && (!$d['resi'] || $d['resi'] === '-');
            })->take(1)->map(function ($d) {
                return [
                    'id_raw' => $d['id_raw'],
                    'item' => $d['barang'],
                ];
            })->values();

            $needs = \App\Models\Need::with('shelter')
                ->whereHas('shelter', function ($query) {
                    $query->where('status', 'Active');
                })
                ->where('terkumpul', '<', \DB::raw('jumlah'))
                ->get()
                ->map(function ($need) {
                    $reserved = \App\Models\Donation::where('id_needs', $need->id_needs)
                        ->whereIn('status', ['Diproses', 'Menunggu Konfirmasi Jemput', 'Akan Dijemput', 'Dikirim'])
                        ->sum('jumlah_donasi');
                    $remaining = max(0, $need->jumlah - ($need->terkumpul + $reserved));

                    return [
                        'id' => $need->id_needs,
                        'org' => $need->shelter ? $need->shelter->nama_yayasan : '-',
                        'location' => $need->shelter ? $need->shelter->alamat : '-',
                        'address' => $need->shelter ? $need->shelter->alamat : '-',
                        'phone' => $need->shelter ? $need->shelter->no_telepon : '-',
                        'item' => $need->nama_kebutuhan,
                        'category' => $need->kategori ?? 'Lainnya',
                        'unit' => $need->satuan,
                        'filled' => $need->terkumpul,
                        'total' => $need->jumlah,
                        'remaining' => $remaining,
                        'urgent' => (bool) $need->is_mendesak,
                    ];
                });

            $urgentNeeds = $needs->filter(fn($n) => $n['urgent'])->take(4)->values();

            $pantis = \App\Models\Shelter::where('status', 'Active')->get()->map(function($p) {
                return [
                    'id' => $p->id_shelter, 
                    'nama' => $p->nama_yayasan, 
                    'lokasi' => $p->alamat,
                    'deskripsi' => $p->deskripsi ?? 'Panti asuhan yang berdedikasi membantu anak-anak.',
                    'jumlah_anak' => $p->jumlah_anak ?? 0,
                ];
            });
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
            'pantis' => $pantis,
        ]);
    })->name('donatur.dashboard');


    // ================= ACTIONS & AKSI MANAJEMEN PANTI =================
    Route::post('/panti/kebutuhan', [App\Http\Controllers\Panti\KebutuhanController::class, 'store'])->name('panti.kebutuhan.store');
    Route::patch('/panti/kebutuhan/{id}', [App\Http\Controllers\Panti\KebutuhanController::class, 'update'])->name('panti.kebutuhan.update');
    Route::delete('/panti/kebutuhan/{id}', [App\Http\Controllers\Panti\KebutuhanController::class, 'destroy'])->name('panti.kebutuhan.destroy');
    Route::post('/panti/donasi/{id}/konfirmasi', [App\Http\Controllers\Panti\DonasiController::class, 'konfirmasi'])->name('panti.donasi.konfirmasi');
    Route::post('/panti/donasi/{id}/konfirmasi-jemput', [App\Http\Controllers\Panti\DonasiController::class, 'konfirmasiJemput'])->name('panti.donasi.konfirmasi_jemput');
    Route::post('/panti/profil', [App\Http\Controllers\Panti\ProfilController::class, 'update'])->name('panti.profil.update');
    Route::post('/panti/profil/foto', [App\Http\Controllers\Panti\ProfilController::class, 'updateFoto'])->name('panti.profil.foto');
    Route::post('/panti/profil/banner', [App\Http\Controllers\Panti\ProfilController::class, 'updateBanner'])->name('panti.profil.banner');
    Route::post('/panti/posts', [App\Http\Controllers\Panti\ProfilController::class, 'storePost'])->name('panti.posts.store');
    Route::delete('/panti/posts/{id}', [App\Http\Controllers\Panti\ProfilController::class, 'destroyPost'])->name('panti.posts.destroy');
    Route::post('/panti/pengurus', [App\Http\Controllers\Panti\ProfilController::class, 'storePengurus'])->name('panti.pengurus.store');
    Route::delete('/panti/pengurus/{id}', [App\Http\Controllers\Panti\ProfilController::class, 'destroyPengurus'])->name('panti.pengurus.destroy');
    Route::post('/panti/audits', [App\Http\Controllers\Panti\ProfilController::class, 'storeAudit'])->name('panti.audits.store');
    Route::delete('/panti/audits/{id}', [App\Http\Controllers\Panti\ProfilController::class, 'destroyAudit'])->name('panti.audits.destroy');

    // Notifikasi Panti
    Route::get('/panti/notifications', [App\Http\Controllers\Panti\NotificationController::class, 'index'])->name('panti.notifications.index');
    Route::patch('/panti/notifications/{id}/read', [App\Http\Controllers\Panti\NotificationController::class, 'markAsRead'])->name('panti.notifications.read');
    Route::patch('/panti/notifications/read-all', [App\Http\Controllers\Panti\NotificationController::class, 'markAllRead'])->name('panti.notifications.readAll');

    // ================= ACTIONS & AKSI MANAJEMEN DONATUR =================
    
    // Fitur Chat
    Route::get('/donatur/chat', [App\Http\Controllers\ChatController::class, 'donorIndex'])->name('donatur.chat');
    Route::get('/donatur/chat/admin', [App\Http\Controllers\ChatController::class, 'initDonaturAdminChat'])->name('donatur.chat.admin');
    Route::get('/donatur/chat/init/{id_shelter}', [App\Http\Controllers\ChatController::class, 'initChat'])->name('donatur.chat.init');
    Route::get('/panti/chat', [App\Http\Controllers\ChatController::class, 'shelterIndex'])->name('panti.chat');
    Route::get('/chat/unread-count', [App\Http\Controllers\ChatController::class, 'getUnreadCount'])->name('chat.unread_count');
    Route::get('/chat/{id_chat}/messages', [App\Http\Controllers\ChatController::class, 'getMessages'])->name('chat.messages');
    Route::post('/chat/bot/send', [App\Http\Controllers\ChatController::class, 'sendBotMessage'])->name('chat.bot.send');
    Route::post('/chat/{id_chat}/send', [App\Http\Controllers\ChatController::class, 'sendMessage'])->name('chat.send');

    // Admin Chat
    Route::get('/admin/chat', [App\Http\Controllers\ChatController::class, 'adminIndex'])->name('admin.chat');
    Route::get('/admin/chat/init/panti/{id_panti}', [App\Http\Controllers\ChatController::class, 'initAdminPantiChat'])->name('admin.chat.init_panti');
    Route::get('/admin/chat/init/donatur/{id_donatur}', [App\Http\Controllers\ChatController::class, 'initAdminDonaturChat'])->name('admin.chat.init_donatur');



    // Pencarian Panti & Detail Panti
    Route::get('/donatur/cari-panti', [App\Http\Controllers\Donatur\SearchController::class, 'index'])->name('donatur.cari_panti');
    Route::get('/donatur/panti/{id}', [App\Http\Controllers\Donatur\PantiController::class, 'show'])->name('donatur.panti.show');
    
    // Donasi Uang (Sekarang dipindah ke sini dengan URL yang tidak bentrok)
    Route::get('/donatur/donasi-uang/{id}', [DonasiController::class, 'create'])->name('donasi.create');
    Route::post('/donatur/donasi-uang', [DonasiController::class, 'store'])->name('donasi.store');
    Route::get('/donatur/donasi-uang/bayar/{id}', [DonasiController::class, 'checkoutSimulasi'])->name('donasi.checkout_simulasi');
    Route::post('/donatur/donasi-uang/bayar/{id}', [DonasiController::class, 'bayarSimulasi'])->name('donasi.bayar_simulasi');
    
    // Donasi Barang / Kebutuhan
    Route::get('/kebutuhan/{id}/donasi', [App\Http\Controllers\Donatur\DonasiController::class, 'checkout'])->name('donatur.donasi.checkout');
    Route::get('/donatur/riwayat', [App\Http\Controllers\Donatur\DonasiController::class, 'riwayat'])->name('donatur.riwayat');

    // ================= ROUTE LAPORAN =================
    Route::post('/laporan', [ReportController::class, 'store'])->name('laporan.store');

    Route::get('/donasi/{id}', [App\Http\Controllers\Donatur\DonasiController::class, 'show'])->name('donatur.donasi.show');
    Route::post('/donatur/donasi', [App\Http\Controllers\Donatur\DonasiController::class, 'store'])->name('donatur.donasi.store');
    Route::patch('/donatur/donasi/{id}/resi', [App\Http\Controllers\Donatur\DonasiController::class, 'updateResi'])->name('donatur.donasi.updateResi');
    
    // Profil Donatur
    Route::post('/donatur/profil', [App\Http\Controllers\Donatur\ProfilController::class, 'update'])->name('donatur.profil.update');
    Route::patch('/donatur/profil', [App\Http\Controllers\Donatur\ProfilController::class, 'update']);
    Route::patch('/donatur/profil/email', [App\Http\Controllers\Donatur\ProfilController::class, 'updateEmail'])->name('donatur.profil.updateEmail');
    Route::patch('/donatur/profil/password', [App\Http\Controllers\Donatur\ProfilController::class, 'updatePassword'])->name('donatur.profil.updatePassword');

    // Notifikasi Donatur
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


// ================= ROUTE DINAMIS (PUBLIC) DITARUH DI BAWAH =================
// Route ini dipindahkan ke bawah agar tidak bertabrakan dengan /panti/dashboard
Route::get('/panti/{id}', [App\Http\Controllers\Donatur\PantiController::class, 'showPublic'])->name('panti.detail.public');


require __DIR__.'/auth.php';