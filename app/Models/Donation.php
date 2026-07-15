<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_donation';

    protected $fillable = [
        'id_needs',
        'id_donor',
        'jumlah_donasi',
        'status',
        'kurir',
        'resi',
        'pesan',
        'bukti_penerimaan',
        'ucapan_terimakasih',
    ];

    public function need()
    {
        return $this->belongsTo(Need::class, 'id_needs', 'id_needs');
    }

    public function donor()
    {
        return $this->belongsTo(Donor::class, 'id_donor', 'id_donor');
    }

    public static function cancelExpiredDonations()
    {
        // Gunakan clone/copy agar subHours tidak mengubah value $now utama
        $expiredTime = now()->subHours(24);

        // Cari donasi yang statusnya 'Diproses' (kirim sendiri) dan belum diisi resinya/dikonfirmasi dalam 24 jam
        // ATAU statusnya 'Menunggu Konfirmasi Jemput' dan belum di-approve panti dalam 24 jam
        $expiredDonations = self::where(function($query) use ($expiredTime) {
            $query->where('status', 'Diproses')
                  ->where(function($q) {
                      $q->whereNull('resi')
                        ->orWhere('resi', '')
                        ->orWhere('resi', '-');
                  })
                  ->where('created_at', '<', $expiredTime);
        })->orWhere(function($query) use ($expiredTime) {
            $query->where('status', 'Menunggu Konfirmasi Jemput')
                  ->where('created_at', '<', $expiredTime);
        })->get();

        foreach ($expiredDonations as $donation) {
            $donation->update([
                'status' => 'Batal'
            ]);

            // Kirim notifikasi ke donatur bahwa donasi dibatalkan otomatis
            $donaturUserId = $donation->donor?->id_user ?? null;
            if ($donaturUserId) {
                \App\Models\DonaturNotification::kirim(
                    $donaturUserId,
                    'status_update',
                    'Donasi Dibatalkan Otomatis ⚠️',
                    'Donasi ' . $donation->jumlah_donasi . ' ' . ($donation->need ? $donation->need->satuan : 'Pcs') . ' ' . ($donation->need ? $donation->need->nama_kebutuhan : 'Barang') . ' telah dibatalkan otomatis karena melebihi batas waktu 24 jam.',
                    ['id_donation' => $donation->id_donation]
                );
            }
        }
    }
}

