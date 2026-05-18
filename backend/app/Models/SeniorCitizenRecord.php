<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeniorCitizenRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'sex',
        'age',
        'address',
        'barangay_id',
        'contact_no',
        'civil_status',
        'occupation',
        'educational_attainment',
        'blood_pressure',
        'weight',
        'height',
        'bmi',
        'temperature',
        'heart_rate',
        'respiratory_rate',
        'has_hypertension',
        'has_diabetes',
        'has_heart_disease',
        'has_kidney_disease',
        'has_arthritis',
        'has_copd_asthma',
        'has_dementia',
        'maintenance_medications',
        'medication_allergies',
        'mobility_status',
        'adl_score',
        'fall_history',
        'uses_assistive_device',
        'memory_status',
        'dementia_screening_result',
        'blood_sugar_level',
        'cholesterol_level',
        'tb_screening',
        'cancer_screening',
        'living_arrangement',
        'primary_caregiver',
        'emergency_contact',
        'emergency_contact_number',
        'nutritional_status',
        'special_diet',
        'special_diet_details',
        'has_dentures',
        'last_dental_visit',
        'eye_complaints',
        'visual_acuity',
        'with_eye_problem',
        'pinhole_vision_result',
        'date_referred',
        'management',
        'ppv_immunization_date',
        'influenza_immunization_date',
        'remarks',
        'status',
        'created_by',
    ];

    protected $casts = [
        'age' => 'integer',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
        'bmi' => 'decimal:2',
        'temperature' => 'decimal:1',
        'heart_rate' => 'integer',
        'respiratory_rate' => 'integer',
        'last_dental_visit' => 'date',
        'date_referred' => 'date',
        'ppv_immunization_date' => 'date',
        'influenza_immunization_date' => 'date',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
