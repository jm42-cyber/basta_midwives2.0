<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('senior_citizen_records', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 50);
            $table->string('middle_name', 50)->nullable();
            $table->string('last_name', 50);
            $table->enum('sex', ['Male', 'Female']);
            $table->integer('age')->nullable();
            $table->string('address')->nullable();
            $table->foreignId('barangay_id')->constrained()->onDelete('restrict');
            $table->string('contact_no', 20)->nullable();
            $table->string('civil_status', 50)->nullable();
            $table->string('occupation', 100)->nullable();
            $table->string('educational_attainment', 100)->nullable();
            
            // Vital Signs
            $table->string('blood_pressure', 20)->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('bmi', 5, 2)->nullable();
            $table->decimal('temperature', 4, 1)->nullable();
            $table->integer('heart_rate')->nullable();
            $table->integer('respiratory_rate')->nullable();
            
            // Chronic Conditions
            $table->enum('has_hypertension', ['Yes', 'No'])->nullable();
            $table->enum('has_diabetes', ['Yes', 'No'])->nullable();
            $table->enum('has_heart_disease', ['Yes', 'No'])->nullable();
            $table->enum('has_kidney_disease', ['Yes', 'No'])->nullable();
            $table->enum('has_arthritis', ['Yes', 'No'])->nullable();
            $table->enum('has_copd_asthma', ['Yes', 'No'])->nullable();
            $table->enum('has_dementia', ['Yes', 'No'])->nullable();
            
            // Medications
            $table->text('maintenance_medications')->nullable();
            $table->text('medication_allergies')->nullable();
            
            // Functional Assessment
            $table->string('mobility_status', 50)->nullable();
            $table->string('adl_score', 50)->nullable();
            $table->enum('fall_history', ['Yes', 'No'])->nullable();
            $table->string('uses_assistive_device', 100)->nullable();
            
            // Cognitive Assessment
            $table->string('memory_status', 50)->nullable();
            $table->string('dementia_screening_result', 50)->nullable();
            
            // Health Screenings
            $table->string('blood_sugar_level', 20)->nullable();
            $table->string('cholesterol_level', 20)->nullable();
            $table->string('tb_screening', 50)->nullable();
            $table->string('cancer_screening', 100)->nullable();
            
            // Social Support
            $table->string('living_arrangement', 50)->nullable();
            $table->string('primary_caregiver', 100)->nullable();
            $table->string('emergency_contact', 100)->nullable();
            $table->string('emergency_contact_number', 20)->nullable();
            
            // Nutrition
            $table->string('nutritional_status', 50)->nullable();
            $table->enum('special_diet', ['Yes', 'No'])->nullable();
            $table->text('special_diet_details')->nullable();
            
            // Dental Health
            $table->enum('has_dentures', ['Yes', 'No'])->nullable();
            $table->date('last_dental_visit')->nullable();
            
            // Visual Screening
            $table->string('eye_complaints')->nullable();
            $table->string('visual_acuity', 50)->nullable();
            $table->string('with_eye_problem', 1)->nullable();
            $table->string('pinhole_vision_result', 50)->nullable();
            $table->date('date_referred')->nullable();
            $table->text('management')->nullable();
            
            // Immunization
            $table->date('ppv_immunization_date')->nullable();
            $table->date('influenza_immunization_date')->nullable();
            
            $table->text('remarks')->nullable();
            $table->enum('status', ['active', 'archived'])->default('active');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->timestamps();
            
            $table->index(['barangay_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('senior_citizen_records');
    }
};
