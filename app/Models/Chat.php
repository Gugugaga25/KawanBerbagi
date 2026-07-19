<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $table = 'chats';
    protected $primaryKey = 'id_chat';

    protected $fillable = [
        'id_donor',
        'id_shelter',
        'id_admin',
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'id_admin', 'id_user');
    }

    public function donor()
    {
        return $this->belongsTo(Donor::class, 'id_donor', 'id_donor');
    }

    public function shelter()
    {
        return $this->belongsTo(Shelter::class, 'id_shelter', 'id_shelter');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'id_chat', 'id_chat');
    }
}
