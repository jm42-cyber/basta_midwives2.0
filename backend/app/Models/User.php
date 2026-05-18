<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'username',
        'email',
        'password',
        'contact_number',
        'role',
        'status',
        'email_verified',
        'verification_token',
        'verification_token_expiry',
        'reset_token',
        'reset_token_expiry',
        'approved_by',
        'approved_at',
        'last_login',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'verification_token',
        'reset_token',
    ];

    protected $casts = [
        'email_verified' => 'boolean',
        'verification_token_expiry' => 'datetime',
        'reset_token_expiry' => 'datetime',
        'approved_at' => 'datetime',
        'last_login' => 'datetime',
        'email_verified_at' => 'datetime',
    ];

    protected $appends = ['full_name'];

    public function getFullNameAttribute(): string
    {
        $name = $this->first_name;
        if ($this->middle_name) {
            $name .= ' ' . $this->middle_name;
        }
        $name .= ' ' . $this->last_name;
        return $name;
    }

    public function barangays()
    {
        return $this->belongsToMany(Barangay::class, 'user_barangays');
    }

    public function immunizationRecords()
    {
        return $this->hasMany(ImmunizationRecord::class, 'created_by');
    }

    public function familyPlanningRecords()
    {
        return $this->hasMany(FamilyPlanningRecord::class, 'created_by');
    }

    public function maternalCareRecords()
    {
        return $this->hasMany(MaternalCareRecord::class, 'created_by');
    }

    public function seniorCitizenRecords()
    {
        return $this->hasMany(SeniorCitizenRecord::class, 'created_by');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isMidwife(): bool
    {
        return $this->role === 'midwife';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}
