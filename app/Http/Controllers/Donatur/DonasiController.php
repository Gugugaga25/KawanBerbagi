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
     * Tampilkan halaman checkout donasi barang.
     */
    public function checkout(Request $request, $id)
    {
        $need = Need::with('shelter')->findOrFail($id);
        
        // Hitung kuota yang saat ini terkunci
        $reserved = Donation::where('id_needs', $id)
            ->whereIn('status', ['Diproses', 'Menunggu Konfirmasi Jemput', 'Akan Dijemput', 'Dikirim'])
            ->sum('jumlah_donasi');
        
        $remaining = max(0, $need->jumlah - ($need->terkumpul + $reserved));
        
        $jumlah = $request->query('jumlah', 1);
        $catatan = $request->query('catatan', '');

        $donor = Donor::where('id_user', Auth::id())->first();

        return Inertia::render('Donatur/DonaturCheckout', [
            'need' => [
                'id' => $need->id_needs,
                'org' => $need->shelter ? $need->shelter->nama_yayasan : '-',
                'address' => $need->shelter ? $need->shelter->alamat : '-',
                'phone' => $need->shelter ? $need->shelter->no_telepon : '-',
                'item' => $need->nama_kebutuhan,
                'category' => $need->kategori ?? 'Lainnya',
                'unit' => $need->satuan,
                'filled' => $need->terkumpul,
                'total' => $need->jumlah,
                'remaining' => $remaining,
            ],
            'prefilled' => [
                'jumlah' => (int) $jumlah,
                'catatan' => $catatan,
            ],
            'donaturData' => $donor ? [
                'id_donor' => $donor->id_donor,
                'nama_lengkap' => $donor->nama_lengkap,
                'no_wa' => $donor->no_wa,
            ] : null,
        ]);
    }

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
            'metode_pengiriman' => 'required|in:ekspedisi,mandiri,jemput',
            'kurir' => 'nullable|string|max:255',
            'resi' => 'nullable|string|max:255',
            'konfirmasi_langsung' => 'nullable|boolean',
        ]);

        $need = Need::findOrFail($request->id_needs);

        // Hitung kuota yang saat ini terkunci
        $reserved = Donation::where('id_needs', $need->id_needs)
            ->whereIn('status', ['Diproses', 'Menunggu Konfirmasi Jemput', 'Akan Dijemput', 'Dikirim'])
            ->sum('jumlah_donasi');
        $remaining = max(0, $need->jumlah - ($need->terkumpul + $reserved));

        if ($request->jumlah_donasi > $remaining) {
            return back()->withErrors([
                'jumlah_donasi' => 'Jumlah donasi melebihi sisa kebutuhan (' . $remaining . ' ' . $need->satuan . ').'
            ]);
        }

        $status = 'Diproses';
        $kurir = null;
        $resi = null;

        if ($request->metode_pengiriman === 'ekspedisi') {
            $kurir = $request->kurir ?: 'Kirim via Ekspedisi';
            $resi = $request->resi;
            if ($request->konfirmasi_langsung && $resi) {
                $status = 'Dikirim';
            }
        } elseif ($request->metode_pengiriman === 'mandiri') {
            $kurir = 'Antar Mandiri';
            if ($request->konfirmasi_langsung) {
                $status = 'Dikirim';
                $resi = '-';
            }
        } elseif ($request->metode_pengiriman === 'jemput') {
            $kurir = 'Jemput oleh Panti';
            $status = 'Menunggu Konfirmasi Jemput';
        }

        // Buat data donasi baru
        $donation = Donation::create([
            'id_needs' => $need->id_needs,
            'id_donor' => $donor->id_donor,
            'jumlah_donasi' => $request->jumlah_donasi,
            'status' => $status,
            'kurir' => $kurir,
            'resi' => $resi,
            'pesan' => $request->pesan,
        ]);

        // Notifikasi ke donatur
        $msgTitle = 'Donasi Berhasil Dibuat! 📦';
        $msgBody = 'Donasi ' . $request->jumlah_donasi . ' ' . $need->satuan . ' ' . $need->nama_kebutuhan . ' sedang diproses.';
        if ($status === 'Menunggu Konfirmasi Jemput') {
            $msgTitle = 'Booking Penjemputan Berhasil! 🤝';
            $msgBody = 'Penjemputan donasi ' . $request->jumlah_donasi . ' ' . $need->satuan . ' ' . $need->nama_kebutuhan . ' sedang menunggu konfirmasi dari pihak panti.';
        } elseif ($status === 'Dikirim') {
            $msgTitle = 'Donasi Berhasil Dikirim! 🚚';
            $msgBody = 'Donasi Anda sebesar ' . $request->jumlah_donasi . ' ' . $need->satuan . ' ' . $need->nama_kebutuhan . ' berhasil dikonfirmasi dikirim.';
        }

        DonaturNotification::kirim(
            Auth::id(),
            'status_update',
            $msgTitle,
            $msgBody,
            ['id_donation' => $donation->id_donation]
        );

        return redirect()->route('donatur.dashboard', ['tab' => 'donasi'])->with('success', 'Donasi berhasil dibuat.');
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
            'Donasi Anda dengan resi ' . ($donation->resi === '-' ? 'Antar Mandiri' : $donation->resi) . ' via ' . $donation->kurir . ' kini berstatus Dikirim.',
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
            'created_at' => $donation->created_at ? $donation->created_at->toIso8601String() : null,
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
