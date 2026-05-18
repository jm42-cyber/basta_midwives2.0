<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImmunizationRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name', 'middle_name', 'last_name', 'mother_name', 'father_guardian_name',
        'sex', 'date_of_birth', 'address', 'barangay_id', 'contact_no',
        'birth_weight', 'birth_length', 'place_of_birth', 'birth_attendant',
        'current_weight', 'current_height', 'head_circumference', 'weight_for_age', 'height_for_age',
        'bcg', 'hepa_b', 'dpt1', 'dpt2', 'dpt3', 'opv1', 'opv2', 'opv3', 'measles',
        'rotavirus1', 'rotavirus2', 'pcv1', 'pcv2', 'pcv3', 'mmr',
        'vit_a_date', 'deworming_date', 'nutritional_status',
        'allergies', 'previous_illnesses', 'congenital_abnormalities', 'remarks',
        'status', 'created_by',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'bcg' => 'date', 'hepa_b' => 'date', 'dpt1' => 'date', 'dpt2' => 'date', 'dpt3' => 'date',
        'opv1' => 'date', 'opv2' => 'date', 'opv3' => 'date', 'measles' => 'date',
        'rotavirus1' => 'date', 'rotavirus2' => 'date', 'pcv1' => 'date', 'pcv2' => 'date', 'pcv3' => 'date', 'mmr' => 'date',
        'vit_a_date' => 'date', 'deworming_date' => 'date',
        'birth_weight' => 'decimal:2', 'birth_length' => 'decimal:2',
        'current_weight' => 'decimal:2', 'current_height' => 'decimal:2', 'head_circumference' => 'decimal:2',
    ];

    protected $appends = ['full_name', 'child_name'];

    public function getFullNameAttribute(): string
    {
        $name = $this->first_name;
        if ($this->middle_name) {
            $name .= ' ' . $this->middle_name;
        }
        $name .= ' ' . $this->last_name;
        return $name;
    }

    public function getChildNameAttribute(): string
    {
        return $this->full_name;
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
