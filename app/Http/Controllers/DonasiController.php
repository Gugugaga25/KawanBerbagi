<?php

namespace App\Http\Controllers;

use App\Models\Shelter;
use App\Models\Donor;
use App\Models\CashDonation;
use App\Models\DonaturNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonasiController extends Controller
{
    public function create($id)
    {
        // Ambil data panti berdasarkan id_shelter
        $panti = Shelter::findOrFail($id);

        // Ambil donasi tunai yang sukses
        $cashDonations = \App\Models\CashDonation::where('id_shelter', $id)
            ->where('status', 'Sukses')
            ->with('donor')
            ->get()
            ->map(function ($c) {
                return [
                    'id' => 'C-' . $c->id_cash_donation,
                    'name' => $c->is_anonim ? 'Anonim' : ($c->donor ? $c->donor->nama_lengkap : 'Anonim'),
                    'amount' => $c->nominal,
                    'time' => $c->created_at ? $c->created_at->diffForHumans() : '-',
                    'timestamp' => $c->created_at,
                    'type' => 'Dana'
                ];
            });

        // Ambil donasi barang
        $goodsDonations = \App\Models\Donation::whereIn('id_needs', function ($query) use ($id) {
                $query->select('id_needs')->from('needs')->where('id_shelter', $id);
            })
            ->with(['need', 'donor'])
            ->get()
            ->map(function ($g) {
                return [
                    'id' => 'G-' . $g->id_donation,
                    'name' => $g->is_anonim ? 'Anonim' : ($g->donor ? $g->donor->nama_lengkap : 'Anonim'),
                    'amount' => $g->jumlah_donasi . ' ' . ($g->need ? $g->need->satuan : 'Pcs'),
                    'time' => $g->created_at ? $g->created_at->diffForHumans() : '-',
                    'timestamp' => $g->created_at,
                    'type' => 'Barang'
                ];
            });

        // Gabungkan dan urutkan berdasarkan waktu terbaru
        $recentDonors = $cashDonations->concat($goodsDonations)
            ->sortByDesc('timestamp')
            ->take(5)
            ->values()
            ->all();

        return Inertia::render('Donatur/DonasiUang', [
            'panti' => [
                'id' => $panti->id_shelter,
                'nama_yayasan' => $panti->nama_yayasan,
            ],
            'recentDonors' => $recentDonors
        ]);
    }

    public function store(Request $request)
    {
        $donor = Donor::where('id_user', auth()->id())->firstOrFail();

        $request->validate([
            'id_shelter' => 'required|exists:shelters,id_shelter',
            'nominal' => 'required|numeric|min:10000',
            'metode_pembayaran' => 'required|string',
            'pesan' => 'nullable|string',
            'is_anonim' => 'required|boolean',
            'developer_tip' => 'required|boolean',
        ]);

        $cashDonation = CashDonation::create([
            'id_donor' => $donor->id_donor,
            'id_shelter' => $request->id_shelter,
            'nominal' => $request->nominal,
            'metode_pembayaran' => $request->metode_pembayaran,
            'pesan' => $request->pesan,
            'is_anonim' => $request->is_anonim,
            'developer_tip' => $request->developer_tip,
            'status' => 'Pending',
        ]);

        return redirect()->route('donasi.checkout_simulasi', ['id' => $cashDonation->id_cash_donation]);
    }

    public function checkoutSimulasi($id)
    {
        $donation = CashDonation::with('shelter')->findOrFail($id);
        $donor = Donor::where('id_user', auth()->id())->firstOrFail();

        if ($donation->id_donor !== $donor->id_donor) {
            abort(403, 'Unauthorized access to donation payment.');
        }

        return Inertia::render('Donatur/DonasiUangSimulasi', [
            'donation' => $donation,
            'panti' => [
                'nama_yayasan' => $donation->shelter->nama_yayasan,
            ]
        ]);
    }

    public function bayarSimulasi($id)
    {
        $donation = CashDonation::with(['shelter', 'donor'])->findOrFail($id);
        $donor = Donor::where('id_user', auth()->id())->firstOrFail();

        if ($donation->id_donor !== $donor->id_donor) {
            abort(403, 'Unauthorized access.');
        }

        $donation->update(['status' => 'Sukses']);

        // Kirim notifikasi ke panti
        $pantiUserId = $donation->shelter->id_user;
        if ($pantiUserId) {
            DonaturNotification::kirim(
                $pantiUserId,
                'status_update',
                'Donasi Tunai Baru Masuk! 💰',
                'Panti Anda mendapatkan donasi tunai baru sebesar Rp ' . number_format($donation->nominal) . ' dari ' . ($donation->is_anonim ? 'Anonim' : $donation->donor->nama_lengkap) . '.',
                ['id_cash_donation' => $donation->id_cash_donation]
            );
        }

        return redirect()->route('donatur.dashboard', ['tab' => 'donasi'])->with('success', 'Donasi berhasil disimulasikan! Terima kasih orang baik.');
    }
}