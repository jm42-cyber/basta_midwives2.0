<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action');
            $table->string('table_name', 50)->nullable();
            $table->unsignedBigInteger('record_id')->nullable();
            $table->timestamp('timestamp')->useCurrent();
            
            $table->index(['user_id', 'timestamp']);
            $table->index('table_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
