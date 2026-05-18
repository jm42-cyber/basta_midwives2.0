<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('immunization_records', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 50);
            $table->string('middle_name', 50)->nullable();
            $table->string('last_name', 50);
            $table->string('mother_name', 100)->nullable();
            $table->string('father_guardian_name', 100)->nullable();
            $table->enum('sex', ['Male', 'Female']);
            $table->date('date_of_birth')->nullable();
            $table->string('address')->nullable();
            $table->foreignId('barangay_id')->constrained()->onDelete('restrict');
            $table->string('contact_no', 20)->nullable();
            
            // Birth Information
            $table->decimal('birth_weight', 5, 2)->nullable();
            $table->decimal('birth_length', 5, 2)->nullable();
            $table->string('place_of_birth', 100)->nullable();
            $table->string('birth_attendant', 50)->nullable();
            
            // Current Measurements
            $table->decimal('current_weight', 5, 2)->nullable();
            $table->decimal('current_height', 5, 2)->nullable();
            $table->decimal('head_circumference', 5, 2)->nullable();
            $table->string('weight_for_age', 50)->nullable();
            $table->string('height_for_age', 50)->nullable();
            
            // Vaccines
            $table->date('bcg')->nullable();
            $table->date('hepa_b')->nullable();
            $table->date('dpt1')->nullable();
            $table->date('dpt2')->nullable();
            $table->date('dpt3')->nullable();
            $table->date('opv1')->nullable();
            $table->date('opv2')->nullable();
            $table->date('opv3')->nullable();
            $table->date('measles')->nullable();
            $table->date('rotavirus1')->nullable();
            $table->date('rotavirus2')->nullable();
            $table->date('pcv1')->nullable();
            $table->date('pcv2')->nullable();
            $table->date('pcv3')->nullable();
            $table->date('mmr')->nullable();
            
            // Supplements
            $table->date('vit_a_date')->nullable();
            $table->date('deworming_date')->nullable();
            
            // Health Status
            $table->string('nutritional_status', 50)->nullable();
            $table->text('allergies')->nullable();
            $table->text('previous_illnesses')->nullable();
            $table->text('congenital_abnormalities')->nullable();
            $table->text('remarks')->nullable();
            
            $table->enum('status', ['active', 'archived'])->default('active');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->timestamps();
            
            $table->index(['barangay_id', 'status']);
            $table->index('created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('immunization_records');
    }
};
