<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $barangayIds = $user->barangays->pluck('id')->toArray();
        
        $perPage = $request->input('per_page', 10);
        
        $appointments = DB::table('appointments')
            ->join('barangays', 'appointments.barangay_id', '=', 'barangays.id')
            ->whereIn('appointments.barangay_id', $barangayIds)
            ->select(
                'appointments.*',
                'barangays.name as barangay_name'
            )
            ->orderBy('appointments.appointment_date', 'desc')
            ->orderBy('appointments.appointment_time', 'desc')
            ->paginate($perPage);
        
        return response()->json($appointments);
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_name' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'appointment_type' => 'required|string',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'barangay_id' => 'required|exists:barangays,id',
            'notes' => 'nullable|string'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $appointmentId = DB::table('appointments')->insertGetId([
            'patient_name' => $request->patient_name,
            'contact_number' => $request->contact_number,
            'email' => $request->email,
            'appointment_type' => $request->appointment_type,
            'appointment_date' => $request->appointment_date,
            'appointment_time' => $request->appointment_time,
            'barangay_id' => $request->barangay_id,
            'notes' => $request->notes,
            'status' => 'scheduled',
            'created_by' => $request->user()->id,
            'created_at' => now(),
            'updated_at' => now()
        ]);
        
        $appointment = DB::table('appointments')->where('id', $appointmentId)->first();
        
        return response()->json($appointment, 201);
    }
    
    public function show($id)
    {
        $appointment = DB::table('appointments')
            ->join('barangays', 'appointments.barangay_id', '=', 'barangays.id')
            ->where('appointments.id', $id)
            ->select('appointments.*', 'barangays.name as barangay_name')
            ->first();
        
        if (!$appointment) {
            return response()->json(['message' => 'Appointment not found'], 404);
        }
        
        return response()->json($appointment);
    }
    
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'patient_name' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'appointment_type' => 'required|string',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'barangay_id' => 'required|exists:barangays,id',
            'notes' => 'nullable|string'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        DB::table('appointments')
            ->where('id', $id)
            ->update([
                'patient_name' => $request->patient_name,
                'contact_number' => $request->contact_number,
                'email' => $request->email,
                'appointment_type' => $request->appointment_type,
                'appointment_date' => $request->appointment_date,
                'appointment_time' => $request->appointment_time,
                'barangay_id' => $request->barangay_id,
                'notes' => $request->notes,
                'updated_at' => now()
            ]);
        
        $appointment = DB::table('appointments')->where('id', $id)->first();
        
        return response()->json($appointment);
    }
    
    public function destroy($id)
    {
        DB::table('appointments')->where('id', $id)->delete();
        
        return response()->json(['message' => 'Appointment deleted successfully']);
    }
    
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:scheduled,completed,cancelled'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        DB::table('appointments')
            ->where('id', $id)
            ->update([
                'status' => $request->status,
                'updated_at' => now()
            ]);
        
        return response()->json(['message' => 'Status updated successfully']);
    }
}
