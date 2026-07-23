<?php

namespace App\Http\Controllers\Donatur;

use App\Http\Controllers\Controller;
use App\Models\Shelter;
use App\Models\Need;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PantiController extends Controller
{
    public function show($id)
    {
        // 1. Ambil data Panti
        $panti = Shelter::with('user')->findOrFail($id);
        $this->filterTakedownPosts($panti);

        $needs = Need::where('id_shelter', $id)
            ->where('terkumpul', '<', \DB::raw('jumlah'))
            ->get()
            ->map(function ($need) {
                $reserved = \App\Models\Donation::where('id_needs', $need->id_needs)
                    ->whereIn('status', ['Diproses', 'Menunggu Konfirmasi Jemput', 'Akan Dijemput', 'Dikirim'])
                    ->sum('jumlah_donasi');
                $need->remaining = max(0, $need->jumlah - ($need->terkumpul + $reserved));
                return $need;
            });

        // 3. Render ke React (Inertia)
        return Inertia::render('Donatur/ProfilPantiDetail', [
            'panti' => $panti,
            'needs' => $needs
        ]);
    }

    public function showPublic($id)
    {
        // 1. Ambil data Panti
        $panti = Shelter::with('user')->findOrFail($id);
        $this->filterTakedownPosts($panti);

        $needs = Need::where('id_shelter', $id)
            ->where('terkumpul', '<', \DB::raw('jumlah'))
            ->get()
            ->map(function ($need) {
                $reserved = \App\Models\Donation::where('id_needs', $need->id_needs)
                    ->whereIn('status', ['Diproses', 'Menunggu Konfirmasi Jemput', 'Akan Dijemput', 'Dikirim'])
                    ->sum('jumlah_donasi');
                $need->remaining = max(0, $need->jumlah - ($need->terkumpul + $reserved));
                return $need;
            });

        // 3. Render ke React (Inertia) - Versi Publik
        return Inertia::render('ProfilPantiDetail', [
            'panti' => $panti,
            'needs' => $needs
        ]);
    }

    private function filterTakedownPosts($panti)
    {
        $takedownIds = Report::where('tindakan_admin', 'takedown')
            ->pluck('id_target')
            ->map(fn($id) => (string)$id)
            ->toArray();

        if ($panti && is_array($panti->posts)) {
            $panti->posts = array_values(array_filter($panti->posts, function ($p) use ($takedownIds) {
                $postId = is_array($p) ? (string)($p['id'] ?? '') : '';
                return !in_array($postId, $takedownIds);
            }));
        }
    }
}