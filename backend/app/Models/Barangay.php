<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'contact_number',
        'barangay_captain',
        'health_officer',
        'population',
        'population_male',
        'population_female',
        'population_children',
        'coverage_area',
    ];

    protected $casts = [
        'population' => 'integer',
        'population_male' => 'integer',
        'population_female' => 'integer',
        'population_children' => 'integer',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_barangays');
    }

    public function immunizationRecords()
    {
        return $this->hasMany(ImmunizationRecord::class);
    }

    public function familyPlanningRecords()
    {
        return $this->hasMany(FamilyPlanningRecord::class);
    }

    public function maternalCareRecords()
    {
        return $this->hasMany(MaternalCareRecord::class);
    }

    public function seniorCitizenRecords()
    {
        return $this->hasMany(SeniorCitizenRecord::class);
    }
}
