<?php

namespace App\Http\Controllers\Panti;

use App\Http\Controllers\Controller;
use App\Models\Shelter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfilController extends Controller
{
    /**
     * Perbarui data profil shelter panti.
     */
    public function update(Request $request)
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();
        if (empty($request->username) && !empty($request->nama_yayasan)) {
            $baseUsername = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $request->nama_yayasan));
            $request->merge(['username' => $baseUsername]);
        }

        $request->validate([
            'nama_yayasan' => 'required|string|max:255',
            'no_telepon' => 'nullable|string|max:50',
            'jumlah_anak' => 'nullable|integer|min:0',
            'alamat' => 'required|string',
            'deskripsi' => 'nullable|string',
            'website' => 'nullable|string',
            'tahun_berdiri' => 'nullable|string',
            'username' => 'nullable|string|max:255|alpha_dash|unique:shelters,username,' . $shelter->id_shelter . ',id_shelter',
            'email' => 'nullable|email',
        ]);

        $shelter->update([
            'nama_yayasan' => $request->nama_yayasan,
            'no_telepon' => $request->no_telepon,
            'jumlah_anak' => $request->jumlah_anak,
            'alamat' => $request->alamat,
            'deskripsi' => $request->deskripsi,
            'website' => $request->website,
            'tahun_berdiri' => $request->tahun_berdiri,
            'username' => $request->username,
        ]);

        if ($shelter->user && $request->filled('email')) {
            $shelter->user->update(['email' => $request->email]);
        }

        return redirect()->route('panti.dashboard', ['tab' => 'profil'])->with('success', 'Profil panti berhasil diperbarui.');
    }

    public function updateFoto(Request $request)
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();
        $request->validate(['foto_profil' => 'required|image|max:5120']);

        if ($request->hasFile('foto_profil')) {
            if ($shelter->foto_profil) Storage::disk('public')->delete($shelter->foto_profil);
            $path = $request->file('foto_profil')->store('panti/profil', 'public');
            $shelter->update(['foto_profil' => $path]);
        }

        return back()->with('success', 'Foto profil diperbarui.');
    }

    // ================= FUNGSI HAPUS FOTO PROFIL =================
    public function deleteFoto()
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();

        if ($shelter->foto_profil) {
            if (Storage::disk('public')->exists($shelter->foto_profil)) {
                Storage::disk('public')->delete($shelter->foto_profil);
            }
            $shelter->update(['foto_profil' => null]);
        }

        return back()->with('success', 'Foto profil berhasil dihapus.');
    }
    // ============================================================

    public function updateBanner(Request $request)
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();
        $request->validate(['foto_banner' => 'required|image|max:5120']);

        if ($request->hasFile('foto_banner')) {
            if ($shelter->foto_banner) Storage::disk('public')->delete($shelter->foto_banner);
            $path = $request->file('foto_banner')->store('panti/banner', 'public');
            $shelter->update(['foto_banner' => $path]);
        }

        return back()->with('success', 'Banner panti diperbarui.');
    }

    // ================= FUNGSI HAPUS BANNER =================
    public function deleteBanner()
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();

        if ($shelter->foto_banner) {
            if (Storage::disk('public')->exists($shelter->foto_banner)) {
                Storage::disk('public')->delete($shelter->foto_banner);
            }
            $shelter->update(['foto_banner' => null]);
        }

        return back()->with('success', 'Banner panti berhasil dihapus.');
    }
    // =======================================================

    public function storePost(Request $request)
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();
        $request->validate([
            'content' => 'nullable|string',
            'image' => 'nullable|image|max:5120'
        ]);

        if (!$request->filled('content') && !$request->hasFile('image')) {
            return back()->withErrors(['content' => 'Postingan harus berisi teks atau foto.']);
        }

        $posts = $shelter->posts ?? [];
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('panti/posts', 'public');
        }

        $newPost = [
            'id' => time(),
            // 👇 DIGANTI MENJADI $request->input('content') BIAR TIDAK MERAH 👇
            'content' => $request->input('content'), 
            'image' => $imagePath,
            'time' => now()->toISOString(),
            'likes' => 0,
            'liked_by' => []
        ];
        
        array_unshift($posts, $newPost);
        $shelter->update(['posts' => $posts]);

        return back()->with('success', 'Postingan berhasil diterbitkan.');
    }

    public function destroyPost($id)
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();
        $posts = collect($shelter->posts ?? [])->filter(fn($p) => $p['id'] != $id)->values()->toArray();
        $shelter->update(['posts' => $posts]);
        return back()->with('success', 'Postingan dihapus.');
    }

    public function storePengurus(Request $request)
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();
        $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'image' => 'nullable|image|max:5120'
        ]);

        $pengurus = $shelter->pengurus ?? [];
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('panti/pengurus', 'public');
        }

        $newPengurus = [
            'id' => time(),
            'nama' => $request->input('nama'),
            'jabatan' => $request->input('jabatan'),
            'image' => $imagePath
        ];
        
        $pengurus[] = $newPengurus;
        $shelter->update(['pengurus' => $pengurus]);

        return back()->with('success', 'Pengurus ditambahkan.');
    }

    public function destroyPengurus($id)
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();
        $pengurus = collect($shelter->pengurus ?? [])->filter(fn($p) => $p['id'] != $id)->values()->toArray();
        $shelter->update(['pengurus' => $pengurus]);
        return back()->with('success', 'Pengurus dihapus.');
    }

    public function storeAudit(Request $request)
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();
        $request->validate([
            'judul' => 'required|string|max:255',
            'file_pdf' => 'required|file|mimes:pdf,xls,xlsx|max:10240'
        ]);

        $audits = $shelter->laporan_audits ?? [];
        $filePath = null;
        if ($request->hasFile('file_pdf')) {
            $filePath = $request->file('file_pdf')->store('panti/audits', 'public');
        }

        $newAudit = [
            'id' => time(),
            'judul' => $request->input('judul'),
            'file_pdf' => $filePath,
            'tanggal' => now()->format('d M Y')
        ];
        
        $audits[] = $newAudit;
        $shelter->update(['laporan_audits' => $audits]);

        return back()->with('success', 'Laporan audit diunggah.');
    }

    public function destroyAudit($id)
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();
        $audits = collect($shelter->laporan_audits ?? [])->filter(fn($a) => $a['id'] != $id)->values()->toArray();
        $shelter->update(['laporan_audits' => $audits]);
        return back()->with('success', 'Laporan audit dihapus.');
    }
}