<?php

namespace App\Http\Controllers\Donatur;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\Donor;
use App\Models\Need;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DonasiController extends Controller
{
    /**
     * Simpan transaksi donasi baru dari donatur.
     */
    public function store(Request $request)
    {
        // Ambil data donor yang sedang login
        $donor = Donor::where('id_user', Auth::id())->firstOrFail();

        // Validasi input
        $request->validate([
            'id_needs' => 'required|exists:needs,id_needs',
            'jumlah_donasi' => 'required|integer|min:1',
            'pesan' => 'nullable|string|max:1000',
        ]);

        $need = Need::findOrFail($request->id_needs);

        // Cek jika jumlah donasi melebihi kebutuhan tersisa
        $remaining = $need->jumlah - $need->terkumpul;
        if ($request->jumlah_donasi > $remaining) {
            return back()->withErrors([
                'jumlah_donasi' => 'Jumlah donasi melebihi sisa kebutuhan (' . $remaining . ' ' . $need->satuan . ').'
            ]);
        }

        // Buat data donasi baru dengan status awal 'Diproses'
        Donation::create([
            'id_needs' => $need->id_needs,
            'id_donor' => $donor->id_donor,
            'jumlah_donasi' => $request->jumlah_donasi,
            'status' => 'Diproses',
            'pesan' => $request->pesan,
        ]);

        return redirect()->route('dashboard', ['tab' => 'donasi'])->with('success', 'Donasi berhasil dibuat. Silakan lengkapi informasi resi pengiriman.');
    }
}
