<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Senior Citizen Records</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 9px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { color: #F97316; margin: 0; font-size: 18px; }
        .header p { margin: 5px 0; color: #666; }
        .record { page-break-inside: avoid; margin-bottom: 20px; border: 2px solid #F97316; padding: 10px; }
        .record-header { background: #F97316; color: white; padding: 8px; margin: -10px -10px 10px -10px; font-weight: bold; font-size: 11px; }
        .section { margin-bottom: 10px; }
        .section-title { background: #FED7AA; padding: 5px; font-weight: bold; margin-bottom: 5px; color: #C2410C; }
        .field { margin: 3px 0; }
        .field-label { font-weight: bold; color: #555; }
        .field-value { color: #000; }
        .grid { display: table; width: 100%; }
        .grid-row { display: table-row; }
        .grid-col { display: table-cell; width: 50%; padding: 2px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧓 Senior Citizen Records</h1>
        <p>MediMoms - Santa Cruz, Laguna</p>
        <p>Generated: {{ date('F d, Y h:i A') }}</p>
        <p>Total Records: {{ count($records) }}</p>
    </div>

    @foreach($records as $record)
    <div class="record">
        <div class="record-header">
            {{ $record->first_name }} {{ $record->middle_name }} {{ $record->last_name }} - {{ $record->sex }}, {{ $record->age }} years old
        </div>

        <div class="section">
            <div class="section-title">📋 Personal Information</div>
            <div class="grid">
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Address:</span> <span class="field-value">{{ $record->address }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Barangay:</span> <span class="field-value">{{ $record->barangay->name ?? 'N/A' }}</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Contact No:</span> <span class="field-value">{{ $record->contact_no ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Civil Status:</span> <span class="field-value">{{ $record->civil_status ?? 'N/A' }}</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Occupation:</span> <span class="field-value">{{ $record->occupation ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Educational Attainment:</span> <span class="field-value">{{ $record->educational_attainment ?? 'N/A' }}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">💓 Vital Signs</div>
            <div class="grid">
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Blood Pressure:</span> <span class="field-value">{{ $record->blood_pressure ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Weight:</span> <span class="field-value">{{ $record->weight ?? 'N/A' }} kg</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Height:</span> <span class="field-value">{{ $record->height ?? 'N/A' }} cm</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">BMI:</span> <span class="field-value">{{ $record->bmi ?? 'N/A' }}</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Temperature:</span> <span class="field-value">{{ $record->temperature ?? 'N/A' }} °C</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Heart Rate:</span> <span class="field-value">{{ $record->heart_rate ?? 'N/A' }} bpm</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Respiratory Rate:</span> <span class="field-value">{{ $record->respiratory_rate ?? 'N/A' }} /min</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🏥 Chronic Conditions</div>
            <div class="grid">
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Hypertension:</span> <span class="field-value">{{ $record->has_hypertension ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Diabetes:</span> <span class="field-value">{{ $record->has_diabetes ?? 'N/A' }}</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Heart Disease:</span> <span class="field-value">{{ $record->has_heart_disease ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Kidney Disease:</span> <span class="field-value">{{ $record->has_kidney_disease ?? 'N/A' }}</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Arthritis:</span> <span class="field-value">{{ $record->has_arthritis ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">COPD/Asthma:</span> <span class="field-value">{{ $record->has_copd_asthma ?? 'N/A' }}</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Dementia:</span> <span class="field-value">{{ $record->has_dementia ?? 'N/A' }}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">💊 Medications</div>
            <div class="field"><span class="field-label">Maintenance Medications:</span> <span class="field-value">{{ $record->maintenance_medications ?? 'N/A' }}</span></div>
            <div class="field"><span class="field-label">Medication Allergies:</span> <span class="field-value">{{ $record->medication_allergies ?? 'N/A' }}</span></div>
        </div>

        <div class="section">
            <div class="section-title">🚶 Functional Assessment</div>
            <div class="grid">
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Mobility Status:</span> <span class="field-value">{{ $record->mobility_status ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">ADL Score:</span> <span class="field-value">{{ $record->adl_score ?? 'N/A' }}</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Fall History:</span> <span class="field-value">{{ $record->fall_history ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Uses Assistive Device:</span> <span class="field-value">{{ $record->uses_assistive_device ?? 'N/A' }}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🧠 Cognitive Assessment</div>
            <div class="grid">
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Memory Status:</span> <span class="field-value">{{ $record->memory_status ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Dementia Screening Result:</span> <span class="field-value">{{ $record->dementia_screening_result ?? 'N/A' }}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🔬 Health Screenings</div>
            <div class="grid">
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Blood Sugar Level:</span> <span class="field-value">{{ $record->blood_sugar_level ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Cholesterol Level:</span> <span class="field-value">{{ $record->cholesterol_level ?? 'N/A' }}</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">TB Screening:</span> <span class="field-value">{{ $record->tb_screening ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Cancer Screening:</span> <span class="field-value">{{ $record->cancer_screening ?? 'N/A' }}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">👨‍👩‍👧 Social Support</div>
            <div class="grid">
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Living Arrangement:</span> <span class="field-value">{{ $record->living_arrangement ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Primary Caregiver:</span> <span class="field-value">{{ $record->primary_caregiver ?? 'N/A' }}</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Emergency Contact:</span> <span class="field-value">{{ $record->emergency_contact ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Emergency Contact Number:</span> <span class="field-value">{{ $record->emergency_contact_number ?? 'N/A' }}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🍎 Nutrition</div>
            <div class="grid">
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Nutritional Status:</span> <span class="field-value">{{ $record->nutritional_status ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Special Diet:</span> <span class="field-value">{{ $record->special_diet ?? 'N/A' }}</span></div>
                    </div>
                </div>
                @if($record->special_diet === 'Yes')
                <div class="grid-row">
                    <div class="grid-col" colspan="2">
                        <div class="field"><span class="field-label">Special Diet Details:</span> <span class="field-value">{{ $record->special_diet_details ?? 'N/A' }}</span></div>
                    </div>
                </div>
                @endif
            </div>
        </div>

        <div class="section">
            <div class="section-title">🦷 Dental Health</div>
            <div class="grid">
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Has Dentures:</span> <span class="field-value">{{ $record->has_dentures ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Last Dental Visit:</span> <span class="field-value">{{ $record->last_dental_visit ?? 'N/A' }}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">👁️ Visual Screening</div>
            <div class="grid">
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Eye Complaints:</span> <span class="field-value">{{ $record->eye_complaints ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Visual Acuity:</span> <span class="field-value">{{ $record->visual_acuity ?? 'N/A' }}</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">With Eye Problem:</span> <span class="field-value">{{ $record->with_eye_problem ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Pinhole Vision Result:</span> <span class="field-value">{{ $record->pinhole_vision_result ?? 'N/A' }}</span></div>
                    </div>
                </div>
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Date Referred:</span> <span class="field-value">{{ $record->date_referred ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Management:</span> <span class="field-value">{{ $record->management ?? 'N/A' }}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">💉 Immunization</div>
            <div class="grid">
                <div class="grid-row">
                    <div class="grid-col">
                        <div class="field"><span class="field-label">PPV Immunization Date:</span> <span class="field-value">{{ $record->ppv_immunization_date ?? 'N/A' }}</span></div>
                    </div>
                    <div class="grid-col">
                        <div class="field"><span class="field-label">Influenza Immunization Date:</span> <span class="field-value">{{ $record->influenza_immunization_date ?? 'N/A' }}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📝 Additional Information</div>
            <div class="field"><span class="field-label">Remarks:</span> <span class="field-value">{{ $record->remarks ?? 'N/A' }}</span></div>
            <div class="field"><span class="field-label">Status:</span> <span class="field-value">{{ ucfirst($record->status) }}</span></div>
            <div class="field"><span class="field-label">Created By:</span> <span class="field-value">{{ $record->creator->username ?? 'N/A' }}</span></div>
            <div class="field"><span class="field-label">Created At:</span> <span class="field-value">{{ $record->created_at->format('F d, Y h:i A') }}</span></div>
        </div>
    </div>
    @endforeach
</body>
</html>
