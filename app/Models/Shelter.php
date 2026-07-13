<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shelter extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_shelter';

    protected $fillable = [
        'id_user',
        'nama_yayasan',
        'nama_penanggung_jawab',
        'alamat',
        'no_telepon',
        'jumlah_anak',
        'status',
        'akta_yayasan',
        'sk_kemenkumham',
        'izin_operasional',
        'npwp_yayasan',
        'dokumentasi_panti',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function needs()
    {
        return $this->hasMany(Need::class, 'id_shelter', 'id_shelter');
    }
}
