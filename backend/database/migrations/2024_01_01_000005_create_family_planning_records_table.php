<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('family_planning_records', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 50);
            $table->string('middle_name', 50)->nullable();
            $table->string('last_name', 50);
            $table->enum('sex', ['Male', 'Female']);
            $table->integer('age')->nullable();
            $table->string('address')->nullable();
            $table->foreignId('barangay_id')->constrained()->onDelete('restrict');
            $table->string('civil_status', 50)->nullable();
            $table->string('educational_attainment', 100)->nullable();
            $table->string('occupation', 100)->nullable();
            $table->string('contact_no', 20)->nullable();
            $table->integer('no_of_living_children')->nullable();
            
            // Partner Information
            $table->string('partner_name', 100)->nullable();
            $table->integer('partner_age')->nullable();
            $table->string('partner_occupation', 100)->nullable();
            $table->enum('partner_consent', ['Yes', 'No'])->nullable();
            
            // Medical History
            $table->text('allergies')->nullable();
            $table->text('current_medications')->nullable();
            $table->text('medical_conditions')->nullable();
            $table->text('previous_surgeries')->nullable();
            
            // Reproductive History
            $table->date('last_childbirth_date')->nullable();
            $table->integer('no_of_miscarriages')->nullable();
            $table->integer('no_of_stillbirths')->nullable();
            $table->integer('youngest_child_age')->nullable();
            
            // Physical Examination
            $table->string('blood_pressure', 20)->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('bmi', 5, 2)->nullable();
            
            // Risk Screening
            $table->enum('smoker', ['Yes', 'No'])->nullable();
            $table->enum('history_blood_clots', ['Yes', 'No'])->nullable();
            $table->enum('history_cancer', ['Yes', 'No'])->nullable();
            $table->enum('history_stroke', ['Yes', 'No'])->nullable();
            
            // FP Details
            $table->date('date_of_visit')->nullable();
            $table->string('type_of_client', 20)->nullable();
            $table->date('date_accepted')->nullable();
            $table->string('type_of_fp_method', 100)->nullable();
            $table->date('date_started')->nullable();
            $table->text('remarks_side_effects')->nullable();
            $table->date('date_of_followup')->nullable();
            $table->string('method_changed', 1)->nullable();
            $table->string('new_method', 100)->nullable();
            $table->text('reason_for_change')->nullable();
            $table->string('midwife_name', 100)->nullable();
            $table->date('lmp')->nullable();
            $table->string('pregnancy_test_result', 50)->nullable();
            $table->string('source_of_supply', 100)->nullable();
            
            // Follow-up
            $table->date('date_of_last_supply')->nullable();
            $table->string('quantity_given', 50)->nullable();
            $table->date('next_supply_date')->nullable();
            $table->text('adherence_notes')->nullable();
            
            $table->enum('status', ['active', 'archived'])->default('active');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->timestamps();
            
            $table->index(['barangay_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_planning_records');
    }
};
