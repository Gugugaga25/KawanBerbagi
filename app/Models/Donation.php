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
    ];

    public function need()
    {
        return $this->belongsTo(Need::class, 'id_needs', 'id_needs');
    }

    public function donor()
    {
        return $this->belongsTo(Donor::class, 'id_donor', 'id_donor');
    }
}
