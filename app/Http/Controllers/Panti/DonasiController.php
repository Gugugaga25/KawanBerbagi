<?php

namespace App\Http\Controllers\Panti;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\Shelter;
use App\Models\Donor;
use App\Models\DonaturNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DonasiController extends Controller
{
    /**
     * Konfirmasi penerimaan donasi barang fisik.
     */
    public function konfirmasi(Request $request, $id)
    {
        // Ambil shelter yang terhubung dengan user yang sedang login
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();

        // Temukan donasi yang termasuk dalam kebutuhan milik panti ini
        $donation = Donation::where('id_donation', $id)
            ->whereIn('id_needs', function ($query) use ($shelter) {
                $query->select('id_needs')->from('needs')->where('id_shelter', $shelter->id_shelter);
            })
            ->firstOrFail();

        // Validasi file bukti penerimaan dan ucapan terima kasih
        $request->validate([
            'bukti_penerimaan' => 'required|image|max:5120', // Maks 5MB
            'ucapan_terimakasih' => 'nullable|string|max:1000',
        ]);

        // Proses unggah file bukti
        if ($request->hasFile('bukti_penerimaan')) {
            $path = $request->file('bukti_penerimaan')->store('bukti_penerimaan', 'public');
            
            // Hapus file lama jika ada
            if ($donation->bukti_penerimaan) {
                Storage::disk('public')->delete($donation->bukti_penerimaan);
            }

            $donation->bukti_penerimaan = $path;
        }

        // Perbarui status donasi menjadi 'Diterima' dan simpan ucapan terima kasih
        $donation->ucapan_terimakasih = $request->ucapan_terimakasih;
        $donation->status = 'Diterima';
        $donation->save();

        // Update jumlah terkumpul di tabel needs
        $need = $donation->need;
        if ($need) {
            $need->terkumpul += $donation->jumlah_donasi;
            $need->save();
        }

        // Kirim notifikasi ke donatur: donasi telah diterima
        $donaturUserId = $donation->donor?->id_user ?? null;
        if ($donaturUserId) {
            $ucapan = $request->ucapan_terimakasih
                ? '"' . $request->ucapan_terimakasih . '"'
                : 'Terima kasih atas kepedulian Anda!';
            DonaturNotification::kirim(
                $donaturUserId,
                'thank_you',
                'Donasi Anda Telah Diterima! 🎉',
                'Panti ' . $shelter->nama_yayasan . ' telah mengkonfirmasi penerimaan donasi Anda. ' . $ucapan,
                ['id_donation' => $donation->id_donation]
            );
        }

        return redirect()->route('panti.dashboard', ['tab' => 'donasi'])->with('success', 'Donasi berhasil dikonfirmasi dan diterima.');
    }

    /**
     * Konfirmasi kesediaan penjemputan barang donasi.
     */
    public function konfirmasiJemput($id)
    {
        // Ambil shelter yang terhubung dengan user yang sedang login
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();

        // Temukan donasi yang termasuk dalam kebutuhan milik panti ini
        $donation = Donation::where('id_donation', $id)
            ->whereIn('id_needs', function ($query) use ($shelter) {
                $query->select('id_needs')->from('needs')->where('id_shelter', $shelter->id_shelter);
            })
            ->firstOrFail();

        if ($donation->status !== 'Menunggu Konfirmasi Jemput') {
            return back()->withErrors(['status' => 'Status donasi tidak sesuai.']);
        }

        $donation->update([
            'status' => 'Akan Dijemput',
        ]);

        // Kirim notifikasi ke donatur
        $donaturUserId = $donation->donor?->id_user ?? null;
        if ($donaturUserId) {
            DonaturNotification::kirim(
                $donaturUserId,
                'status_update',
                'Penjemputan Dikonfirmasi Panti 🚚',
                'Pihak Panti ' . $shelter->nama_yayasan . ' telah mengonfirmasi akan menjemput donasi Anda. Harap persiapkan barang donasi Anda.',
                ['id_donation' => $donation->id_donation]
            );
        }

        return redirect()->route('panti.dashboard', ['tab' => 'donasi'])->with('success', 'Penjemputan donasi berhasil dikonfirmasi.');
    }
}

