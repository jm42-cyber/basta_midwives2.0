<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ImmunizationRecordController;
use App\Http\Controllers\FamilyPlanningRecordController;
use App\Http\Controllers\MaternalCareRecordController;
use App\Http\Controllers\SeniorCitizenRecordController;
use App\Http\Controllers\BarangayController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\ReportController;

use App\Http\Controllers\PatientController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/verify-password', [AuthController::class, 'verifyPassword']);
    Route::get('/user/barangays', [AuthController::class, 'getUserBarangays']);
    
    // Dashboard routes
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/dashboard/recent-activities', [DashboardController::class, 'getRecentActivities']);
    Route::get('/dashboard/appointments/today', [DashboardController::class, 'getTodayAppointments']);
    Route::get('/dashboard/alerts', [DashboardController::class, 'getAlerts']);
    Route::get('/dashboard/monthly-trend', [DashboardController::class, 'monthlyTrend']);
    Route::get('/patients/search', [PatientController::class, 'search']);
    
    // Appointments routes
    Route::apiResource('appointments', AppointmentController::class);
    Route::patch('appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
    
    Route::apiResource('barangays', BarangayController::class);
    Route::apiResource('immunization-records', ImmunizationRecordController::class);
    Route::post('immunization-records/{id}/toggle-status', [ImmunizationRecordController::class, 'toggleStatus']);
    Route::get('immunization-records/export/excel', [ImmunizationRecordController::class, 'exportExcel']);
    Route::get('immunization-records/export/pdf', [ImmunizationRecordController::class, 'exportPdf']);
    Route::apiResource('family-planning-records', FamilyPlanningRecordController::class);
    Route::post('family-planning-records/{id}/toggle-status', [FamilyPlanningRecordController::class, 'toggleStatus']);
    Route::get('family-planning-records/export/excel', [FamilyPlanningRecordController::class, 'exportExcel']);
    Route::get('family-planning-records/export/pdf', [FamilyPlanningRecordController::class, 'exportPdf']);
    Route::apiResource('maternal-care-records', MaternalCareRecordController::class);
    Route::post('maternal-care-records/{id}/toggle-status', [MaternalCareRecordController::class, 'toggleStatus']);
    Route::get('maternal-care-records/export/excel', [MaternalCareRecordController::class, 'exportExcel']);
    Route::get('maternal-care-records/export/pdf', [MaternalCareRecordController::class, 'exportPdf']);
    Route::apiResource('senior-citizen-records', SeniorCitizenRecordController::class);
    Route::post('senior-citizen-records/{id}/toggle-status', [SeniorCitizenRecordController::class, 'toggleStatus']);
    Route::get('senior-citizen-records/export/excel', [SeniorCitizenRecordController::class, 'exportExcel']);
    Route::get('senior-citizen-records/export/pdf', [SeniorCitizenRecordController::class, 'exportPdf']);
    
    // Alerts - accessible by both admin and midwives
    Route::get('alerts/count', [AlertController::class, 'count']);
    Route::get('alerts', [AlertController::class, 'index']);
    Route::post('alerts', [AlertController::class, 'store']);
    Route::delete('alerts/{id}', [AlertController::class, 'destroy']);
    Route::post('alerts/{id}/reply', [AlertController::class, 'reply']);
    Route::patch('alerts/{id}/read', [AlertController::class, 'markRead']);
    Route::get('admin/midwives-list', [AlertController::class, 'getMidwivesList']);
    
    Route::middleware('admin')->group(function () {
        // Admin Dashboard routes
        Route::get('admin/dashboard/stats', [AdminDashboardController::class, 'getStats']);
        Route::get('admin/dashboard/activities', [AdminDashboardController::class, 'getRecentActivities']);
        Route::get('admin/dashboard/pending-approvals', [AdminDashboardController::class, 'getPendingApprovals']);
        Route::get('admin/dashboard/monthly-data', [AdminDashboardController::class, 'getMonthlyData']);
        
        // Reports routes
        Route::get('admin/barangays', [ReportController::class, 'getBarangays']);
        Route::get('admin/midwives', [ReportController::class, 'getMidwives']);
        Route::get('admin/patients', [ReportController::class, 'getPatients']);
        Route::get('admin/reports/download', [ReportController::class, 'downloadReport']);
        
        Route::apiResource('users', UserController::class);
        Route::post('users/{id}/approve', [UserController::class, 'approve']);
        Route::post('users/{id}/reject', [UserController::class, 'reject']);
        Route::post('users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
        Route::get('audit-logs', [AuditLogController::class, 'index']);
    });
});
