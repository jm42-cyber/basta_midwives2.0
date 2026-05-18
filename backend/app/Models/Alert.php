<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'message',
        'type',
        'priority',
        'sender_role',
        'sender_id',
        'recipient_type',
        'recipient_ids',
        'reply',
        'reply_at',
        'read_at',
        'expires_at',
    ];

    protected $casts = [
        'recipient_ids' => 'array',
        'reply_at' => 'datetime',
        'read_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
