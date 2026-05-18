<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barangays', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('address')->nullable();
            $table->string('contact_number', 20)->nullable();
            $table->string('barangay_captain', 100)->nullable();
            $table->string('health_officer', 100)->nullable();
            $table->integer('population')->nullable();
            $table->integer('population_male')->nullable();
            $table->integer('population_female')->nullable();
            $table->integer('population_children')->nullable();
            $table->string('coverage_area', 100)->nullable();
            $table->timestamps();
            
            $table->index('name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barangays');
    }
};
