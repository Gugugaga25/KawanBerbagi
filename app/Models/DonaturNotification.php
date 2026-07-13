<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DonaturNotification extends Model
{
    protected $table = 'notifications';

    protected $fillable = [
        'id_user',
        'type',
        'title',
        'body',
        'data',
        'is_read',
    ];

    protected $casts = [
        'data'    => 'array',
        'is_read' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    /**
     * Helper: buat notifikasi baru untuk user tertentu.
     */
    public static function kirim(int $idUser, string $type, string $title, string $body, array $data = []): self
    {
        return self::create([
            'id_user' => $idUser,
            'type'    => $type,
            'title'   => $title,
            'body'    => $body,
            'data'    => $data,
            'is_read' => false,
        ]);
    }
}
