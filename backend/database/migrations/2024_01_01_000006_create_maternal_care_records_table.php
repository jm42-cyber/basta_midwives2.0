<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maternal_care_records', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 50);
            $table->string('middle_name', 50)->nullable();
            $table->string('last_name', 50);
            $table->integer('age')->nullable();
            $table->enum('sex', ['Female'])->default('Female');
            $table->string('address')->nullable();
            $table->foreignId('barangay_id')->constrained()->onDelete('restrict');
            $table->string('contact_no', 20)->nullable();
            $table->string('civil_status', 50)->nullable();
            $table->string('educational_attainment', 100)->nullable();
            $table->string('occupation', 100)->nullable();
            
            // Pregnancy Information
            $table->integer('gravida')->nullable();
            $table->integer('para')->nullable();
            $table->date('lmp')->nullable();
            $table->date('edd')->nullable();
            $table->string('blood_type', 10)->nullable();
            
            // Previous Pregnancy History
            $table->integer('no_of_miscarriages')->nullable();
            $table->integer('no_of_stillbirths')->nullable();
            $table->integer('no_of_living_children')->nullable();
            $table->enum('previous_cesarean', ['Yes', 'No'])->nullable();
            $table->text('previous_complications')->nullable();
            
            // Prenatal Visits
            $table->date('prenatal_visit_1')->nullable();
            $table->date('prenatal_visit_2')->nullable();
            $table->date('prenatal_visit_3')->nullable();
            $table->date('prenatal_visit_4')->nullable();
            
            // Current Pregnancy Monitoring
            $table->string('fundal_height', 100)->nullable();
            $table->string('fetal_heart_rate', 100)->nullable();
            $table->string('fetal_presentation', 50)->nullable();
            $table->string('edema', 50)->nullable();
            $table->enum('proteinuria', ['Yes', 'No'])->nullable();
            
            // Vital Signs
            $table->string('weight_monitoring', 200)->nullable();
            $table->string('bp_monitoring', 200)->nullable();
            
            // Laboratory Results
            $table->string('hemoglobin', 20)->nullable();
            $table->string('blood_sugar', 20)->nullable();
            $table->string('urinalysis_result', 100)->nullable();
            $table->date('ultrasound_date')->nullable();
            $table->text('ultrasound_findings')->nullable();
            
            // High-Risk Indicators
            $table->enum('has_hypertension', ['Yes', 'No'])->nullable();
            $table->enum('has_gestational_diabetes', ['Yes', 'No'])->nullable();
            $table->enum('has_multiple_pregnancy', ['Yes', 'No'])->nullable();
            $table->enum('has_placenta_previa', ['Yes', 'No'])->nullable();
            $table->enum('has_preeclampsia', ['Yes', 'No'])->nullable();
            
            // Birth Preparedness
            $table->text('birth_plan')->nullable();
            $table->string('preferred_delivery_place', 100)->nullable();
            $table->string('emergency_contact', 100)->nullable();
            $table->string('emergency_contact_number', 20)->nullable();
            $table->enum('philhealth_member', ['Yes', 'No'])->nullable();
            
            // Immunization & Supplements
            $table->date('date_tt1')->nullable();
            $table->date('date_tt2')->nullable();
            $table->date('date_tt3')->nullable();
            $table->date('date_tt4')->nullable();
            $table->date('date_tt5')->nullable();
            $table->string('fim_status', 50)->nullable();
            $table->string('iron_folic', 100)->nullable();
            $table->string('calcium', 100)->nullable();
            $table->string('iodine', 100)->nullable();
            $table->string('bmi', 50)->nullable();
            $table->string('deworm', 50)->nullable();
            
            // Screening
            $table->string('syphilis_screening', 50)->nullable();
            $table->string('hepa_b_screening', 50)->nullable();
            $table->string('hiv_screening', 50)->nullable();
            $table->date('date_screened')->nullable();
            $table->string('result', 50)->nullable();
            $table->text('remarks')->nullable();
            
            $table->enum('status', ['active', 'archived'])->default('active');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->timestamps();
            
            $table->index(['barangay_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maternal_care_records');
    }
};
