<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashDonation extends Model
{
    use HasFactory;

    protected $table = 'cash_donations';
    protected $primaryKey = 'id_cash_donation';

    protected $fillable = [
        'id_donor',
        'id_shelter',
        'nominal',
        'metode_pembayaran',
        'pesan',
        'is_anonim',
        'developer_tip',
        'status',
    ];

    protected $casts = [
        'is_anonim' => 'boolean',
        'developer_tip' => 'boolean',
    ];

    public function donor()
    {
        return $this->belongsTo(Donor::class, 'id_donor', 'id_donor');
    }

    public function shelter()
    {
        return $this->belongsTo(Shelter::class, 'id_shelter', 'id_shelter');
    }
}
