<?php

namespace App\Http\Controllers;

use App\Models\Need;
use App\Models\DonaturNotification;
use App\Models\Report;
use App\Models\Shelter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'tipe_laporan' => 'required|in:panti,postingan,keuangan',
            'id_target' => 'required|string',
            'judul_target' => 'required|string',
            'target_image' => 'nullable|string',
            'target_content' => 'nullable|string',
            'id_shelter' => 'nullable|integer',
            'alasan' => 'required|string|max:255',
            'catatan_tambahan' => 'nullable|string',
        ]);

        $report = Report::create([
            'id_pelapor' => auth()->user()->id_user,
            'tipe_laporan' => $request->tipe_laporan,
            'id_target' => $request->id_target,
            'judul_target' => $request->judul_target,
            'target_image' => $request->target_image,
            'target_content' => $request->target_content,
            'id_shelter' => $request->id_shelter,
            'alasan' => $request->alasan,
            'catatan_tambahan' => $request->catatan_tambahan,
            'status' => 'pending',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Laporan berhasil dikirim dan akan segera ditinjau oleh tim Admin KawanBerbagi.',
                'report' => $report,
            ]);
        }

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

    public function respond(Request $request, $id)
    {
        $request->validate([
            'tindakan_admin' => 'required|in:peringatan,takedown,ditolak',
            'catatan_admin' => 'required_if:tindakan_admin,peringatan,takedown|nullable|string',
        ]);

        $report = Report::findOrFail($id);
        $tindakan = $request->tindakan_admin;
        $catatan = $request->catatan_admin;

        $report->tindakan_admin = $tindakan;
        $report->catatan_admin = $catatan;

        $shelter = null;
        if ($report->id_shelter) {
            $shelter = Shelter::find($report->id_shelter);
        }

        if (!$shelter && $report->tipe_laporan === 'panti') {
            $shelter = Shelter::find($report->id_target);
        }

        if (!$shelter) {
            $need = Need::find($report->id_target);
            if ($need && $need->id_shelter) {
                $shelter = Shelter::find($need->id_shelter);
            }
        }

        if (!$shelter) {
            $shelter = Shelter::whereNotNull('id_user')->first();
        }

        if ($tindakan === 'peringatan') {
            $report->status = 'selesai';
            $report->save();

            if ($shelter && $shelter->id_user) {
                try {
                    DonaturNotification::kirim(
                        (int)$shelter->id_user,
                        'admin_warning',
                        'Peringatan dari Admin KawanBerbagi',
                        $catatan ?: 'Konten Anda menerima pengaduan. Mohon periksa dan sesuaikan postingan/kebutuhan Anda.',
                        [
                            'report_id' => $report->id,
                            'judul_target' => $report->judul_target,
                            'target_image' => $report->target_image,
                            'target_content' => $report->target_content,
                            'tindakan' => 'peringatan',
                        ]
                    );
                } catch (\Throwable $e) {
                    Log::error('Gagal mengirim notifikasi peringatan: ' . $e->getMessage());
                }
            }
        } elseif ($tindakan === 'takedown') {
            $report->status = 'selesai';
            $report->save();

            if ($report->tipe_laporan === 'postingan' || $report->tipe_laporan === 'panti') {
                try {
                    $need = Need::find($report->id_target);
                    if ($need) {
                        $need->delete();
                    }

                    // Takedown postingan dari kolom JSON posts di seluruh panti
                    $allShelters = Shelter::all();
                    foreach ($allShelters as $s) {
                        if (is_array($s->posts)) {
                            $hasPost = false;
                            $filtered = array_values(array_filter($s->posts, function ($p) use ($report, &$hasPost) {
                                $postId = is_array($p) ? (string)($p['id'] ?? '') : '';
                                if ($postId === (string)$report->id_target) {
                                    $hasPost = true;
                                    return false;
                                }
                                return true;
                            }));
                            if ($hasPost) {
                                $s->posts = $filtered;
                                $s->save();
                            }
                        }
                    }
                } catch (\Throwable $e) {
                    Log::error('Error takedown need/post: ' . $e->getMessage());
                }
            }

            if ($shelter && $shelter->id_user) {
                try {
                    DonaturNotification::kirim(
                        (int)$shelter->id_user,
                        'admin_takedown',
                        'Pemberitahuan Takedown Konten oleh Admin',
                        "Konten '{$report->judul_target}' telah di-takedown oleh Admin KawanBerbagi. Catatan: " . ($catatan ?: 'Tidak memenuhi pedoman komunitas.'),
                        [
                            'report_id' => $report->id,
                            'judul_target' => $report->judul_target,
                            'target_image' => $report->target_image,
                            'target_content' => $report->target_content,
                            'tindakan' => 'takedown',
                        ]
                    );
                } catch (\Throwable $e) {
                    Log::error('Gagal mengirim notifikasi takedown: ' . $e->getMessage());
                }
            }
        } elseif ($tindakan === 'ditolak') {
            $report->status = 'ditolak';
            $report->save();
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Respon laporan berhasil diproses.',
                'report' => $report,
            ]);
        }

        return redirect()->back()->with('success', 'Respon laporan berhasil diproses.');
    }
}
