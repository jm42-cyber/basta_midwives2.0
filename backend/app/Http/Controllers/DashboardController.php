<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $user = $request->user();
        $allowedIds = $user->barangays->pluck('id')->toArray();

        // If a specific barangay_id is requested, validate it belongs to the midwife
        if ($request->filled('barangay_id')) {
            $barangayIds = in_array((int) $request->barangay_id, $allowedIds)
                ? [(int) $request->barangay_id]
                : $allowedIds;
        } else {
            $barangayIds = $allowedIds;
        }

        $immunizationCount = DB::table('immunization_records')
            ->whereIn('barangay_id', $barangayIds)
            ->where('status', 'active')
            ->count();

        $maternalCareCount = DB::table('maternal_care_records')
            ->whereIn('barangay_id', $barangayIds)
            ->where('status', 'active')
            ->count();

        $familyPlanningCount = DB::table('family_planning_records')
            ->whereIn('barangay_id', $barangayIds)
            ->where('status', 'active')
            ->count();

        $seniorCitizenCount = DB::table('senior_citizen_records')
            ->whereIn('barangay_id', $barangayIds)
            ->where('status', 'active')
            ->count();

        // Per-barangay stats for the authenticated midwife only
        $barangayStats = $user->barangays->map(function ($barangay) use ($user) {
            $immunizationRecords = DB::table('immunization_records')
                ->where('barangay_id', $barangay->id)
                ->where('created_by', $user->id)
                ->where('status', 'active')
                ->count();

            $maternalCareRecords = DB::table('maternal_care_records')
                ->where('barangay_id', $barangay->id)
                ->where('created_by', $user->id)
                ->where('status', 'active')
                ->count();

            $familyPlanningRecords = DB::table('family_planning_records')
                ->where('barangay_id', $barangay->id)
                ->where('created_by', $user->id)
                ->where('status', 'active')
                ->count();

            $seniorCitizenRecords = DB::table('senior_citizen_records')
                ->where('barangay_id', $barangay->id)
                ->where('created_by', $user->id)
                ->where('status', 'active')
                ->count();

            $totalRecords = $immunizationRecords + $maternalCareRecords + $familyPlanningRecords + $seniorCitizenRecords;

            return [
                'id' => $barangay->id,
                'name' => $barangay->name,
                'population' => $barangay->population,
                'records' => $totalRecords,
            ];
        });

        return response()->json([
            'immunization_count'    => $immunizationCount,
            'maternal_care_count'   => $maternalCareCount,
            'family_planning_count' => $familyPlanningCount,
            'senior_citizen_count'  => $seniorCitizenCount,
            'total_records'         => $immunizationCount + $maternalCareCount + $familyPlanningCount + $seniorCitizenCount,
            'monthly_targets'       => [
                'immunization'    => 50,
                'maternal_care'   => 30,
                'family_planning' => 40,
                'senior_citizen'  => 25,
            ],
            'barangay_stats' => $barangayStats,
        ]);
    }

    public function getAlerts(Request $request)
    {
        $user = $request->user();
        $barangayIds = $user->barangays->pluck('id')->toArray();

        if (empty($barangayIds)) {
            return response()->json([
                'overdue_immunizations'  => 0,
                'upcoming_appointments'  => 0,
                'high_risk_maternal'     => 0,
            ]);
        }

        $today    = Carbon::today();
        $tomorrow = Carbon::tomorrow();

        // Immunization records where the child has missed a scheduled vaccine
        // We use created_at as a proxy: records older than 30 days with no recent update
        $overdueImmunizations = DB::table('immunization_records')
            ->whereIn('barangay_id', $barangayIds)
            ->where('status', 'active')
            ->whereDate('created_at', '<', $today->copy()->subDays(30))
            ->count();

        $upcomingAppointments = DB::table('appointments')
            ->whereIn('barangay_id', $barangayIds)
            ->where('status', 'scheduled')
            ->whereIn(DB::raw('DATE(appointment_date)'), [
                $today->toDateString(),
                $tomorrow->toDateString(),
            ])
            ->count();

        // High-risk maternal: any of the high-risk indicators set to 'Yes'
        $highRiskMaternal = DB::table('maternal_care_records')
            ->whereIn('barangay_id', $barangayIds)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->where('has_hypertension', 'Yes')
                  ->orWhere('has_gestational_diabetes', 'Yes')
                  ->orWhere('has_preeclampsia', 'Yes')
                  ->orWhere('has_placenta_previa', 'Yes');
            })
            ->count();

        return response()->json([
            'overdue_immunizations' => $overdueImmunizations,
            'upcoming_appointments' => $upcomingAppointments,
            'high_risk_maternal'    => $highRiskMaternal,
        ]);
    }

    public function getRecentActivities(Request $request)
    {
        try {
            $user = $request->user();
            $barangayIds = $user->barangays->pluck('id')->toArray();

            if (empty($barangayIds)) {
                return response()->json([]);
            }

            $activities = [];

            // Immunization records
            if (DB::getSchemaBuilder()->hasTable('immunization_records')) {
                $immunizations = DB::table('immunization_records')
                    ->join('barangays', 'immunization_records.barangay_id', '=', 'barangays.id')
                    ->whereIn('immunization_records.barangay_id', $barangayIds)
                    ->where('immunization_records.created_by', $user->id)
                    ->select(
                        'immunization_records.id',
                        DB::raw("CONCAT(immunization_records.first_name, ' ', immunization_records.last_name) as patient_name"),
                        'barangays.name as barangay_name',
                        'immunization_records.created_at',
                        DB::raw("'immunization' as type"),
                        DB::raw("'Created immunization record' as title")
                    )
                    ->orderBy('immunization_records.created_at', 'desc')
                    ->limit(10)
                    ->get();

                foreach ($immunizations as $record) {
                    $activities[] = $record;
                }
            }

            // Maternal care records
            if (DB::getSchemaBuilder()->hasTable('maternal_care_records')) {
                $maternalCare = DB::table('maternal_care_records')
                    ->join('barangays', 'maternal_care_records.barangay_id', '=', 'barangays.id')
                    ->whereIn('maternal_care_records.barangay_id', $barangayIds)
                    ->where('maternal_care_records.created_by', $user->id)
                    ->select(
                        'maternal_care_records.id',
                        DB::raw("CONCAT(maternal_care_records.first_name, ' ', maternal_care_records.last_name) as patient_name"),
                        'barangays.name as barangay_name',
                        'maternal_care_records.created_at',
                        DB::raw("'maternal_care' as type"),
                        DB::raw("'Added maternal care record' as title")
                    )
                    ->orderBy('maternal_care_records.created_at', 'desc')
                    ->limit(10)
                    ->get();

                foreach ($maternalCare as $record) {
                    $activities[] = $record;
                }
            }

            // Family planning records
            if (DB::getSchemaBuilder()->hasTable('family_planning_records')) {
                $familyPlanning = DB::table('family_planning_records')
                    ->join('barangays', 'family_planning_records.barangay_id', '=', 'barangays.id')
                    ->whereIn('family_planning_records.barangay_id', $barangayIds)
                    ->where('family_planning_records.created_by', $user->id)
                    ->select(
                        'family_planning_records.id',
                        DB::raw("CONCAT(family_planning_records.first_name, ' ', family_planning_records.last_name) as patient_name"),
                        'barangays.name as barangay_name',
                        'family_planning_records.created_at',
                        DB::raw("'family_planning' as type"),
                        DB::raw("'Updated family planning record' as title")
                    )
                    ->orderBy('family_planning_records.created_at', 'desc')
                    ->limit(10)
                    ->get();

                foreach ($familyPlanning as $record) {
                    $activities[] = $record;
                }
            }

            // Senior citizen records
            if (DB::getSchemaBuilder()->hasTable('senior_citizen_records')) {
                $seniorCitizen = DB::table('senior_citizen_records')
                    ->join('barangays', 'senior_citizen_records.barangay_id', '=', 'barangays.id')
                    ->whereIn('senior_citizen_records.barangay_id', $barangayIds)
                    ->where('senior_citizen_records.created_by', $user->id)
                    ->select(
                        'senior_citizen_records.id',
                        DB::raw("CONCAT(senior_citizen_records.first_name, ' ', senior_citizen_records.last_name) as patient_name"),
                        'barangays.name as barangay_name',
                        'senior_citizen_records.created_at',
                        DB::raw("'senior_citizen' as type"),
                        DB::raw("'Added senior citizen record' as title")
                    )
                    ->orderBy('senior_citizen_records.created_at', 'desc')
                    ->limit(10)
                    ->get();

                foreach ($seniorCitizen as $record) {
                    $activities[] = $record;
                }
            }

            if (!empty($activities)) {
                usort($activities, function ($a, $b) {
                    return strtotime($b->created_at) - strtotime($a->created_at);
                });
            }

            return response()->json(array_slice($activities, 0, 20));
        } catch (\Exception $e) {
            \Log::error('Dashboard activities error: ' . $e->getMessage());
            return response()->json([]);
        }
    }

    public function getTodayAppointments(Request $request)
    {
        $user = $request->user();
        $barangayIds = $user->barangays->pluck('id')->toArray();
        $today = Carbon::today();
        $nextWeek = Carbon::today()->addDays(7);

        $appointments = DB::table('appointments')
            ->join('barangays', 'appointments.barangay_id', '=', 'barangays.id')
            ->whereIn('appointments.barangay_id', $barangayIds)
            ->whereBetween('appointments.appointment_date', [$today, $nextWeek])
            ->where('appointments.status', '!=', 'cancelled')
            ->select(
                'appointments.id',
                'appointments.patient_name as patient',
                'appointments.appointment_type as type',
                'barangays.name as barangay',
                'appointments.appointment_date as date',
                DB::raw("DATE_FORMAT(appointments.appointment_time, '%h:%i %p') as time")
            )
            ->orderBy('appointments.appointment_date', 'asc')
            ->orderBy('appointments.appointment_time', 'asc')
            ->get();

        return response()->json($appointments);
    }

    public function monthlyTrend(Request $request)
    {
        $midwife = $request->user();
        $barangayIds = $midwife->barangays->pluck('id');
        $year = now()->year;

        $months = collect(range(1, 12))->map(function ($month) use ($barangayIds, $year) {
            // My records - created by this midwife
            $myRecords = collect([
                DB::table('immunization_records'),
                DB::table('maternal_care_records'),
                DB::table('family_planning_records'),
                DB::table('senior_citizen_records'),
            ])->sum(fn($q) => $q->where('created_by', auth()->id())
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->count());

            // Global records - all records in my assigned barangays
            $globalRecords = collect([
                DB::table('immunization_records'),
                DB::table('maternal_care_records'),
                DB::table('family_planning_records'),
                DB::table('senior_citizen_records'),
            ])->sum(fn($q) => $q->whereIn('barangay_id', $barangayIds)
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->count());

            return [
                'month' => now()->setMonth($month)->format('M'),
                'myRecords' => $myRecords,
                'globalRecords' => $globalRecords,
            ];
        });

        return response()->json($months);
    }
}
