<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_donor';

    protected $fillable = [
        'id_user',
        'nama_lengkap',
        'no_wa',
        'kota',
        'foto_profil',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class, 'id_donor', 'id_donor');
    }

    public function cashDonations()
    {
        return $this->hasMany(CashDonation::class, 'id_donor', 'id_donor');
    }
}
