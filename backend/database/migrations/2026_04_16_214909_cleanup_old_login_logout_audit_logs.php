<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Delete old login/logout audit logs that don't have proper table_name
        DB::table('audit_logs')
            ->where(function($query) {
                $query->where('action', 'login')
                      ->orWhere('action', 'logout')
                      ->orWhere('action', 'like', '%LOGGED IN%')
                      ->orWhere('action', 'like', '%LOGGED OUT%');
            })
            ->where(function($query) {
                $query->whereNull('table_name')
                      ->orWhere('table_name', '!=', 'user_sessions');
            })
            ->delete();
    }

    public function down(): void
    {
        // Cannot reverse deletion
    }
};
