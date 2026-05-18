<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    public $timestamps = false;
    
    protected $fillable = [
        'user_id', 
        'action', 
        'table_name', 
        'record_id', 
        'timestamp'
    ];
    
    protected $casts = [
        'timestamp' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessor for created_at to use timestamp
    public function getCreatedAtAttribute()
    {
        return $this->timestamp;
    }
}
