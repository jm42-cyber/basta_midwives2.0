<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Maternal Care Records</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 9px; }
        h1 { text-align: center; color: #EC4899; font-size: 18px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #EC4899; color: white; padding: 8px; text-align: left; border: 1px solid #ddd; font-size: 9px; }
        td { padding: 6px; border: 1px solid #ddd; font-size: 8px; }
        tr:nth-child(even) { background-color: #FDF2F8; }
        .section-title { background-color: #F9A8D4; color: #831843; font-weight: bold; padding: 6px; margin-top: 10px; font-size: 10px; }
        .record-block { page-break-inside: avoid; margin-bottom: 30px; border: 2px solid #EC4899; padding: 10px; }
    </style>
</head>
<body>
    <h1>MediMoms - Maternal Care Records</h1>
    <p style="text-align: center; margin-bottom: 20px;">Generated on {{ date('F d, Y h:i A') }}</p>

    @foreach($records as $record)
    <div class="record-block">
        <div class="section-title">PERSONAL INFORMATION</div>
        <table>
            <tr>
                <th>Name</th>
                <td>{{ $record->first_name }} {{ $record->middle_name }} {{ $record->last_name }}</td>
                <th>Age</th>
                <td>{{ $record->age }}</td>
                <th>Sex</th>
                <td>{{ $record->sex }}</td>
            </tr>
            <tr>
                <th>Address</th>
                <td>{{ $record->address }}</td>
                <th>Barangay</th>
                <td>{{ $record->barangay->name ?? '' }}</td>
                <th>Contact</th>
                <td>{{ $record->contact_no }}</td>
            </tr>
            <tr>
                <th>Civil Status</th>
                <td>{{ $record->civil_status }}</td>
                <th>Education</th>
                <td>{{ $record->educational_attainment }}</td>
                <th>Occupation</th>
                <td>{{ $record->occupation }}</td>
            </tr>
        </table>

        <div class="section-title">PREGNANCY INFORMATION</div>
        <table>
            <tr>
                <th>Gravida</th>
                <td>{{ $record->gravida }}</td>
                <th>Para</th>
                <td>{{ $record->para }}</td>
                <th>LMP</th>
                <td>{{ $record->lmp }}</td>
                <th>EDD</th>
                <td>{{ $record->edd }}</td>
                <th>Blood Type</th>
                <td>{{ $record->blood_type }}</td>
            </tr>
        </table>

        <div class="section-title">PREVIOUS PREGNANCY HISTORY</div>
        <table>
            <tr>
                <th>Miscarriages</th>
                <td>{{ $record->no_of_miscarriages }}</td>
                <th>Stillbirths</th>
                <td>{{ $record->no_of_stillbirths }}</td>
                <th>Living Children</th>
                <td>{{ $record->no_of_living_children }}</td>
                <th>Previous Cesarean</th>
                <td>{{ $record->previous_cesarean }}</td>
            </tr>
            <tr>
                <th>Previous Complications</th>
                <td colspan="7">{{ $record->previous_complications }}</td>
            </tr>
        </table>

        <div class="section-title">PRENATAL VISITS</div>
        <table>
            <tr>
                <th>Visit 1</th>
                <td>{{ $record->prenatal_visit_1 }}</td>
                <th>Visit 2</th>
                <td>{{ $record->prenatal_visit_2 }}</td>
                <th>Visit 3</th>
                <td>{{ $record->prenatal_visit_3 }}</td>
                <th>Visit 4</th>
                <td>{{ $record->prenatal_visit_4 }}</td>
            </tr>
        </table>

        <div class="section-title">CURRENT PREGNANCY MONITORING</div>
        <table>
            <tr>
                <th>Fundal Height</th>
                <td>{{ $record->fundal_height }}</td>
                <th>Fetal Heart Rate</th>
                <td>{{ $record->fetal_heart_rate }}</td>
                <th>Fetal Presentation</th>
                <td>{{ $record->fetal_presentation }}</td>
            </tr>
            <tr>
                <th>Edema</th>
                <td>{{ $record->edema }}</td>
                <th>Proteinuria</th>
                <td>{{ $record->proteinuria }}</td>
                <th>Weight Monitoring</th>
                <td>{{ $record->weight_monitoring }}</td>
            </tr>
            <tr>
                <th>BP Monitoring</th>
                <td colspan="5">{{ $record->bp_monitoring }}</td>
            </tr>
        </table>

        <div class="section-title">LABORATORY RESULTS</div>
        <table>
            <tr>
                <th>Hemoglobin</th>
                <td>{{ $record->hemoglobin }}</td>
                <th>Blood Sugar</th>
                <td>{{ $record->blood_sugar }}</td>
                <th>Urinalysis</th>
                <td>{{ $record->urinalysis_result }}</td>
            </tr>
            <tr>
                <th>Ultrasound Date</th>
                <td>{{ $record->ultrasound_date }}</td>
                <th>Ultrasound Findings</th>
                <td colspan="3">{{ $record->ultrasound_findings }}</td>
            </tr>
        </table>

        <div class="section-title">HIGH-RISK INDICATORS</div>
        <table>
            <tr>
                <th>Hypertension</th>
                <td>{{ $record->has_hypertension }}</td>
                <th>Gestational Diabetes</th>
                <td>{{ $record->has_gestational_diabetes }}</td>
                <th>Multiple Pregnancy</th>
                <td>{{ $record->has_multiple_pregnancy }}</td>
            </tr>
            <tr>
                <th>Placenta Previa</th>
                <td>{{ $record->has_placenta_previa }}</td>
                <th>Preeclampsia</th>
                <td>{{ $record->has_preeclampsia }}</td>
                <td colspan="2"></td>
            </tr>
        </table>

        <div class="section-title">BIRTH PREPAREDNESS</div>
        <table>
            <tr>
                <th>Birth Plan</th>
                <td colspan="3">{{ $record->birth_plan }}</td>
            </tr>
            <tr>
                <th>Preferred Delivery Place</th>
                <td>{{ $record->preferred_delivery_place }}</td>
                <th>PhilHealth Member</th>
                <td>{{ $record->philhealth_member }}</td>
            </tr>
            <tr>
                <th>Emergency Contact</th>
                <td>{{ $record->emergency_contact }}</td>
                <th>Contact Number</th>
                <td>{{ $record->emergency_contact_number }}</td>
            </tr>
        </table>

        <div class="section-title">IMMUNIZATION & SUPPLEMENTS</div>
        <table>
            <tr>
                <th>TT1</th>
                <td>{{ $record->date_tt1 }}</td>
                <th>TT2</th>
                <td>{{ $record->date_tt2 }}</td>
                <th>TT3</th>
                <td>{{ $record->date_tt3 }}</td>
                <th>TT4</th>
                <td>{{ $record->date_tt4 }}</td>
                <th>TT5</th>
                <td>{{ $record->date_tt5 }}</td>
            </tr>
            <tr>
                <th>FIM Status</th>
                <td>{{ $record->fim_status }}</td>
                <th>Iron Folic</th>
                <td>{{ $record->iron_folic }}</td>
                <th>Calcium</th>
                <td>{{ $record->calcium }}</td>
                <th>Iodine</th>
                <td>{{ $record->iodine }}</td>
                <th>BMI</th>
                <td>{{ $record->bmi }}</td>
            </tr>
            <tr>
                <th>Deworm</th>
                <td colspan="8">{{ $record->deworm }}</td>
            </tr>
        </table>

        <div class="section-title">SCREENING</div>
        <table>
            <tr>
                <th>Syphilis</th>
                <td>{{ $record->syphilis_screening }}</td>
                <th>Hepa B</th>
                <td>{{ $record->hepa_b_screening }}</td>
                <th>HIV</th>
                <td>{{ $record->hiv_screening }}</td>
            </tr>
            <tr>
                <th>Date Screened</th>
                <td>{{ $record->date_screened }}</td>
                <th>Result</th>
                <td colspan="3">{{ $record->result }}</td>
            </tr>
        </table>

        <div class="section-title">ADDITIONAL INFORMATION</div>
        <table>
            <tr>
                <th>Remarks</th>
                <td>{{ $record->remarks }}</td>
                <th>Status</th>
                <td>{{ $record->status }}</td>
                <th>Created By</th>
                <td>{{ $record->creator->username ?? '' }}</td>
                <th>Created At</th>
                <td>{{ $record->created_at->format('Y-m-d H:i:s') }}</td>
            </tr>
        </table>
    </div>
    @endforeach
</body>
</html>
