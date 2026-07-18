<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_pelapor',
        'tipe_laporan',
        'id_target',
        'judul_target',
        'alasan',
        'catatan_tambahan',
        'status',
    ];

    public function pelapor()
    {
        return $this->belongsTo(User::class, 'id_pelapor', 'id_user');
    }
}
