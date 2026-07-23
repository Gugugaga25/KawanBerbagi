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
        'target_image',
        'target_content',
        'id_shelter',
        'alasan',
        'catatan_tambahan',
        'status',
        'tindakan_admin',
        'catatan_admin',
    ];

    public function pelapor()
    {
        return $this->belongsTo(User::class, 'id_pelapor', 'id_user');
    }

    public function shelter()
    {
        return $this->belongsTo(Shelter::class, 'id_shelter', 'id_shelter');
    }
}
