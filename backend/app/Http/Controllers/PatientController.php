<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientController extends Controller
{
    public function search(Request $request)
    {
        $request->validate(['q' => 'required|string|min:1|max:100']);

        $user        = $request->user();
        $allowedIds  = $user->barangays->pluck('id')->toArray();

        if ($request->filled('barangay_id') && in_array((int) $request->barangay_id, $allowedIds)) {
            $barangayIds = [(int) $request->barangay_id];
        } else {
            $barangayIds = $allowedIds;
        }

        $q = '%' . $request->q . '%';

        $results = collect();

        // Immunization
        $imm = DB::table('immunization_records')
            ->join('barangays', 'immunization_records.barangay_id', '=', 'barangays.id')
            ->whereIn('immunization_records.barangay_id', $barangayIds)
            ->where('immunization_records.status', 'active')
            ->where(DB::raw("CONCAT(immunization_records.first_name, ' ', immunization_records.last_name)"), 'like', $q)
            ->select(
                'immunization_records.id',
                DB::raw("CONCAT(immunization_records.first_name, ' ', COALESCE(immunization_records.middle_name, ''), ' ', immunization_records.last_name) as name"),
                DB::raw("'Immunization' as program"),
                'barangays.name as barangay_name'
            )
            ->limit(4)->get();

        // Maternal Care
        $mat = DB::table('maternal_care_records')
            ->join('barangays', 'maternal_care_records.barangay_id', '=', 'barangays.id')
            ->whereIn('maternal_care_records.barangay_id', $barangayIds)
            ->where('maternal_care_records.status', 'active')
            ->where(DB::raw("CONCAT(maternal_care_records.first_name, ' ', maternal_care_records.last_name)"), 'like', $q)
            ->select(
                'maternal_care_records.id',
                DB::raw("CONCAT(maternal_care_records.first_name, ' ', COALESCE(maternal_care_records.middle_name, ''), ' ', maternal_care_records.last_name) as name"),
                DB::raw("'Maternal Care' as program"),
                'barangays.name as barangay_name'
            )
            ->limit(3)->get();

        // Family Planning
        $fp = DB::table('family_planning_records')
            ->join('barangays', 'family_planning_records.barangay_id', '=', 'barangays.id')
            ->whereIn('family_planning_records.barangay_id', $barangayIds)
            ->where('family_planning_records.status', 'active')
            ->where(DB::raw("CONCAT(family_planning_records.first_name, ' ', family_planning_records.last_name)"), 'like', $q)
            ->select(
                'family_planning_records.id',
                DB::raw("CONCAT(family_planning_records.first_name, ' ', COALESCE(family_planning_records.middle_name, ''), ' ', family_planning_records.last_name) as name"),
                DB::raw("'Family Planning' as program"),
                'barangays.name as barangay_name'
            )
            ->limit(2)->get();

        // Senior Citizen
        $sc = DB::table('senior_citizen_records')
            ->join('barangays', 'senior_citizen_records.barangay_id', '=', 'barangays.id')
            ->whereIn('senior_citizen_records.barangay_id', $barangayIds)
            ->where('senior_citizen_records.status', 'active')
            ->where(DB::raw("CONCAT(senior_citizen_records.first_name, ' ', senior_citizen_records.last_name)"), 'like', $q)
            ->select(
                'senior_citizen_records.id',
                DB::raw("CONCAT(senior_citizen_records.first_name, ' ', COALESCE(senior_citizen_records.middle_name, ''), ' ', senior_citizen_records.last_name) as name"),
                DB::raw("'Senior Citizen' as program"),
                'barangays.name as barangay_name'
            )
            ->limit(1)->get();

        $results = $imm->concat($mat)->concat($fp)->concat($sc)->take(10)->values();

        return response()->json($results);
    }
}
