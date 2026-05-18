<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Family Planning Records</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 8px; margin: 20px; }
        .header { text-align: center; margin-bottom: 15px; }
        .title { font-size: 16px; font-weight: bold; color: #7C3AED; margin-bottom: 5px; }
        .info { font-size: 8px; font-style: italic; color: #6B7280; margin-bottom: 10px; }
        .record { margin-bottom: 15px; page-break-inside: avoid; }
        .record-header { background: #7C3AED; color: white; padding: 8px; font-weight: bold; font-size: 10px; }
        .record-header span { margin-right: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        th { background: #EDE9FE; padding: 5px; text-align: left; font-weight: bold; font-size: 7px; border: 1px solid #E5E7EB; }
        td { padding: 4px; border: 1px solid #E5E7EB; font-size: 7px; }
        .label { color: #6B7280; font-weight: bold; width: 28%; }
        .section-title { background: #DDD6FE; padding: 4px; font-weight: bold; text-align: center; margin-top: 3px; font-size: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">FAMILY PLANNING RECORDS - COMPLETE EXPORT</div>
        <div class="info">
            @if($startDate && $endDate)
                Period: {{ $startDate }} to {{ $endDate }} |
            @endif
            Generated: {{ now()->format('Y-m-d H:i') }} | Total: {{ $records->count() }} records
        </div>
    </div>

    @foreach($records as $index => $record)
    <div class="record">
        <div class="record-header">
            <span>#{{ $index + 1 }}</span>
            <span>{{ strtoupper($record->first_name . ' ' . ($record->middle_name ? $record->middle_name . ' ' : '') . $record->last_name) }}</span>
            <span>{{ $record->sex }}</span>
            <span>Age: {{ $record->age ?? 'N/A' }}</span>
            <span>{{ $record->barangay->name ?? 'N/A' }}</span>
        </div>

        <table>
            <tr>
                <td colspan="4" class="section-title">PERSONAL INFORMATION</td>
            </tr>
            <tr>
                <td class="label">Name:</td>
                <td>{{ $record->first_name }} {{ $record->middle_name }} {{ $record->last_name }}</td>
                <td class="label">Sex:</td>
                <td>{{ $record->sex }}</td>
            </tr>
            <tr>
                <td class="label">Age:</td>
                <td>{{ $record->age ?? 'N/A' }}</td>
                <td class="label">Civil Status:</td>
                <td>{{ $record->civil_status ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Education:</td>
                <td>{{ $record->educational_attainment ?? 'N/A' }}</td>
                <td class="label">Occupation:</td>
                <td>{{ $record->occupation ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Address:</td>
                <td>{{ $record->address ?? 'N/A' }}</td>
                <td class="label">Contact:</td>
                <td>{{ $record->contact_no ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Living Children:</td>
                <td colspan="3">{{ $record->no_of_living_children ?? 'N/A' }}</td>
            </tr>

            <tr>
                <td colspan="4" class="section-title">PARTNER INFORMATION</td>
            </tr>
            <tr>
                <td class="label">Partner Name:</td>
                <td>{{ $record->partner_name ?? 'N/A' }}</td>
                <td class="label">Partner Age:</td>
                <td>{{ $record->partner_age ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Partner Occupation:</td>
                <td>{{ $record->partner_occupation ?? 'N/A' }}</td>
                <td class="label">Partner Consent:</td>
                <td>{{ $record->partner_consent ?? 'N/A' }}</td>
            </tr>

            <tr>
                <td colspan="4" class="section-title">MEDICAL HISTORY</td>
            </tr>
            <tr>
                <td class="label">Allergies:</td>
                <td colspan="3">{{ $record->allergies ?? 'None' }}</td>
            </tr>
            <tr>
                <td class="label">Current Medications:</td>
                <td colspan="3">{{ $record->current_medications ?? 'None' }}</td>
            </tr>
            <tr>
                <td class="label">Medical Conditions:</td>
                <td colspan="3">{{ $record->medical_conditions ?? 'None' }}</td>
            </tr>
            <tr>
                <td class="label">Previous Surgeries:</td>
                <td colspan="3">{{ $record->previous_surgeries ?? 'None' }}</td>
            </tr>

            <tr>
                <td colspan="4" class="section-title">REPRODUCTIVE HISTORY</td>
            </tr>
            <tr>
                <td class="label">Last Childbirth:</td>
                <td>{{ $record->last_childbirth_date ? $record->last_childbirth_date->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">Miscarriages:</td>
                <td>{{ $record->no_of_miscarriages ?? '0' }}</td>
            </tr>
            <tr>
                <td class="label">Stillbirths:</td>
                <td>{{ $record->no_of_stillbirths ?? '0' }}</td>
                <td class="label">Youngest Child Age:</td>
                <td>{{ $record->youngest_child_age ?? 'N/A' }}</td>
            </tr>

            <tr>
                <td colspan="4" class="section-title">PHYSICAL EXAMINATION</td>
            </tr>
            <tr>
                <td class="label">Blood Pressure:</td>
                <td>{{ $record->blood_pressure ?? 'N/A' }}</td>
                <td class="label">Weight:</td>
                <td>{{ $record->weight ? $record->weight . ' kg' : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Height:</td>
                <td>{{ $record->height ? $record->height . ' cm' : 'N/A' }}</td>
                <td class="label">BMI:</td>
                <td>{{ $record->bmi ?? 'N/A' }}</td>
            </tr>

            <tr>
                <td colspan="4" class="section-title">RISK SCREENING</td>
            </tr>
            <tr>
                <td class="label">Smoker:</td>
                <td>{{ $record->smoker ?? 'N/A' }}</td>
                <td class="label">Blood Clots History:</td>
                <td>{{ $record->history_blood_clots ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Cancer History:</td>
                <td>{{ $record->history_cancer ?? 'N/A' }}</td>
                <td class="label">Stroke History:</td>
                <td>{{ $record->history_stroke ?? 'N/A' }}</td>
            </tr>

            <tr>
                <td colspan="4" class="section-title">FAMILY PLANNING DETAILS</td>
            </tr>
            <tr>
                <td class="label">Date of Visit:</td>
                <td>{{ $record->date_of_visit ? $record->date_of_visit->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">Client Type:</td>
                <td>{{ $record->type_of_client ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Date Accepted:</td>
                <td>{{ $record->date_accepted ? $record->date_accepted->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">FP Method:</td>
                <td>{{ $record->type_of_fp_method ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Date Started:</td>
                <td>{{ $record->date_started ? $record->date_started->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">Follow-up Date:</td>
                <td>{{ $record->date_of_followup ? $record->date_of_followup->format('Y-m-d') : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Side Effects/Remarks:</td>
                <td colspan="3">{{ $record->remarks_side_effects ?? 'None' }}</td>
            </tr>
            <tr>
                <td class="label">Method Changed:</td>
                <td>{{ $record->method_changed ?? 'N/A' }}</td>
                <td class="label">New Method:</td>
                <td>{{ $record->new_method ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Reason for Change:</td>
                <td colspan="3">{{ $record->reason_for_change ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Midwife Name:</td>
                <td>{{ $record->midwife_name ?? 'N/A' }}</td>
                <td class="label">LMP:</td>
                <td>{{ $record->lmp ? $record->lmp->format('Y-m-d') : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Pregnancy Test:</td>
                <td>{{ $record->pregnancy_test_result ?? 'N/A' }}</td>
                <td class="label">Source of Supply:</td>
                <td>{{ $record->source_of_supply ?? 'N/A' }}</td>
            </tr>

            <tr>
                <td colspan="4" class="section-title">FOLLOW-UP DETAILS</td>
            </tr>
            <tr>
                <td class="label">Last Supply Date:</td>
                <td>{{ $record->date_of_last_supply ? $record->date_of_last_supply->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">Quantity Given:</td>
                <td>{{ $record->quantity_given ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Next Supply Date:</td>
                <td>{{ $record->next_supply_date ? $record->next_supply_date->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">Adherence Notes:</td>
                <td>{{ $record->adherence_notes ?? 'N/A' }}</td>
            </tr>

            <tr>
                <td class="label">General Remarks:</td>
                <td colspan="3">{{ $record->remarks ?? 'None' }}</td>
            </tr>
            <tr>
                <td class="label">Created By:</td>
                <td>{{ $record->creator->full_name ?? 'System' }}</td>
                <td class="label">Date Created:</td>
                <td>{{ $record->created_at->format('Y-m-d H:i') }}</td>
            </tr>
        </table>
    </div>
    @endforeach
</body>
</html>
