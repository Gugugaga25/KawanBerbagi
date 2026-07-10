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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Rute Admin
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
