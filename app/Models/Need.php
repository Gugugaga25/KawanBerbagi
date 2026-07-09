<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Need extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_needs';

    protected $fillable = [
        'id_shelter',
        'nama_kebutuhan',
        'jumlah',
    ];

    public function shelter()
    {
        return $this->belongsTo(Shelter::class, 'id_shelter', 'id_shelter');
    }
}
