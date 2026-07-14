<?php

namespace App\Http\Controllers\Donatur;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Donation;
use App\Models\Donor;
use App\Models\Need;
use App\Models\DonaturNotification;
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
        $donation = Donation::create([
            'id_needs' => $need->id_needs,
            'id_donor' => $donor->id_donor,
            'jumlah_donasi' => $request->jumlah_donasi,
            'status' => 'Diproses',
            'pesan' => $request->pesan,
        ]);

        // Kirim notifikasi: donasi berhasil dibuat
        DonaturNotification::kirim(
            Auth::id(),
            'status_update',
            'Donasi Berhasil Dibuat! 📦',
            'Donasi ' . $request->jumlah_donasi . ' ' . $need->satuan . ' ' . $need->nama_kebutuhan . ' sedang diproses. Segera input resi pengiriman.',
            ['id_donation' => $donation->id_donation]
        );

        return redirect()->route('dashboard', ['tab' => 'donasi'])->with('success', 'Donasi berhasil dibuat. Silakan lengkapi informasi resi pengiriman.');
    }

    /**
     * Update resi dan kurir pengiriman donasi.
     */
    public function updateResi(Request $request, $id)
    {
        $donor = Donor::where('id_user', Auth::id())->firstOrFail();
        $donation = Donation::where('id_donation', $id)->where('id_donor', $donor->id_donor)->firstOrFail();

        $request->validate([
            'kurir' => 'required|string|max:255',
            // UBAH BAGIAN INI: Menggunakan required_unless
            'resi' => 'required_unless:kurir,Antar Mandiri|nullable|string|max:255',
        ]);

        $donation->update([
            'kurir' => $request->kurir,
            'resi'  => $request->kurir === 'Antar Mandiri' ? '-' : $request->resi,
            'status' => 'Dikirim',
        ]);

        // Kirim notifikasi: status berubah ke Dikirim
        DonaturNotification::kirim(
            Auth::id(),
            'status_update',
            'Donasi Sedang Dalam Pengiriman 🚚',
            'Donasi Anda dengan resi ' . ($request->resi ?? 'Antar Mandiri') . ' via ' . $request->kurir . ' kini berstatus Dikirim.',
            ['id_donation' => $donation->id_donation]
        );

        return back()->with('success', 'Resi pengiriman berhasil diperbarui.');
    }

    /**
     * Tampilkan detail transaksi donasi.
     */
    public function show($id)
    {
        $donor = Donor::where('id_user', Auth::id())->firstOrFail();
        $donation = Donation::where('id_donation', $id)
            ->where('id_donor', $donor->id_donor)
            ->with(['need.shelter'])
            ->firstOrFail();

        $detail = [
            'id' => 'TRX-' . str_pad($donation->id_donation, 3, '0', STR_PAD_LEFT),
            'id_raw' => $donation->id_donation,
            'barang' => $donation->need ? $donation->need->nama_kebutuhan : 'Kebutuhan Dihapus',
            'jumlah' => $donation->jumlah_donasi,
            'satuan' => $donation->need ? $donation->need->satuan : 'Pcs',
            'status' => $donation->status,
            'kurir' => $donation->kurir ?? '-',
            'resi' => $donation->resi ?? '-',
            'pesan' => $donation->pesan ?? '-',
            'tanggal' => $donation->created_at ? $donation->created_at->format('d M Y, H:i') : '-',
            'bukti_penerimaan' => $donation->bukti_penerimaan ? asset('storage/' . $donation->bukti_penerimaan) : null,
            'ucapan_terimakasih' => $donation->ucapan_terimakasih ?? '-',
            'panti' => [
                'nama' => $donation->need && $donation->need->shelter ? $donation->need->shelter->nama_yayasan : '-',
                'penanggung_jawab' => $donation->need && $donation->need->shelter ? $donation->need->shelter->nama_penanggung_jawab : '-',
                'alamat' => $donation->need && $donation->need->shelter ? $donation->need->shelter->alamat : '-',
                'telepon' => $donation->need && $donation->need->shelter ? $donation->need->shelter->no_telepon : '-',
            ]
        ];

        return Inertia::render('Donatur/DonationDetail', [
            'donation' => $detail
        ]);
    }
}
