<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Shelter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class PantiController extends Controller
{
    /**
     * Store a newly created panti in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'orgName' => 'required|string|max:255',
            'picName' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone' => 'required|string|max:20',
            'beneficiaries' => 'required|integer|min:0',
            'address' => 'required|string',
            'legalDoc' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'orgPhoto' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $legalDocPath = $request->file('legalDoc')->store('legal_docs', 'public');
        $orgPhotoPath = $request->hasFile('orgPhoto') ? $request->file('orgPhoto')->store('org_photos', 'public') : null;

        $user = User::create([
            'id_role_user' => 'RL02PAN',
            'name' => $request->orgName, // Menggunakan nama organisasi sebagai nama user
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        Shelter::create([
            'id_user' => $user->id_user,
            'nama_yayasan' => $request->orgName,
            'nama_penanggung_jawab' => $request->picName,
            'alamat' => $request->address,
            'no_telepon' => $request->phone,
            'jumlah_anak' => (int) $request->beneficiaries,
            'status' => 'Pending',
            'dokumen_legalitas_panti' => $legalDocPath,
            'dokumentasi_panti' => $orgPhotoPath,
        ]);

        // Redirect back dengan pesan sukses, tanpa melakukan auth/login otomatis
        return redirect()->back()->with('success', 'Panti berhasil didaftarkan');
    }

    /**
     * Update the specified panti in storage.
     */
    public function update(Request $request, $id)
    {
        $shelter = Shelter::findOrFail($id);
        $user = User::findOrFail($shelter->id_user);

        $request->validate([
            'orgName' => 'required|string|max:255',
            'picName' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class.',email,'.$user->id_user.',id_user',
            'phone' => 'required|string|max:20',
            'beneficiaries' => 'required|integer|min:0',
            'status' => 'nullable|string|in:Active,Pending,Inactive',
            'address' => 'required|string',
            'legalDoc' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'orgPhoto' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        if ($request->hasFile('legalDoc')) {
            $legalDocPath = $request->file('legalDoc')->store('legal_docs', 'public');
            $shelter->dokumen_legalitas_panti = $legalDocPath;
        }

        if ($request->hasFile('orgPhoto')) {
            $orgPhotoPath = $request->file('orgPhoto')->store('org_photos', 'public');
            $shelter->dokumentasi_panti = $orgPhotoPath;
        }

        $user->name = $request->orgName;
        $user->email = $request->email;
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        $shelter->nama_yayasan = $request->orgName;
        $shelter->nama_penanggung_jawab = $request->picName;
        $shelter->alamat = $request->address;
        $shelter->no_telepon = $request->phone;
        $shelter->jumlah_anak = (int) $request->beneficiaries;
        if ($request->filled('status')) {
            $shelter->status = $request->status;
        }
        $shelter->save();

        return redirect()->back()->with('success', 'Panti berhasil diperbarui');
    }

    /**
     * Update only the status of the specified panti.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:Active,Pending,Inactive',
        ]);

        $shelter = Shelter::findOrFail($id);
        $shelter->status = $request->status;
        $shelter->save();

        return redirect()->back()->with('success', 'Status panti berhasil diperbarui');
    }

    /**
     * Remove the specified panti from storage.
     */
    public function destroy($id)
    {
        $shelter = Shelter::findOrFail($id);
        $user = User::findOrFail($shelter->id_user);
        
        // Menghapus user akan otomatis menghapus shelter karena foreign key constraint (onDelete cascade)
        $user->delete();

        return redirect()->back()->with('success', 'Data panti berhasil dihapus');
    }
}
