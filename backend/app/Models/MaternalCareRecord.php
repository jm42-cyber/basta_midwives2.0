<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaternalCareRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'age',
        'sex',
        'address',
        'barangay_id',
        'contact_no',
        'civil_status',
        'educational_attainment',
        'occupation',
        'gravida',
        'para',
        'lmp',
        'edd',
        'blood_type',
        'no_of_miscarriages',
        'no_of_stillbirths',
        'no_of_living_children',
        'previous_cesarean',
        'previous_complications',
        'prenatal_visit_1',
        'prenatal_visit_2',
        'prenatal_visit_3',
        'prenatal_visit_4',
        'fundal_height',
        'fetal_heart_rate',
        'fetal_presentation',
        'edema',
        'proteinuria',
        'weight_monitoring',
        'bp_monitoring',
        'hemoglobin',
        'blood_sugar',
        'urinalysis_result',
        'ultrasound_date',
        'ultrasound_findings',
        'has_hypertension',
        'has_gestational_diabetes',
        'has_multiple_pregnancy',
        'has_placenta_previa',
        'has_preeclampsia',
        'birth_plan',
        'preferred_delivery_place',
        'emergency_contact',
        'emergency_contact_number',
        'philhealth_member',
        'date_tt1',
        'date_tt2',
        'date_tt3',
        'date_tt4',
        'date_tt5',
        'fim_status',
        'iron_folic',
        'calcium',
        'iodine',
        'bmi',
        'deworm',
        'syphilis_screening',
        'hepa_b_screening',
        'hiv_screening',
        'date_screened',
        'result',
        'remarks',
        'status',
        'created_by',
    ];

    protected $casts = [
        'age' => 'integer',
        'gravida' => 'integer',
        'para' => 'integer',
        'no_of_miscarriages' => 'integer',
        'no_of_stillbirths' => 'integer',
        'no_of_living_children' => 'integer',
        'lmp' => 'date',
        'edd' => 'date',
        'prenatal_visit_1' => 'date',
        'prenatal_visit_2' => 'date',
        'prenatal_visit_3' => 'date',
        'prenatal_visit_4' => 'date',
        'ultrasound_date' => 'date',
        'date_tt1' => 'date',
        'date_tt2' => 'date',
        'date_tt3' => 'date',
        'date_tt4' => 'date',
        'date_tt5' => 'date',
        'date_screened' => 'date',
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
