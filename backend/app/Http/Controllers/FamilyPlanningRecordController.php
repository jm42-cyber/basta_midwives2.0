<?php

namespace App\Http\Controllers;

use App\Models\FamilyPlanningRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Barryvdh\DomPDF\Facade\Pdf;

class FamilyPlanningRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = FamilyPlanningRecord::with(['barangay', 'creator']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 20);
        $records = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($records);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:50',
            'middle_name' => 'nullable|string|max:50',
            'last_name' => 'required|string|max:50',
            'sex' => 'required|in:Male,Female',
            'barangay_id' => 'required|exists:barangays,id',
            'age' => 'nullable|integer|min:0|max:150',
            'contact_no' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record = FamilyPlanningRecord::create([
            ...$request->all(),
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Family planning record created successfully',
            'data' => $record->load(['barangay', 'creator'])
        ], 201);
    }

    public function show($id)
    {
        $record = FamilyPlanningRecord::with(['barangay', 'creator'])->findOrFail($id);
        return response()->json(['data' => $record]);
    }

    public function update(Request $request, $id)
    {
        $record = FamilyPlanningRecord::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:50',
            'middle_name' => 'nullable|string|max:50',
            'last_name' => 'sometimes|required|string|max:50',
            'sex' => 'sometimes|required|in:Male,Female',
            'barangay_id' => 'sometimes|required|exists:barangays,id',
            'age' => 'nullable|integer|min:0|max:150',
            'contact_no' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record->update($request->all());

        return response()->json([
            'message' => 'Family planning record updated successfully',
            'data' => $record->load(['barangay', 'creator'])
        ]);
    }

    public function destroy($id)
    {
        $record = FamilyPlanningRecord::findOrFail($id);
        $record->delete();

        return response()->json([
            'message' => 'Family planning record deleted successfully'
        ]);
    }

    public function toggleStatus($id)
    {
        $record = FamilyPlanningRecord::findOrFail($id);
        
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
            'data' => $record->load(['barangay', 'creator']),
            'old_status' => $oldStatus,
            'new_status' => $newStatus
        ]);
    }

    public function exportExcel(Request $request)
    {
        $user = $request->user();
        $query = FamilyPlanningRecord::with(['barangay', 'creator']);

        if ($user->role === 'midwife') {
            $barangayIds = $user->barangays->pluck('id');
            $query->whereIn('barangay_id', $barangayIds);
        }

        if ($request->has('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        $records = $query->where('status', 'active')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Family Planning Records');

        // Title
        $sheet->mergeCells('A1:AO1');
        $sheet->setCellValue('A1', 'FAMILY PLANNING RECORDS - COMPLETE EXPORT');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14)->getColor()->setRGB('FFFFFF');
        $sheet->getStyle('A1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('7C3AED');
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getRowDimension(1)->setRowHeight(28);

        // Info row
        $sheet->mergeCells('A2:AO2');
        $info = $request->has('start_date') && $request->has('end_date') 
            ? "Period: {$request->start_date} to {$request->end_date} | " 
            : '';
        $sheet->setCellValue('A2', "{$info}Generated: " . now()->format('Y-m-d H:i') . " | Total: {$records->count()} records");
        $sheet->getStyle('A2')->getFont()->setSize(10)->setItalic(true);
        $sheet->getStyle('A2')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('EDE9FE');
        $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Headers
        $headers = [
            'No', 'First Name', 'Middle Name', 'Last Name', 'Sex', 'Age',
            'Address', 'Barangay', 'Civil Status', 'Education', 'Occupation', 'Contact',
            'Living Children', 'Partner Name', 'Partner Age', 'Partner Occupation', 'Partner Consent',
            'Allergies', 'Current Medications', 'Medical Conditions', 'Previous Surgeries',
            'Last Childbirth', 'Miscarriages', 'Stillbirths', 'Youngest Child Age',
            'Blood Pressure', 'Weight (kg)', 'Height (cm)', 'BMI',
            'Smoker', 'Blood Clots History', 'Cancer History', 'Stroke History',
            'Date of Visit', 'Client Type', 'Date Accepted', 'FP Method', 'Date Started',
            'Side Effects/Remarks', 'Follow-up Date', 'Method Changed', 'New Method', 'Reason for Change',
            'Midwife Name', 'LMP', 'Pregnancy Test', 'Source of Supply',
            'Last Supply Date', 'Quantity Given', 'Next Supply Date', 'Adherence Notes',
            'Remarks', 'Created By', 'Date Created'
        ];

        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '4', $header);
            $sheet->getStyle($col . '4')->getFont()->setBold(true)->getColor()->setRGB('FFFFFF');
            $sheet->getStyle($col . '4')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('7C3AED');
            $sheet->getStyle($col . '4')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER)->setWrapText(true);
            $col++;
        }
        $sheet->getRowDimension(4)->setRowHeight(30);

        // Data
        $row = 5;
        foreach ($records as $index => $record) {
            $data = [
                $index + 1,
                $record->first_name,
                $record->middle_name,
                $record->last_name,
                $record->sex,
                $record->age,
                $record->address,
                $record->barangay->name ?? '',
                $record->civil_status,
                $record->educational_attainment,
                $record->occupation,
                $record->contact_no,
                $record->no_of_living_children,
                $record->partner_name,
                $record->partner_age,
                $record->partner_occupation,
                $record->partner_consent,
                $record->allergies,
                $record->current_medications,
                $record->medical_conditions,
                $record->previous_surgeries,
                $record->last_childbirth_date ? $record->last_childbirth_date->format('Y-m-d') : '',
                $record->no_of_miscarriages,
                $record->no_of_stillbirths,
                $record->youngest_child_age,
                $record->blood_pressure,
                $record->weight,
                $record->height,
                $record->bmi,
                $record->smoker,
                $record->history_blood_clots,
                $record->history_cancer,
                $record->history_stroke,
                $record->date_of_visit ? $record->date_of_visit->format('Y-m-d') : '',
                $record->type_of_client,
                $record->date_accepted ? $record->date_accepted->format('Y-m-d') : '',
                $record->type_of_fp_method,
                $record->date_started ? $record->date_started->format('Y-m-d') : '',
                $record->remarks_side_effects,
                $record->date_of_followup ? $record->date_of_followup->format('Y-m-d') : '',
                $record->method_changed,
                $record->new_method,
                $record->reason_for_change,
                $record->midwife_name,
                $record->lmp ? $record->lmp->format('Y-m-d') : '',
                $record->pregnancy_test_result,
                $record->source_of_supply,
                $record->date_of_last_supply ? $record->date_of_last_supply->format('Y-m-d') : '',
                $record->quantity_given,
                $record->next_supply_date ? $record->next_supply_date->format('Y-m-d') : '',
                $record->adherence_notes,
                $record->remarks ?? '',
                $record->creator->full_name ?? 'System',
                $record->created_at->format('Y-m-d H:i')
            ];

            $col = 'A';
            foreach ($data as $value) {
                $sheet->setCellValue($col . $row, $value);
                $sheet->getStyle($col . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
                if ($row % 2 == 0) {
                    $sheet->getStyle($col . $row)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('FAF5FF');
                }
                $col++;
            }
            $row++;
        }

        // Column widths
        $widths = [5,12,10,12,6,6,22,12,12,12,12,11,10,16,10,16,10,20,20,20,20,
                   12,10,10,12,12,10,10,8,8,12,12,12,12,12,12,20,12,20,12,10,15,15,
                   15,12,15,15,15,12,15,15,20,14,14];
        $col = 'A';
        foreach ($widths as $width) {
            $sheet->getColumnDimension($col)->setWidth($width);
            $col++;
        }

        $sheet->freezePane('E5');

        $writer = new Xlsx($spreadsheet);
        $filename = 'family_planning_' . now()->format('Ymd_His') . '.xlsx';
        $temp_file = tempnam(sys_get_temp_dir(), $filename);
        $writer->save($temp_file);

        return response()->download($temp_file, $filename)->deleteFileAfterSend(true);
    }

    public function exportPdf(Request $request)
    {
        $user = $request->user();
        $query = FamilyPlanningRecord::with(['barangay', 'creator']);

        if ($user->role === 'midwife') {
            $barangayIds = $user->barangays->pluck('id');
            $query->whereIn('barangay_id', $barangayIds);
        }

        if ($request->has('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        $records = $query->where('status', 'active')->get();
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        $pdf = Pdf::loadView('exports.family_planning_pdf', compact('records', 'startDate', 'endDate'));
        $pdf->setPaper('a4', 'portrait');
        
        return $pdf->download('family_planning_' . now()->format('Ymd_His') . '.pdf');
    }
}
