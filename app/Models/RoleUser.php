<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleUser extends Model
{
    use HasFactory;

    protected $table = 'role_users';
    protected $primaryKey = 'id_role_user';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_role_user',
        'role',
    ];
}
