<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Health Records Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #10b981;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #10b981;
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .info-box {
            background: #f3f4f6;
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .info-box p {
            margin: 3px 0;
        }
        .section-title {
            background: #10b981;
            color: white;
            padding: 8px;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 9px;
        }
        table th {
            background: #e5e7eb;
            padding: 6px;
            text-align: left;
            border: 1px solid #d1d5db;
            font-weight: bold;
        }
        table td {
            padding: 5px;
            border: 1px solid #d1d5db;
        }
        table tr:nth-child(even) {
            background: #f9fafb;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 9px;
            color: #666;
            border-top: 1px solid #d1d5db;
            padding-top: 10px;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Health Records Report</h1>
        <p><strong>{{ $program }}</strong></p>
        <p>Generated on: {{ $generatedAt }}</p>
    </div>

    <div class="info-box">
        <p><strong>Report Period:</strong> 
            @if($dateFrom && $dateTo)
                {{ $dateFrom }} to {{ $dateTo }}
            @else
                All Time
            @endif
        </p>
    </div>

    @if(isset($data['immunization']) && $data['immunization']->count() > 0)
        <div class="section-title">Immunization Records ({{ $data['immunization']->count() }})</div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Sex</th>
                    <th>DOB</th>
                    <th>Barangay</th>
                    <th>BCG</th>
                    <th>Hepa B</th>
                    <th>DPT</th>
                    <th>OPV</th>
                    <th>Measles</th>
                    <th>Status</th>
                    <th>Midwife</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data['immunization'] as $record)
                <tr>
                    <td>{{ $record->full_name }}</td>
                    <td>{{ $record->sex }}</td>
                    <td>{{ $record->date_of_birth ? $record->date_of_birth->format('Y-m-d') : '' }}</td>
                    <td>{{ $record->barangay ? $record->barangay->name : '' }}</td>
                    <td>{{ $record->bcg ? '✓' : '' }}</td>
                    <td>{{ $record->hepa_b ? '✓' : '' }}</td>
                    <td>{{ $record->dpt1 && $record->dpt2 && $record->dpt3 ? '✓' : '' }}</td>
                    <td>{{ $record->opv1 && $record->opv2 && $record->opv3 ? '✓' : '' }}</td>
                    <td>{{ $record->measles ? '✓' : '' }}</td>
                    <td>{{ $record->status }}</td>
                    <td>{{ $record->creator ? $record->creator->full_name : '' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    @if(isset($data['maternal_care']) && $data['maternal_care']->count() > 0)
        @if(isset($data['immunization']) && $data['immunization']->count() > 0)
            <div class="page-break"></div>
        @endif
        <div class="section-title">Maternal Care Records ({{ $data['maternal_care']->count() }})</div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Barangay</th>
                    <th>LMP</th>
                    <th>EDD</th>
                    <th>Gravida</th>
                    <th>Para</th>
                    <th>Blood Type</th>
                    <th>Prenatal Visits</th>
                    <th>Status</th>
                    <th>Midwife</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data['maternal_care'] as $record)
                <tr>
                    <td>{{ $record->full_name }}</td>
                    <td>{{ $record->age }}</td>
                    <td>{{ $record->barangay ? $record->barangay->name : '' }}</td>
                    <td>{{ $record->lmp ? $record->lmp->format('Y-m-d') : '' }}</td>
                    <td>{{ $record->edd ? $record->edd->format('Y-m-d') : '' }}</td>
                    <td>{{ $record->gravida }}</td>
                    <td>{{ $record->para }}</td>
                    <td>{{ $record->blood_type }}</td>
                    <td>
                        @php
                            $visits = 0;
                            if($record->prenatal_visit_1) $visits++;
                            if($record->prenatal_visit_2) $visits++;
                            if($record->prenatal_visit_3) $visits++;
                            if($record->prenatal_visit_4) $visits++;
                        @endphp
                        {{ $visits }}/4
                    </td>
                    <td>{{ $record->status }}</td>
                    <td>{{ $record->creator ? $record->creator->full_name : '' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    @if(isset($data['family_planning']) && $data['family_planning']->count() > 0)
        @if((isset($data['immunization']) && $data['immunization']->count() > 0) || (isset($data['maternal_care']) && $data['maternal_care']->count() > 0))
            <div class="page-break"></div>
        @endif
        <div class="section-title">Family Planning Records ({{ $data['family_planning']->count() }})</div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Barangay</th>
                    <th>Civil Status</th>
                    <th>FP Method</th>
                    <th>Date Started</th>
                    <th>Type of Client</th>
                    <th>Living Children</th>
                    <th>Status</th>
                    <th>Midwife</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data['family_planning'] as $record)
                <tr>
                    <td>{{ $record->full_name }}</td>
                    <td>{{ $record->age }}</td>
                    <td>{{ $record->barangay ? $record->barangay->name : '' }}</td>
                    <td>{{ $record->civil_status }}</td>
                    <td>{{ $record->type_of_fp_method }}</td>
                    <td>{{ $record->date_started ? $record->date_started->format('Y-m-d') : '' }}</td>
                    <td>{{ $record->type_of_client }}</td>
                    <td>{{ $record->no_of_living_children }}</td>
                    <td>{{ $record->status }}</td>
                    <td>{{ $record->creator ? $record->creator->full_name : '' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    @if(isset($data['senior_citizen']) && $data['senior_citizen']->count() > 0)
        @if((isset($data['immunization']) && $data['immunization']->count() > 0) || (isset($data['maternal_care']) && $data['maternal_care']->count() > 0) || (isset($data['family_planning']) && $data['family_planning']->count() > 0))
            <div class="page-break"></div>
        @endif
        <div class="section-title">Senior Citizen Records ({{ $data['senior_citizen']->count() }})</div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Sex</th>
                    <th>Barangay</th>
                    <th>Blood Pressure</th>
                    <th>BMI</th>
                    <th>Hypertension</th>
                    <th>Diabetes</th>
                    <th>Mobility</th>
                    <th>Status</th>
                    <th>Midwife</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data['senior_citizen'] as $record)
                <tr>
                    <td>{{ $record->full_name }}</td>
                    <td>{{ $record->age }}</td>
                    <td>{{ $record->sex }}</td>
                    <td>{{ $record->barangay ? $record->barangay->name : '' }}</td>
                    <td>{{ $record->blood_pressure }}</td>
                    <td>{{ $record->bmi }}</td>
                    <td>{{ $record->has_hypertension ? 'Yes' : 'No' }}</td>
                    <td>{{ $record->has_diabetes ? 'Yes' : 'No' }}</td>
                    <td>{{ $record->mobility_status }}</td>
                    <td>{{ $record->status }}</td>
                    <td>{{ $record->creator ? $record->creator->full_name : '' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <div class="footer">
        <p>This is a computer-generated report. No signature required.</p>
        <p>© {{ date('Y') }} Health Management System</p>
    </div>
</body>
</html>
