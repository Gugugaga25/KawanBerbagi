<?php

namespace App\Http\Controllers\Panti;

use App\Http\Controllers\Controller;
use App\Models\Shelter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfilController extends Controller
{
    /**
     * Perbarui data profil shelter panti.
     */
    public function update(Request $request)
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();

        $request->validate([
            'nama_yayasan' => 'required|string|max:255',
            'no_telepon' => 'nullable|string|max:50',
            'jumlah_anak' => 'nullable|integer|min:0',
            'alamat' => 'required|string',
        ]);

        $shelter->update([
            'nama_yayasan' => $request->nama_yayasan,
            'no_telepon' => $request->no_telepon,
            'jumlah_anak' => $request->jumlah_anak,
            'alamat' => $request->alamat,
        ]);

        return redirect()->route('panti.dashboard', ['tab' => 'profil'])->with('success', 'Profil panti berhasil diperbarui.');
    }
}
