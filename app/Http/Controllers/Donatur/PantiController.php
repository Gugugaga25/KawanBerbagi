<?php

namespace App\Http\Controllers\Donatur;

use App\Http\Controllers\Controller;
use App\Models\Shelter;
use App\Models\Need;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PantiController extends Controller
{
    public function show($id)
    {
        // 1. Ambil data Panti (sesuaikan nama primary key 'id_shelter' jika di DB Anda berbeda)
        $panti = Shelter::findOrFail($id);

        // 2. Ambil daftar kebutuhan (barang) panti ini yang belum terpenuhi
        // Asumsi: foreign key di tabel needs adalah 'id_shelter'
        $needs = Need::where('id_shelter', $id)
            ->where('terkumpul', '<', \DB::raw('jumlah'))
            ->get();

        // 3. Render ke React (Inertia)
        return Inertia::render('Donatur/ProfilPantiDetail', [
            'panti' => $panti,
            'needs' => $needs
        ]);
    }
}