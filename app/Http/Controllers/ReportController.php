<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Report;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'tipe_laporan' => 'required|in:panti,postingan,keuangan',
            'id_target' => 'required|string',
            'judul_target' => 'required|string',
            'alasan' => 'required|string|max:255',
            'catatan_tambahan' => 'nullable|string',
        ]);

        Report::create([
            'id_pelapor' => auth()->user()->id_user,
            'tipe_laporan' => $request->tipe_laporan,
            'id_target' => $request->id_target,
            'judul_target' => $request->judul_target,
            'alasan' => $request->alasan,
            'catatan_tambahan' => $request->catatan_tambahan,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Laporan berhasil dikirim dan akan segera ditinjau oleh tim KawanBerbagi.');
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,diproses,selesai,ditolak',
        ]);

        $report = Report::findOrFail($id);
        $report->status = $request->status;
        $report->save();

        return redirect()->back()->with('success', 'Status laporan berhasil diperbarui.');
    }
}
