<?php

namespace App\Http\Controllers\Donatur;

use App\Http\Controllers\Controller;
use App\Models\Need;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SearchController extends Controller
{
    /**
     * Menampilkan halaman pencarian panti dan kebutuhan logistik
     */
    public function index(Request $request)
    {
        // 1. Ambil data kebutuhan
        // Filter: Hanya panti dengan status 'Active' dan jumlah donasi yang terkumpul belum mencapai target
        $needsRaw = Need::with('shelter')
            ->whereHas('shelter', function ($query) {
                $query->where('status', 'Active');
            })
            ->where('terkumpul', '<', DB::raw('jumlah'))
            ->get();

        // 2. Petakan (Map) datanya agar sesuai dengan interface 'Campaign' di React (CariPanti.tsx)
        $needs = $needsRaw->map(function ($item) {
            $reserved = \App\Models\Donation::where('id_needs', $item->id_needs)
                ->whereIn('status', ['Diproses', 'Menunggu Konfirmasi Jemput', 'Akan Dijemput', 'Dikirim'])
                ->sum('jumlah_donasi');
            $remaining = max(0, $item->jumlah - ($item->terkumpul + $reserved));

            return [
                'id'       => $item->id_needs,
                'id_shelter' => $item->id_shelter,
                'org'      => $item->shelter ? $item->shelter->nama_yayasan : 'Panti Asuhan Anonim',
                'location' => $item->shelter ? $item->shelter->alamat : 'Lokasi tidak diketahui',
                'address'  => $item->shelter ? $item->shelter->alamat : 'Lokasi tidak diketahui',
                'phone'    => $item->shelter ? $item->shelter->no_telepon : '-',
                'item'     => $item->nama_kebutuhan,
                'category' => $item->kategori ?? 'Lainnya',
                'unit'     => $item->satuan,
                'filled'   => $item->terkumpul,
                'total'    => $item->jumlah,
                'remaining'=> $remaining,
                'urgent'   => (bool) $item->is_mendesak,
            ];
        });

        // 3. Kirim data ke view React menggunakan Inertia
        return Inertia::render('Donatur/CariPanti', [
            'needs' => $needs
        ]);
    }
}