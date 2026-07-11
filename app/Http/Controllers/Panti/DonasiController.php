<?php

namespace App\Http\Controllers\Panti;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\Shelter;
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

        // Validasi file bukti penerimaan
        $request->validate([
            'bukti_penerimaan' => 'required|image|max:5120', // Maks 5MB
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

        // Perbarui status donasi menjadi 'Diterima'
        $donation->status = 'Diterima';
        $donation->save();

        // Update jumlah terkumpul di tabel needs
        $need = $donation->need;
        if ($need) {
            $need->terkumpul += $donation->jumlah_donasi;
            $need->save();
        }

        return redirect()->route('panti.dashboard', ['tab' => 'donasi'])->with('success', 'Donasi berhasil dikonfirmasi dan diterima.');
    }
}
