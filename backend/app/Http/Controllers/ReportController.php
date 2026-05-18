<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\User;
use App\Models\ImmunizationRecord;
use App\Models\FamilyPlanningRecord;
use App\Models\MaternalCareRecord;
use App\Models\SeniorCitizenRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    /**
     * Get all barangays for filtering
     */
    public function getBarangays()
    {
        $barangays = Barangay::select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json($barangays);
    }

    /**
     * Get midwives filtered by barangays
     */
    public function getMidwives(Request $request)
    {
        $query = User::where('role', 'midwife')
            ->where('status', 'approved')
            ->select('users.id', 'users.first_name', 'users.middle_name', 'users.last_name');

        // Filter by barangay IDs if provided
        if ($request->has('barangay_ids') && !empty($request->barangay_ids)) {
            $barangayIds = explode(',', $request->barangay_ids);
            $query->whereHas('barangays', function ($q) use ($barangayIds) {
                $q->whereIn('barangays.id', $barangayIds);
            });
        }

        $midwives = $query->with(['barangays' => function ($q) {
            $q->select('barangays.id', 'barangays.name');
        }])
        ->get()
        ->map(function ($midwife) {
            return [
                'id' => $midwife->id,
                'first_name' => $midwife->first_name,
                'middle_name' => $midwife->middle_name,
                'last_name' => $midwife->last_name,
                'barangay_id' => $midwife->barangays->first()->id ?? null,
                'barangay_name' => $midwife->barangays->first()->name ?? 'N/A',
            ];
        });

        return response()->json($midwives);
    }

    /**
     * Get patients filtered by program, barangays, and midwives
     */
    public function getPatients(Request $request)
    {
        $program = $request->input('program', 'all');
        $barangayIds = $request->has('barangay_ids') ? explode(',', $request->barangay_ids) : [];
        $midwifeIds = $request->has('midwife_ids') ? explode(',', $request->midwife_ids) : [];

        $patients = collect();

        // Fetch from each program based on filter
        if ($program === 'all' || $program === 'immunization') {
            $immunization = $this->getRecordsByProgram(
                ImmunizationRecord::class,
                'Immunization',
                $barangayIds,
                $midwifeIds
            );
            $patients = $patients->merge($immunization);
        }

        if ($program === 'all' || $program === 'maternal_care') {
            $maternalCare = $this->getRecordsByProgram(
                MaternalCareRecord::class,
                'Maternal Care',
                $barangayIds,
                $midwifeIds
            );
            $patients = $patients->merge($maternalCare);
        }

        if ($program === 'all' || $program === 'family_planning') {
            $familyPlanning = $this->getRecordsByProgram(
                FamilyPlanningRecord::class,
                'Family Planning',
                $barangayIds,
                $midwifeIds
            );
            $patients = $patients->merge($familyPlanning);
        }

        if ($program === 'all' || $program === 'senior_citizen') {
            $seniorCitizen = $this->getRecordsByProgram(
                SeniorCitizenRecord::class,
                'Senior Citizen',
                $barangayIds,
                $midwifeIds
            );
            $patients = $patients->merge($seniorCitizen);
        }

        return response()->json($patients);
    }

    /**
     * Helper method to get records by program
     */
    private function getRecordsByProgram($model, $programName, $barangayIds, $midwifeIds)
    {
        $query = $model::query();

        // Filter by barangay
        if (!empty($barangayIds)) {
            $query->whereIn('barangay_id', $barangayIds);
        }

        // Filter by midwife
        if (!empty($midwifeIds)) {
            $query->whereIn('created_by', $midwifeIds);
        }

        return $query->with(['barangay', 'creator'])
            ->get()
            ->map(function ($record) use ($programName) {
                return [
                    'id' => $record->id,
                    'name' => $record->full_name,
                    'program' => $programName,
                    'midwife_id' => $record->created_by,
                    'midwife_name' => $record->creator ? $record->creator->full_name : 'N/A',
                    'barangay_name' => $record->barangay ? $record->barangay->name : 'N/A',
                ];
            });
    }

    /**
     * Download report in Excel or PDF format
     */
    public function downloadReport(Request $request)
    {
        $format = $request->input('format', 'excel');
        $program = $request->input('program', 'all');
        $barangayIds = $request->has('barangay_ids') ? array_filter(explode(',', $request->barangay_ids)) : [];
        $midwifeIds = $request->has('midwife_ids') ? array_filter(explode(',', $request->midwife_ids)) : [];
        $patientIds = $request->has('patient_ids') ? array_filter(explode(',', $request->patient_ids)) : [];
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        if ($format === 'excel') {
            return $this->downloadExcel($program, $barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo);
        }

        return $this->downloadPdf($program, $barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo);
    }

    /**
     * Generate Excel report
     */
    private function downloadExcel($program, $barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo)
    {
        $spreadsheet = new Spreadsheet();
        $spreadsheet->removeSheetByIndex(0);

        // Generate sheets based on program selection
        if ($program === 'all' || $program === 'immunization') {
            $this->createImmunizationSheet($spreadsheet, $barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo);
        }

        if ($program === 'all' || $program === 'maternal_care') {
            $this->createMaternalCareSheet($spreadsheet, $barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo);
        }

        if ($program === 'all' || $program === 'family_planning') {
            $this->createFamilyPlanningSheet($spreadsheet, $barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo);
        }

        if ($program === 'all' || $program === 'senior_citizen') {
            $this->createSeniorCitizenSheet($spreadsheet, $barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo);
        }

        // Generate filename
        $filename = 'report_' . date('Y-m-d_His') . '.xlsx';

        // Save to temporary file
        $writer = new Xlsx($spreadsheet);
        $temp_file = tempnam(sys_get_temp_dir(), $filename);
        $writer->save($temp_file);

        return response()->download($temp_file, $filename)->deleteFileAfterSend(true);
    }

    /**
     * Create Immunization sheet
     */
    private function createImmunizationSheet($spreadsheet, $barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo)
    {
        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle('Immunization');

        // Headers
        $headers = [
            'ID', 'First Name', 'Middle Name', 'Last Name', 'Mother Name', 'Father/Guardian',
            'Sex', 'Date of Birth', 'Address', 'Barangay', 'Contact No',
            'Birth Weight', 'Birth Length', 'Place of Birth', 'Birth Attendant',
            'Current Weight', 'Current Height', 'Head Circumference', 'Weight for Age', 'Height for Age',
            'BCG', 'Hepa B', 'DPT1', 'DPT2', 'DPT3', 'OPV1', 'OPV2', 'OPV3', 'Measles',
            'Rotavirus1', 'Rotavirus2', 'PCV1', 'PCV2', 'PCV3', 'MMR',
            'Vitamin A Date', 'Deworming Date', 'Nutritional Status',
            'Allergies', 'Previous Illnesses', 'Congenital Abnormalities', 'Remarks',
            'Status', 'Midwife', 'Created At'
        ];

        $this->styleHeader($sheet, $headers, 'A1', '4472C4');

        // Fetch data
        $query = ImmunizationRecord::with(['barangay', 'creator']);

        if (!empty($barangayIds)) $query->whereIn('barangay_id', $barangayIds);
        if (!empty($midwifeIds)) $query->whereIn('created_by', $midwifeIds);
        if (!empty($patientIds)) $query->whereIn('id', $patientIds);
        if ($dateFrom) $query->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $query->whereDate('created_at', '<=', $dateTo);

        $records = $query->get();

        // Fill data
        $row = 2;
        foreach ($records as $record) {
            $sheet->fromArray([
                $record->id,
                $record->first_name,
                $record->middle_name,
                $record->last_name,
                $record->mother_name,
                $record->father_guardian_name,
                $record->sex,
                $record->date_of_birth ? $record->date_of_birth->format('Y-m-d') : '',
                $record->address,
                $record->barangay ? $record->barangay->name : '',
                $record->contact_no,
                $record->birth_weight,
                $record->birth_length,
                $record->place_of_birth,
                $record->birth_attendant,
                $record->current_weight,
                $record->current_height,
                $record->head_circumference,
                $record->weight_for_age,
                $record->height_for_age,
                $record->bcg ? $record->bcg->format('Y-m-d') : '',
                $record->hepa_b ? $record->hepa_b->format('Y-m-d') : '',
                $record->dpt1 ? $record->dpt1->format('Y-m-d') : '',
                $record->dpt2 ? $record->dpt2->format('Y-m-d') : '',
                $record->dpt3 ? $record->dpt3->format('Y-m-d') : '',
                $record->opv1 ? $record->opv1->format('Y-m-d') : '',
                $record->opv2 ? $record->opv2->format('Y-m-d') : '',
                $record->opv3 ? $record->opv3->format('Y-m-d') : '',
                $record->measles ? $record->measles->format('Y-m-d') : '',
                $record->rotavirus1 ? $record->rotavirus1->format('Y-m-d') : '',
                $record->rotavirus2 ? $record->rotavirus2->format('Y-m-d') : '',
                $record->pcv1 ? $record->pcv1->format('Y-m-d') : '',
                $record->pcv2 ? $record->pcv2->format('Y-m-d') : '',
                $record->pcv3 ? $record->pcv3->format('Y-m-d') : '',
                $record->mmr ? $record->mmr->format('Y-m-d') : '',
                $record->vit_a_date ? $record->vit_a_date->format('Y-m-d') : '',
                $record->deworming_date ? $record->deworming_date->format('Y-m-d') : '',
                $record->nutritional_status,
                $record->allergies,
                $record->previous_illnesses,
                $record->congenital_abnormalities,
                $record->remarks,
                $record->status,
                $record->creator ? $record->creator->full_name : '',
                $record->created_at->format('Y-m-d H:i:s')
            ], null, 'A' . $row);
            $row++;
        }

        $this->autoSizeColumns($sheet, count($headers));
    }

    /**
     * Create Maternal Care sheet
     */
    private function createMaternalCareSheet($spreadsheet, $barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo)
    {
        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle('Maternal Care');

        $headers = [
            'ID', 'First Name', 'Middle Name', 'Last Name', 'Age', 'Sex', 'Address', 'Barangay', 'Contact No',
            'Civil Status', 'Educational Attainment', 'Occupation', 'Gravida', 'Para', 'LMP', 'EDD',
            'Blood Type', 'No of Miscarriages', 'No of Stillbirths', 'No of Living Children',
            'Previous Cesarean', 'Previous Complications',
            'Prenatal Visit 1', 'Prenatal Visit 2', 'Prenatal Visit 3', 'Prenatal Visit 4',
            'Fundal Height', 'Fetal Heart Rate', 'Fetal Presentation', 'Edema', 'Proteinuria',
            'Weight Monitoring', 'BP Monitoring', 'Hemoglobin', 'Blood Sugar', 'Urinalysis Result',
            'Ultrasound Date', 'Ultrasound Findings',
            'Has Hypertension', 'Has Gestational Diabetes', 'Has Multiple Pregnancy', 'Has Placenta Previa', 'Has Preeclampsia',
            'Birth Plan', 'Preferred Delivery Place', 'Emergency Contact', 'Emergency Contact Number', 'Philhealth Member',
            'TT1', 'TT2', 'TT3', 'TT4', 'TT5', 'FIM Status', 'Iron Folic', 'Calcium', 'Iodine', 'BMI', 'Deworm',
            'Syphilis Screening', 'Hepa B Screening', 'HIV Screening', 'Date Screened', 'Result',
            'Remarks', 'Status', 'Midwife', 'Created At'
        ];

        $this->styleHeader($sheet, $headers, 'A1', 'EC4899');

        $query = MaternalCareRecord::with(['barangay', 'creator']);
        if (!empty($barangayIds)) $query->whereIn('barangay_id', $barangayIds);
        if (!empty($midwifeIds)) $query->whereIn('created_by', $midwifeIds);
        if (!empty($patientIds)) $query->whereIn('id', $patientIds);
        if ($dateFrom) $query->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $query->whereDate('created_at', '<=', $dateTo);

        $records = $query->get();

        $row = 2;
        foreach ($records as $record) {
            $sheet->fromArray([
                $record->id, $record->first_name, $record->middle_name, $record->last_name,
                $record->age, $record->sex, $record->address,
                $record->barangay ? $record->barangay->name : '', $record->contact_no,
                $record->civil_status, $record->educational_attainment, $record->occupation,
                $record->gravida, $record->para,
                $record->lmp ? $record->lmp->format('Y-m-d') : '',
                $record->edd ? $record->edd->format('Y-m-d') : '',
                $record->blood_type, $record->no_of_miscarriages, $record->no_of_stillbirths, $record->no_of_living_children,
                $record->previous_cesarean, $record->previous_complications,
                $record->prenatal_visit_1 ? $record->prenatal_visit_1->format('Y-m-d') : '',
                $record->prenatal_visit_2 ? $record->prenatal_visit_2->format('Y-m-d') : '',
                $record->prenatal_visit_3 ? $record->prenatal_visit_3->format('Y-m-d') : '',
                $record->prenatal_visit_4 ? $record->prenatal_visit_4->format('Y-m-d') : '',
                $record->fundal_height, $record->fetal_heart_rate, $record->fetal_presentation,
                $record->edema, $record->proteinuria, $record->weight_monitoring, $record->bp_monitoring,
                $record->hemoglobin, $record->blood_sugar, $record->urinalysis_result,
                $record->ultrasound_date ? $record->ultrasound_date->format('Y-m-d') : '',
                $record->ultrasound_findings,
                $record->has_hypertension, $record->has_gestational_diabetes, $record->has_multiple_pregnancy,
                $record->has_placenta_previa, $record->has_preeclampsia,
                $record->birth_plan, $record->preferred_delivery_place,
                $record->emergency_contact, $record->emergency_contact_number, $record->philhealth_member,
                $record->date_tt1 ? $record->date_tt1->format('Y-m-d') : '',
                $record->date_tt2 ? $record->date_tt2->format('Y-m-d') : '',
                $record->date_tt3 ? $record->date_tt3->format('Y-m-d') : '',
                $record->date_tt4 ? $record->date_tt4->format('Y-m-d') : '',
                $record->date_tt5 ? $record->date_tt5->format('Y-m-d') : '',
                $record->fim_status, $record->iron_folic, $record->calcium, $record->iodine, $record->bmi, $record->deworm,
                $record->syphilis_screening, $record->hepa_b_screening, $record->hiv_screening,
                $record->date_screened ? $record->date_screened->format('Y-m-d') : '',
                $record->result, $record->remarks, $record->status,
                $record->creator ? $record->creator->full_name : '',
                $record->created_at->format('Y-m-d H:i:s')
            ], null, 'A' . $row);
            $row++;
        }

        $this->autoSizeColumns($sheet, count($headers));
    }

    /**
     * Create Family Planning sheet
     */
    private function createFamilyPlanningSheet($spreadsheet, $barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo)
    {
        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle('Family Planning');

        $headers = [
            'ID', 'First Name', 'Middle Name', 'Last Name', 'Sex', 'Age', 'Address', 'Barangay',
            'Civil Status', 'Educational Attainment', 'Occupation', 'Contact No',
            'No of Living Children', 'Partner Name', 'Partner Age', 'Partner Occupation', 'Partner Consent',
            'Allergies', 'Current Medications', 'Medical Conditions', 'Previous Surgeries',
            'Last Childbirth Date', 'No of Miscarriages', 'No of Stillbirths', 'Youngest Child Age',
            'Blood Pressure', 'Weight', 'Height', 'BMI', 'Smoker',
            'History Blood Clots', 'History Cancer', 'History Stroke',
            'Date of Visit', 'Type of Client', 'Date Accepted', 'Type of FP Method', 'Date Started',
            'Remarks Side Effects', 'Date of Followup', 'Method Changed', 'New Method', 'Reason for Change',
            'Midwife Name', 'LMP', 'Pregnancy Test Result', 'Source of Supply', 'Date of Last Supply',
            'Quantity Given', 'Next Supply Date', 'Adherence Notes',
            'Status', 'Created By', 'Created At'
        ];

        $this->styleHeader($sheet, $headers, 'A1', '8B5CF6');

        $query = FamilyPlanningRecord::with(['barangay', 'creator']);
        if (!empty($barangayIds)) $query->whereIn('barangay_id', $barangayIds);
        if (!empty($midwifeIds)) $query->whereIn('created_by', $midwifeIds);
        if (!empty($patientIds)) $query->whereIn('id', $patientIds);
        if ($dateFrom) $query->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $query->whereDate('created_at', '<=', $dateTo);

        $records = $query->get();

        $row = 2;
        foreach ($records as $record) {
            $sheet->fromArray([
                $record->id, $record->first_name, $record->middle_name, $record->last_name,
                $record->sex, $record->age, $record->address,
                $record->barangay ? $record->barangay->name : '',
                $record->civil_status, $record->educational_attainment, $record->occupation, $record->contact_no,
                $record->no_of_living_children, $record->partner_name, $record->partner_age,
                $record->partner_occupation, $record->partner_consent,
                $record->allergies, $record->current_medications, $record->medical_conditions, $record->previous_surgeries,
                $record->last_childbirth_date ? $record->last_childbirth_date->format('Y-m-d') : '',
                $record->no_of_miscarriages, $record->no_of_stillbirths, $record->youngest_child_age,
                $record->blood_pressure, $record->weight, $record->height, $record->bmi, $record->smoker,
                $record->history_blood_clots, $record->history_cancer, $record->history_stroke,
                $record->date_of_visit ? $record->date_of_visit->format('Y-m-d') : '',
                $record->type_of_client,
                $record->date_accepted ? $record->date_accepted->format('Y-m-d') : '',
                $record->type_of_fp_method,
                $record->date_started ? $record->date_started->format('Y-m-d') : '',
                $record->remarks_side_effects,
                $record->date_of_followup ? $record->date_of_followup->format('Y-m-d') : '',
                $record->method_changed, $record->new_method, $record->reason_for_change,
                $record->midwife_name,
                $record->lmp ? $record->lmp->format('Y-m-d') : '',
                $record->pregnancy_test_result, $record->source_of_supply,
                $record->date_of_last_supply ? $record->date_of_last_supply->format('Y-m-d') : '',
                $record->quantity_given,
                $record->next_supply_date ? $record->next_supply_date->format('Y-m-d') : '',
                $record->adherence_notes, $record->status,
                $record->creator ? $record->creator->full_name : '',
                $record->created_at->format('Y-m-d H:i:s')
            ], null, 'A' . $row);
            $row++;
        }

        $this->autoSizeColumns($sheet, count($headers));
    }

    /**
     * Create Senior Citizen sheet
     */
    private function createSeniorCitizenSheet($spreadsheet, $barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo)
    {
        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle('Senior Citizen');

        $headers = [
            'ID', 'First Name', 'Middle Name', 'Last Name', 'Sex', 'Age', 'Address', 'Barangay', 'Contact No',
            'Civil Status', 'Occupation', 'Educational Attainment',
            'Blood Pressure', 'Weight', 'Height', 'BMI', 'Temperature', 'Heart Rate', 'Respiratory Rate',
            'Has Hypertension', 'Has Diabetes', 'Has Heart Disease', 'Has Kidney Disease', 'Has Arthritis',
            'Has COPD/Asthma', 'Has Dementia', 'Maintenance Medications', 'Medication Allergies',
            'Mobility Status', 'ADL Score', 'Fall History', 'Uses Assistive Device',
            'Memory Status', 'Dementia Screening Result', 'Blood Sugar Level', 'Cholesterol Level',
            'TB Screening', 'Cancer Screening', 'Living Arrangement', 'Primary Caregiver',
            'Emergency Contact', 'Emergency Contact Number', 'Nutritional Status', 'Special Diet',
            'Special Diet Details', 'Has Dentures', 'Last Dental Visit', 'Eye Complaints', 'Visual Acuity',
            'With Eye Problem', 'Pinhole Vision Result', 'Date Referred', 'Management',
            'PPV Immunization Date', 'Influenza Immunization Date',
            'Remarks', 'Status', 'Midwife', 'Created At'
        ];

        $this->styleHeader($sheet, $headers, 'A1', 'F59E0B');

        $query = SeniorCitizenRecord::with(['barangay', 'creator']);
        if (!empty($barangayIds)) $query->whereIn('barangay_id', $barangayIds);
        if (!empty($midwifeIds)) $query->whereIn('created_by', $midwifeIds);
        if (!empty($patientIds)) $query->whereIn('id', $patientIds);
        if ($dateFrom) $query->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $query->whereDate('created_at', '<=', $dateTo);

        $records = $query->get();

        $row = 2;
        foreach ($records as $record) {
            $sheet->fromArray([
                $record->id, $record->first_name, $record->middle_name, $record->last_name,
                $record->sex, $record->age, $record->address,
                $record->barangay ? $record->barangay->name : '', $record->contact_no,
                $record->civil_status, $record->occupation, $record->educational_attainment,
                $record->blood_pressure, $record->weight, $record->height, $record->bmi,
                $record->temperature, $record->heart_rate, $record->respiratory_rate,
                $record->has_hypertension, $record->has_diabetes, $record->has_heart_disease,
                $record->has_kidney_disease, $record->has_arthritis, $record->has_copd_asthma, $record->has_dementia,
                $record->maintenance_medications, $record->medication_allergies,
                $record->mobility_status, $record->adl_score, $record->fall_history, $record->uses_assistive_device,
                $record->memory_status, $record->dementia_screening_result,
                $record->blood_sugar_level, $record->cholesterol_level,
                $record->tb_screening, $record->cancer_screening,
                $record->living_arrangement, $record->primary_caregiver,
                $record->emergency_contact, $record->emergency_contact_number,
                $record->nutritional_status, $record->special_diet, $record->special_diet_details,
                $record->has_dentures,
                $record->last_dental_visit ? $record->last_dental_visit->format('Y-m-d') : '',
                $record->eye_complaints, $record->visual_acuity, $record->with_eye_problem, $record->pinhole_vision_result,
                $record->date_referred ? $record->date_referred->format('Y-m-d') : '',
                $record->management,
                $record->ppv_immunization_date ? $record->ppv_immunization_date->format('Y-m-d') : '',
                $record->influenza_immunization_date ? $record->influenza_immunization_date->format('Y-m-d') : '',
                $record->remarks, $record->status,
                $record->creator ? $record->creator->full_name : '',
                $record->created_at->format('Y-m-d H:i:s')
            ], null, 'A' . $row);
            $row++;
        }

        $this->autoSizeColumns($sheet, count($headers));
    }

    /**
     * Style header row
     */
    private function styleHeader($sheet, $headers, $startCell, $color)
    {
        $sheet->fromArray($headers, null, $startCell);
        
        $lastColumn = chr(64 + count($headers));
        $headerRange = 'A1:' . $lastColumn . '1';
        
        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 12
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => $color]
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000']
                ]
            ]
        ]);
        
        $sheet->getRowDimension(1)->setRowHeight(25);
    }

    /**
     * Auto-size columns
     */
    private function autoSizeColumns($sheet, $columnCount)
    {
        for ($i = 1; $i <= $columnCount; $i++) {
            $column = chr(64 + $i);
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
    }

    /**
     * Generate PDF report
     */
    private function downloadPdf($program, $barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo)
    {
        $data = [];
        $programName = 'All Programs';

        // Fetch data based on program selection
        if ($program === 'all' || $program === 'immunization') {
            $data['immunization'] = $this->getImmunizationData($barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo);
            if ($program === 'immunization') $programName = 'Immunization';
        }

        if ($program === 'all' || $program === 'maternal_care') {
            $data['maternal_care'] = $this->getMaternalCareData($barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo);
            if ($program === 'maternal_care') $programName = 'Maternal Care';
        }

        if ($program === 'all' || $program === 'family_planning') {
            $data['family_planning'] = $this->getFamilyPlanningData($barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo);
            if ($program === 'family_planning') $programName = 'Family Planning';
        }

        if ($program === 'all' || $program === 'senior_citizen') {
            $data['senior_citizen'] = $this->getSeniorCitizenData($barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo);
            if ($program === 'senior_citizen') $programName = 'Senior Citizen';
        }

        $pdf = Pdf::loadView('reports.pdf', [
            'data' => $data,
            'program' => $programName,
            'dateFrom' => $dateFrom,
            'dateTo' => $dateTo,
            'generatedAt' => now()->format('Y-m-d H:i:s')
        ]);

        $pdf->setPaper('a4', 'landscape');
        $filename = 'report_' . date('Y-m-d_His') . '.pdf';

        return $pdf->download($filename);
    }

    private function getImmunizationData($barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo)
    {
        $query = ImmunizationRecord::with(['barangay', 'creator']);
        if (!empty($barangayIds)) $query->whereIn('barangay_id', $barangayIds);
        if (!empty($midwifeIds)) $query->whereIn('created_by', $midwifeIds);
        if (!empty($patientIds)) $query->whereIn('id', $patientIds);
        if ($dateFrom) $query->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $query->whereDate('created_at', '<=', $dateTo);
        return $query->get();
    }

    private function getMaternalCareData($barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo)
    {
        $query = MaternalCareRecord::with(['barangay', 'creator']);
        if (!empty($barangayIds)) $query->whereIn('barangay_id', $barangayIds);
        if (!empty($midwifeIds)) $query->whereIn('created_by', $midwifeIds);
        if (!empty($patientIds)) $query->whereIn('id', $patientIds);
        if ($dateFrom) $query->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $query->whereDate('created_at', '<=', $dateTo);
        return $query->get();
    }

    private function getFamilyPlanningData($barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo)
    {
        $query = FamilyPlanningRecord::with(['barangay', 'creator']);
        if (!empty($barangayIds)) $query->whereIn('barangay_id', $barangayIds);
        if (!empty($midwifeIds)) $query->whereIn('created_by', $midwifeIds);
        if (!empty($patientIds)) $query->whereIn('id', $patientIds);
        if ($dateFrom) $query->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $query->whereDate('created_at', '<=', $dateTo);
        return $query->get();
    }

    private function getSeniorCitizenData($barangayIds, $midwifeIds, $patientIds, $dateFrom, $dateTo)
    {
        $query = SeniorCitizenRecord::with(['barangay', 'creator']);
        if (!empty($barangayIds)) $query->whereIn('barangay_id', $barangayIds);
        if (!empty($midwifeIds)) $query->whereIn('created_by', $midwifeIds);
        if (!empty($patientIds)) $query->whereIn('id', $patientIds);
        if ($dateFrom) $query->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $query->whereDate('created_at', '<=', $dateTo);
        return $query->get();
    }
}
