<?php

namespace App\Http\Controllers;

use App\Models\MaternalCareRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Barryvdh\DomPDF\Facade\Pdf;

class MaternalCareRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = MaternalCareRecord::with(['barangay', 'creator']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'active');
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('barangay_id')) {
            $query->where('barangay_id', $request->barangay_id);
        }

        $perPage = $request->get('per_page', 20);
        $records = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($records);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'barangay_id' => 'required|exists:barangays,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record = MaternalCareRecord::create(array_merge(
            $request->all(),
            ['created_by' => auth()->id()]
        ));

        return response()->json($record->load(['barangay', 'creator']), 201);
    }

    public function show($id)
    {
        $record = MaternalCareRecord::with(['barangay', 'creator'])->findOrFail($id);
        return response()->json($record);
    }

    public function update(Request $request, $id)
    {
        $record = MaternalCareRecord::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'barangay_id' => 'required|exists:barangays,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record->update($request->all());

        return response()->json($record->load(['barangay', 'creator']));
    }

    public function destroy($id)
    {
        $record = MaternalCareRecord::findOrFail($id);
        $record->delete();

        return response()->json(['message' => 'Record deleted successfully']);
    }

    public function toggleStatus($id)
    {
        $record = MaternalCareRecord::findOrFail($id);
        
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
        $query = MaternalCareRecord::with(['barangay', 'creator']);

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
                  ->orWhere('middle_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        $query->where('status', 'active');
        $records = $query->orderBy('created_at', 'desc')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Headers
        $headers = [
            'ID', 'First Name', 'Middle Name', 'Last Name', 'Age', 'Sex', 'Address', 'Barangay',
            'Contact No', 'Civil Status', 'Educational Attainment', 'Occupation',
            'Gravida', 'Para', 'LMP', 'EDD', 'Blood Type',
            'No. of Miscarriages', 'No. of Stillbirths', 'No. of Living Children', 'Previous Cesarean', 'Previous Complications',
            'Prenatal Visit 1', 'Prenatal Visit 2', 'Prenatal Visit 3', 'Prenatal Visit 4',
            'Fundal Height', 'Fetal Heart Rate', 'Fetal Presentation', 'Edema', 'Proteinuria',
            'Weight Monitoring', 'BP Monitoring',
            'Hemoglobin', 'Blood Sugar', 'Urinalysis Result', 'Ultrasound Date', 'Ultrasound Findings',
            'Hypertension', 'Gestational Diabetes', 'Multiple Pregnancy', 'Placenta Previa', 'Preeclampsia',
            'Birth Plan', 'Preferred Delivery Place', 'Emergency Contact', 'Emergency Contact Number', 'PhilHealth Member',
            'TT1 Date', 'TT2 Date', 'TT3 Date', 'TT4 Date', 'TT5 Date', 'FIM Status',
            'Iron Folic', 'Calcium', 'Iodine', 'BMI', 'Deworm',
            'Syphilis Screening', 'Hepa B Screening', 'HIV Screening', 'Date Screened', 'Result',
            'Remarks', 'Status', 'Created By', 'Created At'
        ];

        $sheet->fromArray($headers, null, 'A1');

        // Style header
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'EC4899']],
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
                $record->age,
                $record->sex,
                $record->address,
                $record->barangay->name ?? '',
                $record->contact_no,
                $record->civil_status,
                $record->educational_attainment,
                $record->occupation,
                $record->gravida,
                $record->para,
                $record->lmp,
                $record->edd,
                $record->blood_type,
                $record->no_of_miscarriages,
                $record->no_of_stillbirths,
                $record->no_of_living_children,
                $record->previous_cesarean,
                $record->previous_complications,
                $record->prenatal_visit_1,
                $record->prenatal_visit_2,
                $record->prenatal_visit_3,
                $record->prenatal_visit_4,
                $record->fundal_height,
                $record->fetal_heart_rate,
                $record->fetal_presentation,
                $record->edema,
                $record->proteinuria,
                $record->weight_monitoring,
                $record->bp_monitoring,
                $record->hemoglobin,
                $record->blood_sugar,
                $record->urinalysis_result,
                $record->ultrasound_date,
                $record->ultrasound_findings,
                $record->has_hypertension,
                $record->has_gestational_diabetes,
                $record->has_multiple_pregnancy,
                $record->has_placenta_previa,
                $record->has_preeclampsia,
                $record->birth_plan,
                $record->preferred_delivery_place,
                $record->emergency_contact,
                $record->emergency_contact_number,
                $record->philhealth_member,
                $record->date_tt1,
                $record->date_tt2,
                $record->date_tt3,
                $record->date_tt4,
                $record->date_tt5,
                $record->fim_status,
                $record->iron_folic,
                $record->calcium,
                $record->iodine,
                $record->bmi,
                $record->deworm,
                $record->syphilis_screening,
                $record->hepa_b_screening,
                $record->hiv_screening,
                $record->date_screened,
                $record->result,
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
        $filename = 'maternal_care_records_' . date('Y-m-d_His') . '.xlsx';
        $temp_file = tempnam(sys_get_temp_dir(), $filename);
        $writer->save($temp_file);

        return response()->download($temp_file, $filename)->deleteFileAfterSend(true);
    }

    public function exportPdf(Request $request)
    {
        $query = MaternalCareRecord::with(['barangay', 'creator']);

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
                  ->orWhere('middle_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        $query->where('status', 'active');
        $records = $query->orderBy('created_at', 'desc')->get();

        $pdf = Pdf::loadView('exports.maternal_care_pdf', compact('records'));
        $pdf->setPaper('a4', 'landscape');
        
        return $pdf->download('maternal_care_records_' . date('Y-m-d_His') . '.pdf');
    }
}
