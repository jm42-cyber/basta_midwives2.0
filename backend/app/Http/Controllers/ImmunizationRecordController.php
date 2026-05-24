<?php

namespace App\Http\Controllers;

use App\Models\ImmunizationRecord;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Barryvdh\DomPDF\Facade\Pdf;

class ImmunizationRecordController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = ImmunizationRecord::with(['barangay', 'creator']);

        if ($user->role === 'midwife') {
            $barangayIds = $user->barangays->pluck('id');
            $query->whereIn('barangay_id', $barangayIds);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('mother_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        $perPage = $request->get('per_page', 20);
        $records = $query->latest()->paginate($perPage);
        return response()->json($records);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'sex' => 'required|in:Male,Female',
            'barangay_id' => 'required|exists:barangays,id',
            'contact_no' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $record = ImmunizationRecord::create(array_merge(
            $request->all(),
            ['created_by' => $request->user()->id]
        ));

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => "Added immunization record: {$record->first_name} {$record->last_name}",
            'table_name' => 'immunization_records',
            'record_id' => $record->id,
        ]);

        return response()->json($record->load('barangay'), 201);
    }

    public function show($id)
    {
        $record = ImmunizationRecord::with(['barangay', 'creator'])->findOrFail($id);
        return response()->json($record);
    }

    public function update(Request $request, $id)
    {
        $record = ImmunizationRecord::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'sex' => 'required|in:Male,Female',
            'barangay_id' => 'required|exists:barangays,id',
            'contact_no' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $record->update($request->all());

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => "Updated immunization record: {$record->first_name} {$record->last_name}",
            'table_name' => 'immunization_records',
            'record_id' => $record->id,
        ]);

        return response()->json($record->load('barangay'));
    }

    public function destroy(Request $request, $id)
    {
        $record = ImmunizationRecord::findOrFail($id);
        $name = "{$record->first_name} {$record->last_name}";

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => "Deleted immunization record: {$name}",
            'table_name' => 'immunization_records',
            'record_id' => $id,
        ]);

        $record->delete();
        return response()->json(['message' => 'Record deleted successfully']);
    }

    public function toggleStatus(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            
            $record = ImmunizationRecord::findOrFail($id);
            
            // Store old status for logging
            $oldStatus = $record->status;
            
            // Toggle status
            $newStatus = $record->status === 'active' ? 'archived' : 'active';
            $record->status = $newStatus;
            
            // Save and verify
            $saved = $record->save();
            
            if (!$saved) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Failed to update record status',
                    'error' => 'Database save operation failed'
                ], 500);
            }
            
            // Verify the change was persisted
            $record->refresh();
            
            if ($record->status !== $newStatus) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Failed to update record status',
                    'error' => 'Status was not persisted to database'
                ], 500);
            }

            AuditLog::create([
                'user_id' => $request->user()->id,
                'action' => ucfirst($record->status) . " immunization record: {$record->first_name} {$record->last_name}",
                'table_name' => 'immunization_records',
                'record_id' => $id,
            ]);
            
            DB::commit();

            return response()->json([
                'message' => 'Status updated successfully',
                'record' => $record->load('barangay'),
                'old_status' => $oldStatus,
                'new_status' => $newStatus
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update record status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function exportExcel(Request $request)
    {
        $user = $request->user();
        $query = ImmunizationRecord::with(['barangay', 'creator']);

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
        $sheet->setTitle('Immunization Records');

        // Title
        $sheet->mergeCells('A1:AO1');
        $sheet->setCellValue('A1', 'IMMUNIZATION RECORDS - COMPLETE EXPORT');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14)->getColor()->setRGB('FFFFFF');
        $sheet->getStyle('A1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('064E3B');
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getRowDimension(1)->setRowHeight(28);

        // Info row
        $sheet->mergeCells('A2:AO2');
        $info = $request->has('start_date') && $request->has('end_date') 
            ? "Period: {$request->start_date} to {$request->end_date} | " 
            : '';
        $sheet->setCellValue('A2', "{$info}Generated: " . now()->format('Y-m-d H:i') . " | Total: {$records->count()} records");
        $sheet->getStyle('A2')->getFont()->setSize(10)->setItalic(true);
        $sheet->getStyle('A2')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('D1FAE5');
        $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Headers
        $headers = [
            'No', 'First Name', 'Middle Name', 'Last Name', 'Sex', 'Date of Birth',
            'Mother Name', 'Father/Guardian', 'Address', 'Barangay', 'Contact',
            'Birth Weight (kg)', 'Birth Length (cm)', 'Place of Birth', 'Birth Attendant',
            'Current Weight (kg)', 'Current Height (cm)', 'Head Circumference (cm)',
            'Weight-for-Age', 'Height-for-Age',
            'BCG', 'Hepa B', 'DPT-1', 'DPT-2', 'DPT-3', 'OPV-1', 'OPV-2', 'OPV-3', 'Measles',
            'Rotavirus 1', 'Rotavirus 2', 'PCV 1', 'PCV 2', 'PCV 3', 'MMR',
            'Vitamin A Date', 'Deworming Date',
            'Nutritional Status', 'Allergies', 'Previous Illnesses', 'Congenital Abnormalities',
            'Remarks', 'Created By', 'Date Created'
        ];

        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '4', $header);
            $sheet->getStyle($col . '4')->getFont()->setBold(true)->getColor()->setRGB('FFFFFF');
            $sheet->getStyle($col . '4')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('10B981');
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
                $record->date_of_birth ? $record->date_of_birth->format('Y-m-d') : '',
                $record->mother_name,
                $record->father_guardian_name,
                $record->address,
                $record->barangay->name ?? '',
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
                $record->creator->full_name ?? 'System',
                $record->created_at->format('Y-m-d H:i')
            ];

            $col = 'A';
            foreach ($data as $value) {
                $sheet->setCellValue($col . $row, $value);
                $sheet->getStyle($col . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
                if ($row % 2 == 0) {
                    $sheet->getStyle($col . $row)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('F0FDF4');
                }
                $col++;
            }
            $row++;
        }

        // Column widths
        $widths = [5,12,10,12,6,11,16,16,22,12,11,10,10,13,12,10,10,12,12,12,
                   10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,14,20,20,22,20,14,14];
        $col = 'A';
        foreach ($widths as $width) {
            $sheet->getColumnDimension($col)->setWidth($width);
            $col++;
        }

        $sheet->freezePane('E5');

        $writer = new Xlsx($spreadsheet);
        $filename = 'immunization_' . now()->format('Ymd_His') . '.xlsx';
        $temp_file = tempnam(sys_get_temp_dir(), $filename);
        $writer->save($temp_file);

        return response()->download($temp_file, $filename)->deleteFileAfterSend(true);
    }

    public function exportPdf(Request $request)
    {
        $user = $request->user();
        $query = ImmunizationRecord::with(['barangay', 'creator']);

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

        $pdf = Pdf::loadView('exports.immunization_pdf', compact('records', 'startDate', 'endDate'));
        $pdf->setPaper('a4', 'portrait');
        
        return $pdf->download('immunization_' . now()->format('Ymd_His') . '.pdf');
    }
}
