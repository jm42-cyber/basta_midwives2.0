<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add indexes to immunization_records
        Schema::table('immunization_records', function (Blueprint $table) {
            if (!$this->indexExists('immunization_records', 'immunization_records_barangay_id_index')) {
                $table->index('barangay_id');
            }
            if (!$this->indexExists('immunization_records', 'immunization_records_status_index')) {
                $table->index('status');
            }
            if (!$this->indexExists('immunization_records', 'immunization_records_status_barangay_id_index')) {
                $table->index(['status', 'barangay_id']);
            }
            if (!$this->indexExists('immunization_records', 'immunization_records_created_at_index')) {
                $table->index('created_at');
            }
        });

        // Add indexes to family_planning_records
        Schema::table('family_planning_records', function (Blueprint $table) {
            if (!$this->indexExists('family_planning_records', 'family_planning_records_barangay_id_index')) {
                $table->index('barangay_id');
            }
            if (!$this->indexExists('family_planning_records', 'family_planning_records_status_index')) {
                $table->index('status');
            }
            if (!$this->indexExists('family_planning_records', 'family_planning_records_status_barangay_id_index')) {
                $table->index(['status', 'barangay_id']);
            }
            if (!$this->indexExists('family_planning_records', 'family_planning_records_created_at_index')) {
                $table->index('created_at');
            }
        });

        // Add indexes to maternal_care_records
        Schema::table('maternal_care_records', function (Blueprint $table) {
            if (!$this->indexExists('maternal_care_records', 'maternal_care_records_barangay_id_index')) {
                $table->index('barangay_id');
            }
            if (!$this->indexExists('maternal_care_records', 'maternal_care_records_status_index')) {
                $table->index('status');
            }
            if (!$this->indexExists('maternal_care_records', 'maternal_care_records_status_barangay_id_index')) {
                $table->index(['status', 'barangay_id']);
            }
            if (!$this->indexExists('maternal_care_records', 'maternal_care_records_created_at_index')) {
                $table->index('created_at');
            }
        });

        // Add indexes to senior_citizen_records
        Schema::table('senior_citizen_records', function (Blueprint $table) {
            if (!$this->indexExists('senior_citizen_records', 'senior_citizen_records_barangay_id_index')) {
                $table->index('barangay_id');
            }
            if (!$this->indexExists('senior_citizen_records', 'senior_citizen_records_status_index')) {
                $table->index('status');
            }
            if (!$this->indexExists('senior_citizen_records', 'senior_citizen_records_status_barangay_id_index')) {
                $table->index(['status', 'barangay_id']);
            }
            if (!$this->indexExists('senior_citizen_records', 'senior_citizen_records_created_at_index')) {
                $table->index('created_at');
            }
        });

        // Add indexes to users
        Schema::table('users', function (Blueprint $table) {
            if (!$this->indexExists('users', 'users_role_index')) {
                $table->index('role');
            }
            if (!$this->indexExists('users', 'users_status_index')) {
                $table->index('status');
            }
            if (!$this->indexExists('users', 'users_role_status_index')) {
                $table->index(['role', 'status']);
            }
        });
    }

    private function indexExists($table, $index)
    {
        $connection = Schema::getConnection();
        $indexes = $connection->getDoctrineSchemaManager()->listTableIndexes($table);
        return array_key_exists($index, $indexes);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('immunization_records', function (Blueprint $table) {
            $table->dropIndex(['barangay_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['status', 'barangay_id']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('family_planning_records', function (Blueprint $table) {
            $table->dropIndex(['barangay_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['status', 'barangay_id']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('maternal_care_records', function (Blueprint $table) {
            $table->dropIndex(['barangay_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['status', 'barangay_id']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('senior_citizen_records', function (Blueprint $table) {
            $table->dropIndex(['barangay_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['status', 'barangay_id']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('barangays', function (Blueprint $table) {
            $table->dropIndex(['name']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['status']);
            $table->dropIndex(['role', 'status']);
        });
    }
};
