<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FamilyPlanningRecord extends Model
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
        'civil_status',
        'educational_attainment',
        'occupation',
        'contact_no',
        'no_of_living_children',
        'partner_name',
        'partner_age',
        'partner_occupation',
        'partner_consent',
        'allergies',
        'current_medications',
        'medical_conditions',
        'previous_surgeries',
        'last_childbirth_date',
        'no_of_miscarriages',
        'no_of_stillbirths',
        'youngest_child_age',
        'blood_pressure',
        'weight',
        'height',
        'bmi',
        'smoker',
        'history_blood_clots',
        'history_cancer',
        'history_stroke',
        'date_of_visit',
        'type_of_client',
        'date_accepted',
        'type_of_fp_method',
        'date_started',
        'remarks_side_effects',
        'date_of_followup',
        'method_changed',
        'new_method',
        'reason_for_change',
        'midwife_name',
        'lmp',
        'pregnancy_test_result',
        'source_of_supply',
        'date_of_last_supply',
        'quantity_given',
        'next_supply_date',
        'adherence_notes',
        'status',
        'created_by',
    ];

    protected $casts = [
        'age' => 'integer',
        'partner_age' => 'integer',
        'no_of_living_children' => 'integer',
        'no_of_miscarriages' => 'integer',
        'no_of_stillbirths' => 'integer',
        'youngest_child_age' => 'integer',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
        'bmi' => 'decimal:2',
        'last_childbirth_date' => 'date',
        'date_of_visit' => 'date',
        'date_accepted' => 'date',
        'date_started' => 'date',
        'date_of_followup' => 'date',
        'lmp' => 'date',
        'date_of_last_supply' => 'date',
        'next_supply_date' => 'date',
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
