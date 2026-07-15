<?php

namespace App\Http\Controllers;

use App\Models\Shelter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonasiController extends Controller
{
    public function create($id)
    {
        // Ambil data panti berdasarkan id_shelter
        $panti = \App\Models\Shelter::findOrFail($id);

        // FIX PATH: Arahkan ke folder Pages/Donatur/DonasiUang.tsx
        return Inertia::render('Donatur/DonasiUang', [
            'panti' => [
                'id' => $panti->id_shelter,
                'nama_yayasan' => $panti->nama_yayasan,
            ]
        ]);
    }
}