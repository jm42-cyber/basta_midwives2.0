<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Barangay;
use App\Models\AuditLog;

class AdminDashboardController extends Controller
{
    public function getStats(Request $request)
    {
        try {
            // Get total active midwives
            $totalMidwives = User::where('role', 'midwife')
                ->where('status', 'approved')
                ->count();
            
            // Get pending midwives
            $pendingMidwives = User::where('role', 'midwife')
                ->where('status', 'pending')
                ->count();
            
            // Get total barangays
            $totalBarangays = Barangay::count();
            
            // Get immunization records count (with error handling)
            $immunizationCount = 0;
            try {
                $immunizationCount = DB::table('immunization_records')->count();
            } catch (\Exception $e) {
                // Table doesn't exist yet
            }
            
            // Get maternal care records count
            $maternalCareCount = 0;
            try {
                $maternalCareCount = DB::table('maternal_care_records')->count();
            } catch (\Exception $e) {
                // Table doesn't exist yet
            }
            
            // Get family planning records count
            $familyPlanningCount = 0;
            try {
                $familyPlanningCount = DB::table('family_planning_records')->count();
            } catch (\Exception $e) {
                // Table doesn't exist yet
            }
            
            // Get senior citizen records count
            $seniorCitizenCount = 0;
            try {
                $seniorCitizenCount = DB::table('senior_citizen_records')->count();
            } catch (\Exception $e) {
                // Table doesn't exist yet
            }
            
            // Calculate total records
            $totalRecords = $immunizationCount + $maternalCareCount + $familyPlanningCount + $seniorCitizenCount;
            
            return response()->json([
                'total_midwives' => $totalMidwives,
                'pending_midwives' => $pendingMidwives,
                'total_barangays' => $totalBarangays,
                'immunization_count' => $immunizationCount,
                'maternal_care_count' => $maternalCareCount,
                'family_planning_count' => $familyPlanningCount,
                'senior_citizen_count' => $seniorCitizenCount,
                'total_records' => $totalRecords,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'total_midwives' => 0,
                'pending_midwives' => 0,
                'total_barangays' => 0,
                'immunization_count' => 0,
                'maternal_care_count' => 0,
                'family_planning_count' => 0,
                'senior_citizen_count' => 0,
                'total_records' => 0,
            ]);
        }
    }
    
    public function getRecentActivities(Request $request)
    {
        try {
            // Check if audit_logs table exists
            if (!DB::getSchemaBuilder()->hasTable('audit_logs')) {
                return response()->json([]);
            }
            
            // Get recent audit logs with user relationship
            $recentLogs = AuditLog::with('user')
                ->orderBy('timestamp', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($log) {
                    $userName = 'System';
                    if ($log->user) {
                        $userName = trim($log->user->first_name . ' ' . ($log->user->middle_name ? $log->user->middle_name . ' ' : '') . $log->user->last_name);
                    }
                    
                    return [
                        'id' => $log->id,
                        'action' => $log->action ?? 'Activity',
                        'user_name' => $userName,
                        'timestamp' => $log->timestamp->diffForHumans(),
                        'created_at' => $log->timestamp->toISOString(),
                    ];
                });
            
            return response()->json($recentLogs);
        } catch (\Exception $e) {
            \Log::error('Error fetching recent activities: ' . $e->getMessage());
            return response()->json([]);
        }
    }
    
    public function getPendingApprovals(Request $request)
    {
        try {
            // Get pending midwife accounts
            $pendingAccounts = User::where('role', 'midwife')
                ->where('status', 'pending')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->first_name . ' ' . $user->last_name,
                        'email' => $user->email,
                        'contact_number' => $user->contact_number ?? 'N/A',
                        'barangay' => 'N/A',
                        'created_at' => $user->created_at->format('Y-m-d'),
                    ];
                });
            
            return response()->json($pendingAccounts);
        } catch (\Exception $e) {
            \Log::error('Error fetching pending approvals: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function getMonthlyData(Request $request)
    {
        try {
            // Get last 6 months data
            $monthlyData = [];
            
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $monthName = $date->format('M');
                
                // Count records created in this month
                $recordsCount = 0;
                
                try {
                    $recordsCount += DB::table('immunization_records')
                        ->whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->count();
                } catch (\Exception $e) {}
                
                try {
                    $recordsCount += DB::table('maternal_care_records')
                        ->whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->count();
                } catch (\Exception $e) {}
                
                try {
                    $recordsCount += DB::table('family_planning_records')
                        ->whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->count();
                } catch (\Exception $e) {}
                
                try {
                    $recordsCount += DB::table('senior_citizen_records')
                        ->whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->count();
                } catch (\Exception $e) {}
                
                // Count midwives approved in this month
                $midwivesCount = User::where('role', 'midwife')
                    ->where('status', 'approved')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count();
                
                $monthlyData[] = [
                    'month' => $monthName,
                    'records' => $recordsCount,
                    'midwives' => $midwivesCount,
                ];
            }
            
            return response()->json($monthlyData);
        } catch (\Exception $e) {
            // Return empty data for last 6 months
            $monthlyData = [];
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $monthlyData[] = [
                    'month' => $date->format('M'),
                    'records' => 0,
                    'midwives' => 0,
                ];
            }
            return response()->json($monthlyData);
        }
    }
}
