<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Immunization Records</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 9px; margin: 20px; }
        .header { text-align: center; margin-bottom: 15px; }
        .title { font-size: 16px; font-weight: bold; color: #064E3B; margin-bottom: 5px; }
        .info { font-size: 8px; font-style: italic; color: #6B7280; margin-bottom: 10px; }
        .record { margin-bottom: 15px; page-break-inside: avoid; }
        .record-header { background: #10B981; color: white; padding: 8px; font-weight: bold; font-size: 10px; }
        .record-header span { margin-right: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        th { background: #D1FAE5; padding: 6px; text-align: left; font-weight: bold; font-size: 8px; border: 1px solid #E5E7EB; }
        td { padding: 5px; border: 1px solid #E5E7EB; font-size: 8px; }
        .label { color: #6B7280; font-weight: bold; width: 30%; }
        .section-title { background: #DBEAFE; padding: 5px; font-weight: bold; text-align: center; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">IMMUNIZATION RECORDS - COMPLETE EXPORT</div>
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
            <span>DOB: {{ $record->date_of_birth ? $record->date_of_birth->format('m/d/Y') : 'N/A' }}</span>
            <span>{{ $record->barangay->name ?? 'N/A' }}</span>
        </div>

        <table>
            <tr>
                <td colspan="4" class="section-title">BASIC INFORMATION</td>
            </tr>
            <tr>
                <td class="label">First Name:</td>
                <td>{{ $record->first_name }}</td>
                <td class="label">Middle Name:</td>
                <td>{{ $record->middle_name ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Last Name:</td>
                <td>{{ $record->last_name }}</td>
                <td class="label">Sex:</td>
                <td>{{ $record->sex }}</td>
            </tr>
            <tr>
                <td class="label">Mother:</td>
                <td>{{ $record->mother_name ?? 'N/A' }}</td>
                <td class="label">Father/Guardian:</td>
                <td>{{ $record->father_guardian_name ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Address:</td>
                <td>{{ $record->address ?? 'N/A' }}</td>
                <td class="label">Contact:</td>
                <td>{{ $record->contact_no ?? 'N/A' }}</td>
            </tr>

            <tr>
                <td colspan="4" class="section-title">BIRTH INFORMATION</td>
            </tr>
            <tr>
                <td class="label">Birth Weight:</td>
                <td>{{ $record->birth_weight ? $record->birth_weight . ' kg' : 'N/A' }}</td>
                <td class="label">Birth Length:</td>
                <td>{{ $record->birth_length ? $record->birth_length . ' cm' : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Place of Birth:</td>
                <td>{{ $record->place_of_birth ?? 'N/A' }}</td>
                <td class="label">Attendant:</td>
                <td>{{ $record->birth_attendant ?? 'N/A' }}</td>
            </tr>

            <tr>
                <td colspan="4" class="section-title">CURRENT MEASUREMENTS</td>
            </tr>
            <tr>
                <td class="label">Weight:</td>
                <td>{{ $record->current_weight ? $record->current_weight . ' kg' : 'N/A' }}</td>
                <td class="label">Height:</td>
                <td>{{ $record->current_height ? $record->current_height . ' cm' : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Head Circumference:</td>
                <td>{{ $record->head_circumference ? $record->head_circumference . ' cm' : 'N/A' }}</td>
                <td class="label">Weight-for-Age:</td>
                <td>{{ $record->weight_for_age ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Height-for-Age:</td>
                <td>{{ $record->height_for_age ?? 'N/A' }}</td>
                <td class="label">Nutritional Status:</td>
                <td>{{ $record->nutritional_status ?? 'N/A' }}</td>
            </tr>

            <tr>
                <td colspan="4" class="section-title">VACCINATIONS</td>
            </tr>
            <tr>
                <td class="label">BCG:</td>
                <td>{{ $record->bcg ? $record->bcg->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">Hepa B:</td>
                <td>{{ $record->hepa_b ? $record->hepa_b->format('Y-m-d') : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">DPT-1:</td>
                <td>{{ $record->dpt1 ? $record->dpt1->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">DPT-2:</td>
                <td>{{ $record->dpt2 ? $record->dpt2->format('Y-m-d') : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">DPT-3:</td>
                <td>{{ $record->dpt3 ? $record->dpt3->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">OPV-1:</td>
                <td>{{ $record->opv1 ? $record->opv1->format('Y-m-d') : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">OPV-2:</td>
                <td>{{ $record->opv2 ? $record->opv2->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">OPV-3:</td>
                <td>{{ $record->opv3 ? $record->opv3->format('Y-m-d') : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Measles:</td>
                <td>{{ $record->measles ? $record->measles->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">Rotavirus 1:</td>
                <td>{{ $record->rotavirus1 ? $record->rotavirus1->format('Y-m-d') : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Rotavirus 2:</td>
                <td>{{ $record->rotavirus2 ? $record->rotavirus2->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">PCV 1:</td>
                <td>{{ $record->pcv1 ? $record->pcv1->format('Y-m-d') : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">PCV 2:</td>
                <td>{{ $record->pcv2 ? $record->pcv2->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">PCV 3:</td>
                <td>{{ $record->pcv3 ? $record->pcv3->format('Y-m-d') : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">MMR:</td>
                <td>{{ $record->mmr ? $record->mmr->format('Y-m-d') : 'N/A' }}</td>
                <td class="label">Vitamin A:</td>
                <td>{{ $record->vit_a_date ? $record->vit_a_date->format('Y-m-d') : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Deworming:</td>
                <td colspan="3">{{ $record->deworming_date ? $record->deworming_date->format('Y-m-d') : 'N/A' }}</td>
            </tr>

            <tr>
                <td colspan="4" class="section-title">HEALTH STATUS</td>
            </tr>
            <tr>
                <td class="label">Allergies:</td>
                <td colspan="3">{{ $record->allergies ?? 'None' }}</td>
            </tr>
            <tr>
                <td class="label">Previous Illnesses:</td>
                <td colspan="3">{{ $record->previous_illnesses ?? 'None' }}</td>
            </tr>
            <tr>
                <td class="label">Congenital Abnormalities:</td>
                <td colspan="3">{{ $record->congenital_abnormalities ?? 'None' }}</td>
            </tr>
            <tr>
                <td class="label">Remarks:</td>
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
