<?php

namespace App\Http\Controllers\Donatur;

use App\Http\Controllers\Controller;
use App\Models\Shelter;
use App\Services\GeminiService;
use Illuminate\Http\Request;

class AiVisionController extends Controller
{
    public function analyze(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        $file = $request->file('image');
        $mimeType = $file->getMimeType();
        $base64Image = base64_encode(file_get_contents($file->getRealPath()));

        $gemini = new GeminiService();
        $result = $gemini->analyzeImageForDonation($base64Image, $mimeType);

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menganalisis foto barang. Pastikan foto gambar cukup jelas dan coba lagi.',
            ], 422);
        }

        $itemName = $result['item'] ?? '';
        $kategori = $result['kategori'] ?? '';

        $matchingCount = Shelter::where('status', 'Active')
            ->whereHas('needs', function ($q) use ($itemName, $kategori) {
                if ($itemName) {
                    $q->where('nama_kebutuhan', 'like', '%' . $itemName . '%');
                }
                if ($kategori) {
                    $q->orWhere('kategori', 'like', '%' . $kategori . '%');
                }
            })
            ->count();

        return response()->json([
            'success' => true,
            'data' => $result,
            'matching_shelters_count' => $matchingCount,
        ]);
    }
}
