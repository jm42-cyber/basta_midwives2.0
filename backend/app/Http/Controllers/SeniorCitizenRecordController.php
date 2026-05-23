<?php

namespace App\Http\Controllers;

use App\Models\SeniorCitizenRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Barryvdh\DomPDF\Facade\Pdf;

class SeniorCitizenRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = SeniorCitizenRecord::with(['barangay', 'creator']);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%");
            });
        }

        $records = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($records);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'middle_name' => 'nullable|string|max:50',
            'sex' => 'required|in:Male,Female',
            'barangay_id' => 'required|exists:barangays,id',
            'age' => 'nullable|integer|min:60|max:120',
            'contact_no' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record = SeniorCitizenRecord::create(array_merge(
            $request->all(),
            ['created_by' => auth()->id()]
        ));

        return response()->json($record->load(['barangay', 'creator']), 201);
    }

    public function show($id)
    {
        $record = SeniorCitizenRecord::with(['barangay', 'creator'])->findOrFail($id);
        return response()->json($record);
    }

    public function update(Request $request, $id)
    {
        $record = SeniorCitizenRecord::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'middle_name' => 'nullable|string|max:50',
            'sex' => 'required|in:Male,Female',
            'barangay_id' => 'required|exists:barangays,id',
            'age' => 'nullable|integer|min:60|max:120',
            'contact_no' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record->update($request->all());

        return response()->json($record->load(['barangay', 'creator']));
    }

    public function destroy($id)
    {
        $record = SeniorCitizenRecord::findOrFail($id);
        $record->delete();

        return response()->json(['message' => 'Record deleted successfully']);
    }

    public function toggleStatus($id)
    {
        $record = SeniorCitizenRecord::findOrFail($id);
        
        // Store old status for logging
        $oldStatus = $record->status;
        
        // Toggle status
        $newStatus = $record->status === 'active' ? 'archived' : 'active';
        $record->status = $newStatus;
        
        // Save and verify
        $saved = $record->save();
        
        if (!$saved) {
            return response()->json([
                'message' => 'Failed to update record status',
                'error' => 'Database save operation failed'
            ], 500);
        }
        
        // Verify the change was persisted
        $record->refresh();
        
        if ($record->status !== $newStatus) {
            return response()->json([
                'message' => 'Failed to update record status',
                'error' => 'Status was not persisted to database'
            ], 500);
        }

        return response()->json([
            'message' => 'Status updated successfully',
            'record' => $record->load(['barangay', 'creator']),
            'old_status' => $oldStatus,
            'new_status' => $newStatus
        ]);
    }

    public function exportExcel(Request $request)
    {
        $query = SeniorCitizenRecord::with(['barangay', 'creator']);

        // Role-based filtering
        $user = auth()->user();
        if ($user->role === 'midwife') {
            $barangayIds = $user->barangays->pluck('id');
            $query->whereIn('barangay_id', $barangayIds);
        }

        // Date range filter
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        // Barangay filter
        if ($request->has('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }

        // Search filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%");
            });
        }

        $query->where('status', 'active');
        $records = $query->orderBy('created_at', 'desc')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Headers
        $headers = [
            'ID', 'First Name', 'Middle Name', 'Last Name', 'Sex', 'Age', 'Address', 'Barangay',
            'Contact No', 'Civil Status', 'Occupation', 'Educational Attainment',
            'Blood Pressure', 'Weight', 'Height', 'BMI', 'Temperature', 'Heart Rate', 'Respiratory Rate',
            'Hypertension', 'Diabetes', 'Heart Disease', 'Kidney Disease', 'Arthritis', 'COPD/Asthma', 'Dementia',
            'Maintenance Medications', 'Medication Allergies',
            'Mobility Status', 'ADL Score', 'Fall History', 'Uses Assistive Device',
            'Memory Status', 'Dementia Screening Result',
            'Blood Sugar Level', 'Cholesterol Level', 'TB Screening', 'Cancer Screening',
            'Living Arrangement', 'Primary Caregiver', 'Emergency Contact', 'Emergency Contact Number',
            'Nutritional Status', 'Special Diet', 'Special Diet Details',
            'Has Dentures', 'Last Dental Visit',
            'Eye Complaints', 'Visual Acuity', 'With Eye Problem', 'Pinhole Vision Result', 'Date Referred', 'Management',
            'PPV Immunization Date', 'Influenza Immunization Date',
            'Remarks', 'Status', 'Created By', 'Created At'
        ];

        $sheet->fromArray($headers, null, 'A1');

        // Style header
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F97316']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]]
        ];
        $sheet->getStyle('A1:' . $sheet->getHighestColumn() . '1')->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(25);

        // Data
        $row = 2;
        foreach ($records as $record) {
            $sheet->fromArray([
                $record->id,
                $record->first_name,
                $record->middle_name,
                $record->last_name,
                $record->sex,
                $record->age,
                $record->address,
                $record->barangay->name ?? '',
                $record->contact_no,
                $record->civil_status,
                $record->occupation,
                $record->educational_attainment,
                $record->blood_pressure,
                $record->weight,
                $record->height,
                $record->bmi,
                $record->temperature,
                $record->heart_rate,
                $record->respiratory_rate,
                $record->has_hypertension,
                $record->has_diabetes,
                $record->has_heart_disease,
                $record->has_kidney_disease,
                $record->has_arthritis,
                $record->has_copd_asthma,
                $record->has_dementia,
                $record->maintenance_medications,
                $record->medication_allergies,
                $record->mobility_status,
                $record->adl_score,
                $record->fall_history,
                $record->uses_assistive_device,
                $record->memory_status,
                $record->dementia_screening_result,
                $record->blood_sugar_level,
                $record->cholesterol_level,
                $record->tb_screening,
                $record->cancer_screening,
                $record->living_arrangement,
                $record->primary_caregiver,
                $record->emergency_contact,
                $record->emergency_contact_number,
                $record->nutritional_status,
                $record->special_diet,
                $record->special_diet_details,
                $record->has_dentures,
                $record->last_dental_visit,
                $record->eye_complaints,
                $record->visual_acuity,
                $record->with_eye_problem,
                $record->pinhole_vision_result,
                $record->date_referred,
                $record->management,
                $record->ppv_immunization_date,
                $record->influenza_immunization_date,
                $record->remarks,
                $record->status,
                $record->creator->username ?? '',
                $record->created_at->format('Y-m-d H:i:s')
            ], null, 'A' . $row);
            $row++;
        }

        // Auto-size columns
        foreach (range('A', $sheet->getHighestColumn()) as $col) {
            $sheet->getColumnDimension($col)->setWidth(20);
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'senior_citizen_records_' . date('Y-m-d_His') . '.xlsx';
        $temp_file = tempnam(sys_get_temp_dir(), $filename);
        $writer->save($temp_file);

        return response()->download($temp_file, $filename)->deleteFileAfterSend(true);
    }

    public function exportPdf(Request $request)
    {
        $query = SeniorCitizenRecord::with(['barangay', 'creator']);

        // Role-based filtering
        $user = auth()->user();
        if ($user->role === 'midwife') {
            $barangayIds = $user->barangays->pluck('id');
            $query->whereIn('barangay_id', $barangayIds);
        }

        // Date range filter
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        // Barangay filter
        if ($request->has('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }

        // Search filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%");
            });
        }

        $query->where('status', 'active');
        $records = $query->orderBy('created_at', 'desc')->get();

        $pdf = Pdf::loadView('exports.senior_citizen_pdf', compact('records'));
        $pdf->setPaper('a4', 'landscape');
        
        return $pdf->download('senior_citizen_records_' . date('Y-m-d_His') . '.pdf');
    }
}
