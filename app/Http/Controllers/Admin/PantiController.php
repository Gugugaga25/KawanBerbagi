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
            'aktaDoc' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'skDoc' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'izinDoc' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'npwpDoc' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'orgPhoto' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $aktaPath = $request->hasFile('aktaDoc') ? $request->file('aktaDoc')->store('legal_docs/akta', 'public') : null;
        $skPath = $request->file('skDoc')->store('legal_docs/sk', 'public');
        $izinPath = $request->file('izinDoc')->store('legal_docs/izin', 'public');
        $npwpPath = $request->hasFile('npwpDoc') ? $request->file('npwpDoc')->store('legal_docs/npwp', 'public') : null;
        $orgPhotoPath = $request->hasFile('orgPhoto') ? $request->file('orgPhoto')->store('org_photos', 'public') : null;

        $user = User::create([
            'id_role_user' => 'RL02PAN',
            'name' => $request->orgName, // Menggunakan nama organisasi sebagai nama user
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $username = strtolower(str_replace(' ', '', $request->orgName));

        Shelter::create([
            'id_user' => $user->id_user,
            'nama_yayasan' => $request->orgName,
            'nama_penanggung_jawab' => $request->picName,
            'alamat' => $request->address,
            'no_telepon' => $request->phone,
            'jumlah_anak' => (int) $request->beneficiaries,
            'status' => 'Pending',
            'akta_yayasan' => $aktaPath,
            'sk_kemenkumham' => $skPath,
            'izin_operasional' => $izinPath,
            'npwp_yayasan' => $npwpPath,
            'dokumentasi_panti' => $orgPhotoPath,
            'username' => $username,
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
            'aktaDoc' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'skDoc' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'izinDoc' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'npwpDoc' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'orgPhoto' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        if ($request->hasFile('aktaDoc')) {
            $shelter->akta_yayasan = $request->file('aktaDoc')->store('legal_docs/akta', 'public');
        }
        if ($request->hasFile('skDoc')) {
            $shelter->sk_kemenkumham = $request->file('skDoc')->store('legal_docs/sk', 'public');
        }
        if ($request->hasFile('izinDoc')) {
            $shelter->izin_operasional = $request->file('izinDoc')->store('legal_docs/izin', 'public');
        }
        if ($request->hasFile('npwpDoc')) {
            $shelter->npwp_yayasan = $request->file('npwpDoc')->store('legal_docs/npwp', 'public');
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
     * Show the verification page for the specified panti.
     */
    public function verification($id)
    {
        $shelter = Shelter::with('user')->findOrFail($id);
        
        $panti = [
            'id' => $shelter->id_shelter,
            'nama' => $shelter->nama_yayasan,
            'alamat' => $shelter->alamat,
            'status' => $shelter->status ?? 'Pending',
            'pimpinan' => $shelter->nama_penanggung_jawab,
            'email' => $shelter->user ? $shelter->user->email : '',
            'phone' => $shelter->no_telepon ?? '',
            'anak' => $shelter->jumlah_anak ?? 0,
            'akta_yayasan' => $shelter->akta_yayasan,
            'sk_kemenkumham' => $shelter->sk_kemenkumham,
            'izin_operasional' => $shelter->izin_operasional,
            'npwp_yayasan' => $shelter->npwp_yayasan,
            'orgPhotoUrl' => $shelter->dokumentasi_panti ? asset('storage/' . $shelter->dokumentasi_panti) : null,
            'created_at' => $shelter->created_at,
        ];

        return \Inertia\Inertia::render('Admin/PantiVerification', [
            'panti' => $panti
        ]);
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

        return redirect('/admin/dashboard?tab=panti')->with('success', 'Status panti berhasil diperbarui');
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
