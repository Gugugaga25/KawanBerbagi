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

// Route penengah pasca-login (mencegah panti masuk ke halaman kosong bawaan breeze)
Route::get('/dashboard', function () {
    // Cek apakah id user ini terdaftar di tabel shelters
    // (Sesuaikan 'id_user' dengan nama kolom foreign key di tabel shelter kamu)
    $isPanti = \App\Models\Shelter::where('id_user', auth()->id())->exists();

    if ($isPanti) {
        return redirect()->route('panti.dashboard');
    }

    // Jika bukan panti (misal user biasa/donatur), arahkan ke dashboard default
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
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
                'legalDocUrl' => $panti->dokumen_legalitas_panti ? asset('storage/' . $panti->dokumen_legalitas_panti) : null,
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
        // Mengambil data spesifik panti yang sedang login saat ini
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

    Route::post('/panti/kebutuhan', [App\Http\Controllers\Panti\KebutuhanController::class, 'store'])->name('panti.kebutuhan.store');
    Route::patch('/panti/kebutuhan/{id}', [App\Http\Controllers\Panti\KebutuhanController::class, 'update'])->name('panti.kebutuhan.update');
    Route::delete('/panti/kebutuhan/{id}', [App\Http\Controllers\Panti\KebutuhanController::class, 'destroy'])->name('panti.kebutuhan.destroy');

    Route::post('/panti/donasi/{id}/konfirmasi', [App\Http\Controllers\Panti\DonasiController::class, 'konfirmasi'])->name('panti.donasi.konfirmasi');
    Route::patch('/panti/profil', [App\Http\Controllers\Panti\ProfilController::class, 'update'])->name('panti.profil.update');

    // ================= ACTIONS & AKSI MANAJEMEN ADMIN =================
    Route::post('/admin/panti', [App\Http\Controllers\Admin\PantiController::class, 'store'])->name('admin.panti.store');
    Route::patch('/admin/panti/{id}', [App\Http\Controllers\Admin\PantiController::class, 'update'])->name('admin.panti.update');
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