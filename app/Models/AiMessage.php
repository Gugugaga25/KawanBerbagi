<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiMessage extends Model
{
    use HasFactory;

    protected $table = 'ai_messages';
    protected $primaryKey = 'id_ai_message';

    protected $fillable = [
        'id_donor',
        'sender',
        'message',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function donor()
    {
        return $this->belongsTo(Donor::class, 'id_donor', 'id_donor');
    }
}
