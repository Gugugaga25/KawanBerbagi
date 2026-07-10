<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Need;
use Illuminate\Http\Request;

class KebutuhanController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_shelter' => 'required|exists:shelters,id_shelter',
            'nama_kebutuhan' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'satuan' => 'required|string|max:50',
            'is_mendesak' => 'boolean',
        ]);

        Need::create([
            'id_shelter' => $request->id_shelter,
            'nama_kebutuhan' => $request->nama_kebutuhan,
            'jumlah' => $request->jumlah,
            'terkumpul' => 0,
            'satuan' => $request->satuan,
            'is_mendesak' => $request->boolean('is_mendesak'),
        ]);

        return redirect()->route('admin.dashboard', ['tab' => 'kebutuhan'])->with('success', 'Kebutuhan panti berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $need = Need::findOrFail($id);

        $request->validate([
            'id_shelter' => 'required|exists:shelters,id_shelter',
            'nama_kebutuhan' => 'required|string|max:255',
            'jumlah' => 'required|integer|min:1',
            'satuan' => 'required|string|max:50',
            'is_mendesak' => 'boolean',
        ]);

        $need->update([
            'id_shelter' => $request->id_shelter,
            'nama_kebutuhan' => $request->nama_kebutuhan,
            'jumlah' => $request->jumlah,
            'satuan' => $request->satuan,
            'is_mendesak' => $request->boolean('is_mendesak'),
        ]);

        return redirect()->route('admin.dashboard', ['tab' => 'kebutuhan'])->with('success', 'Data kebutuhan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $need = Need::findOrFail($id);
        $need->delete();

        return redirect()->route('admin.dashboard', ['tab' => 'kebutuhan'])->with('success', 'Data kebutuhan berhasil dihapus.');
    }
}
