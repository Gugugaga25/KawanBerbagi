<?php

namespace App\Http\Controllers\Donatur;

use App\Http\Controllers\Controller;
use App\Models\Donor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class ProfilController extends Controller
{
    /**
     * Perbarui data profil donatur (nama, no_wa, kota, foto).
     */
    public function update(Request $request)
    {
        $donor = Donor::where('id_user', Auth::id())->firstOrFail();

        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'no_wa'        => 'nullable|string|max:50',
            'kota'         => 'nullable|string|max:100',
            'foto_profil'  => 'nullable|image|max:2048',
        ]);

        // Proses upload foto jika ada
        if ($request->hasFile('foto_profil')) {
            // Hapus foto lama jika ada
            if ($donor->foto_profil) {
                Storage::disk('public')->delete($donor->foto_profil);
            }
            $path = $request->file('foto_profil')->store('foto_profil', 'public');
            $donor->foto_profil = $path;
        }

        $donor->nama_lengkap = $request->nama_lengkap;
        $donor->no_wa        = $request->no_wa;
        $donor->kota         = $request->kota;
        $donor->save();

        return back()->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * Perbarui email donatur (tersimpan di tabel users).
     */
    public function updateEmail(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'email' => 'required|email|max:255|unique:users,email,' . $user->id . ',id_user',
        ]);

        $user->email = $request->email;
        $user->save();

        return back()->with('success', 'Email berhasil diperbarui.');
    }

    /**
     * Perbarui kata sandi donatur.
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password'         => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Kata sandi lama tidak sesuai.']);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return back()->with('success', 'Kata sandi berhasil diperbarui.');
    }
}
