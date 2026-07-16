<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $table = 'messages';
    protected $primaryKey = 'id_message';

    protected $fillable = [
        'id_chat',
        'id_sender',
        'message',
        'is_read',
    ];

    public function chat()
    {
        return $this->belongsTo(Chat::class, 'id_chat', 'id_chat');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'id_sender', 'id_user');
    }
}
