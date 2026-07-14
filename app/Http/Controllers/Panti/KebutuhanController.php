<?php

namespace App\Http\Controllers\Panti;

use App\Http\Controllers\Controller;
use App\Models\Need;
use App\Models\Shelter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KebutuhanController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Ambil shelter yang terhubung dengan user yang sedang login
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();

        $request->validate([
            'nama_kebutuhan' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'satuan' => 'required|string|max:50',
            'is_mendesak' => 'boolean',
            'kategori' => 'required|string|max:255',
        ]);

        Need::create([
            'id_shelter' => $shelter->id_shelter,
            'nama_kebutuhan' => $request->nama_kebutuhan,
            'jumlah' => $request->jumlah,
            'terkumpul' => 0,
            'satuan' => $request->satuan,
            'is_mendesak' => $request->boolean('is_mendesak'),
            'kategori' => $request->kategori,
        ]);

        return redirect()->route('panti.dashboard', ['tab' => 'kebutuhan'])->with('success', 'Kebutuhan berhasil diterbitkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();
        $need = Need::where('id_needs', $id)->where('id_shelter', $shelter->id_shelter)->firstOrFail();

        $request->validate([
            'nama_kebutuhan' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'satuan' => 'required|string|max:50',
            'is_mendesak' => 'boolean',
            'kategori' => 'required|string|max:255',
        ]);

        $need->update([
            'nama_kebutuhan' => $request->nama_kebutuhan,
            'jumlah' => $request->jumlah,
            'satuan' => $request->satuan,
            'is_mendesak' => $request->boolean('is_mendesak'),
            'kategori' => $request->kategori,
        ]);

        return redirect()->route('panti.dashboard', ['tab' => 'kebutuhan'])->with('success', 'Kebutuhan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $shelter = Shelter::where('id_user', Auth::id())->firstOrFail();
        $need = Need::where('id_needs', $id)->where('id_shelter', $shelter->id_shelter)->firstOrFail();

        $need->delete();

        return redirect()->route('panti.dashboard', ['tab' => 'kebutuhan'])->with('success', 'Kebutuhan berhasil dihapus.');
    }
}