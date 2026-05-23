<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Get Jay Mark Del Valle's user ID and barangays
        $jayMark = DB::table('users')
            ->where('first_name', 'Jay Mark')
            ->where('last_name', 'Del Valle')
            ->first();
        
        if (!$jayMark) {
            $this->command->error('Jay Mark Del Valle not found! Please create the user first.');
            return;
        }

        // Get Jay Mark's assigned barangays
        $jayMarkBarangays = DB::table('user_barangays')
            ->where('user_id', $jayMark->id)
            ->pluck('barangay_id')
            ->toArray();

        if (empty($jayMarkBarangays)) {
            $this->command->error('Jay Mark has no assigned barangays!');
            return;
        }

        // Get all barangays for other midwives
        $allBarangays = DB::table('barangays')->pluck('id')->toArray();

        $this->command->info('Starting test data generation...');

        // 1. Add 6 approved midwives with random barangays
        $this->command->info('Creating 6 approved midwives...');
        $this->createMidwives($allBarangays);

        // 2. Add 8 pending midwives
        $this->command->info('Creating 8 pending midwives...');
        $this->createPendingMidwives();

        // 3. Generate patients and records for Jay Mark
        $this->command->info('Generating patients for Jay Mark Del Valle...');
        $patients = $this->generatePatients(500); // Generate enough patients

        // 4. Create Immunization Records (94)
        $this->command->info('Creating 94 immunization records...');
        $this->createImmunizationRecords($jayMark->id, $jayMarkBarangays, $patients, 94);

        // 5. Create Family Planning Records (213)
        $this->command->info('Creating 213 family planning records...');
        $this->createFamilyPlanningRecords($jayMark->id, $jayMarkBarangays, $patients, 213);

        // 6. Create Maternal Care Records (126)
        $this->command->info('Creating 126 maternal care records...');
        $this->createMaternalCareRecords($jayMark->id, $jayMarkBarangays, $patients, 126);

        // 7. Create Senior Citizen Records (84)
        $this->command->info('Creating 84 senior citizen records...');
        $this->createSeniorCitizenRecords($jayMark->id, $jayMarkBarangays, $patients, 84);

        // 8. Create 13 appointments within 7 days
        $this->command->info('Creating 13 appointments for Jay Mark...');
        $this->createAppointments($jayMark->id, $jayMarkBarangays, 13);

        $this->command->info('✅ Test data generation completed successfully!');
    }

    private function createMidwives(array $allBarangays): void
    {
        $midwives = [
            ['first_name' => 'Maria', 'last_name' => 'Santos', 'email' => 'maria.santos@example.com'],
            ['first_name' => 'Ana', 'last_name' => 'Reyes', 'email' => 'ana.reyes@example.com'],
            ['first_name' => 'Rosa', 'last_name' => 'Cruz', 'email' => 'rosa.cruz@example.com'],
            ['first_name' => 'Elena', 'last_name' => 'Garcia', 'email' => 'elena.garcia@example.com'],
            ['first_name' => 'Carmen', 'last_name' => 'Mendoza', 'email' => 'carmen.mendoza@example.com'],
            ['first_name' => 'Luz', 'last_name' => 'Torres', 'email' => 'luz.torres@example.com'],
        ];

        foreach ($midwives as $midwife) {
            // Check if user already exists
            $existingUser = DB::table('users')->where('email', $midwife['email'])->first();
            if ($existingUser) {
                $this->command->info("  Skipping {$midwife['first_name']} {$midwife['last_name']} - already exists");
                continue;
            }

            $userId = DB::table('users')->insertGetId([
                'first_name' => $midwife['first_name'],
                'middle_name' => 'M.',
                'last_name' => $midwife['last_name'],
                'username' => strtolower($midwife['first_name'] . $midwife['last_name']) . rand(100, 999),
                'email' => $midwife['email'],
                'password' => Hash::make('password123'),
                'contact_number' => '09' . rand(100000000, 999999999),
                'role' => 'midwife',
                'status' => 'approved',
                'email_verified' => true,
                'approved_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Assign 1-3 random barangays
            $numBarangays = rand(1, 3);
            $assignedBarangays = array_rand(array_flip($allBarangays), $numBarangays);
            if (!is_array($assignedBarangays)) {
                $assignedBarangays = [$assignedBarangays];
            }

            foreach ($assignedBarangays as $barangayId) {
                DB::table('user_barangays')->insert([
                    'user_id' => $userId,
                    'barangay_id' => $barangayId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function createPendingMidwives(): void
    {
        $pendingMidwives = [
            ['first_name' => 'Sofia', 'last_name' => 'Ramos', 'email' => 'sofia.ramos@example.com'],
            ['first_name' => 'Isabel', 'last_name' => 'Flores', 'email' => 'isabel.flores@example.com'],
            ['first_name' => 'Teresa', 'last_name' => 'Gonzales', 'email' => 'teresa.gonzales@example.com'],
            ['first_name' => 'Patricia', 'last_name' => 'Villanueva', 'email' => 'patricia.villanueva@example.com'],
            ['first_name' => 'Angelica', 'last_name' => 'Bautista', 'email' => 'angelica.bautista@example.com'],
            ['first_name' => 'Cristina', 'last_name' => 'Aquino', 'email' => 'cristina.aquino@example.com'],
            ['first_name' => 'Marissa', 'last_name' => 'Diaz', 'email' => 'marissa.diaz@example.com'],
            ['first_name' => 'Gloria', 'last_name' => 'Pascual', 'email' => 'gloria.pascual@example.com'],
        ];

        foreach ($pendingMidwives as $midwife) {
            // Check if user already exists
            $existingUser = DB::table('users')->where('email', $midwife['email'])->first();
            if ($existingUser) {
                $this->command->info("  Skipping {$midwife['first_name']} {$midwife['last_name']} - already exists");
                continue;
            }

            DB::table('users')->insert([
                'first_name' => $midwife['first_name'],
                'middle_name' => 'P.',
                'last_name' => $midwife['last_name'],
                'username' => strtolower($midwife['first_name'] . $midwife['last_name']) . rand(100, 999),
                'email' => $midwife['email'],
                'password' => Hash::make('password123'),
                'contact_number' => '09' . rand(100000000, 999999999),
                'role' => 'midwife',
                'status' => 'pending',
                'email_verified' => true,
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now()->subDays(rand(1, 30)),
            ]);
        }
    }

    private function generatePatients(int $count): array
    {
        $firstNames = ['Juan', 'Maria', 'Jose', 'Ana', 'Pedro', 'Rosa', 'Carlos', 'Elena', 'Miguel', 'Sofia', 'Luis', 'Carmen', 'Antonio', 'Isabel', 'Francisco', 'Teresa', 'Manuel', 'Patricia', 'Ricardo', 'Angelica'];
        $lastNames = ['Santos', 'Reyes', 'Cruz', 'Garcia', 'Mendoza', 'Torres', 'Ramos', 'Flores', 'Gonzales', 'Villanueva', 'Bautista', 'Aquino', 'Diaz', 'Pascual', 'Rivera', 'Morales', 'Castro', 'Fernandez', 'Lopez', 'Martinez'];
        
        $patients = [];
        for ($i = 0; $i < $count; $i++) {
            $patients[] = [
                'first_name' => $firstNames[array_rand($firstNames)],
                'last_name' => $lastNames[array_rand($lastNames)],
                'contact' => '09' . rand(100000000, 999999999),
            ];
        }
        return $patients;
    }

    private function createImmunizationRecords(int $userId, array $barangays, array $patients, int $count): void
    {
        $vaccines = ['BCG', 'Hepatitis B', 'DPT', 'OPV', 'MMR', 'Measles'];
        
        for ($i = 0; $i < $count; $i++) {
            $patient = $patients[array_rand($patients)];
            $barangayId = $barangays[array_rand($barangays)];
            $date = $this->randomDateBetween('2026-03-01', '2026-05-31');
            $dob = Carbon::parse($date)->subYears(rand(0, 5))->format('Y-m-d');
            
            DB::table('immunization_records')->insert([
                'first_name' => $patient['first_name'],
                'last_name' => $patient['last_name'],
                'middle_name' => substr($patient['last_name'], 0, 1) . '.',
                'date_of_birth' => $dob,
                'sex' => rand(0, 1) ? 'Male' : 'Female',
                'address' => 'Sample Address',
                'contact_no' => $patient['contact'],
                'mother_name' => 'Sample Mother',
                'father_guardian_name' => 'Sample Father',
                'barangay_id' => $barangayId,
                'birth_weight' => rand(25, 40) / 10,
                'birth_length' => rand(45, 55),
                'current_weight' => rand(30, 100) / 10,
                'current_height' => rand(50, 120),
                'bcg' => $date,
                'hepa_b' => $date,
                'nutritional_status' => 'Normal',
                'status' => 'active',
                'created_by' => $userId,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }
    }

    private function createFamilyPlanningRecords(int $userId, array $barangays, array $patients, int $count): void
    {
        $methods = ['Pills', 'Injectable', 'IUD', 'Condom', 'Implant', 'Natural'];
        
        for ($i = 0; $i < $count; $i++) {
            $patient = $patients[array_rand($patients)];
            $barangayId = $barangays[array_rand($barangays)];
            $date = $this->randomDateBetween('2026-03-01', '2026-05-31');
            
            DB::table('family_planning_records')->insert([
                'first_name' => $patient['first_name'],
                'last_name' => $patient['last_name'],
                'middle_name' => substr($patient['last_name'], 0, 1) . '.',
                'sex' => 'Female',
                'age' => rand(18, 45),
                'address' => 'Sample Address',
                'contact_no' => $patient['contact'],
                'civil_status' => 'Married',
                'barangay_id' => $barangayId,
                'no_of_living_children' => rand(0, 5),
                'type_of_fp_method' => $methods[array_rand($methods)],
                'date_started' => $date,
                'date_of_visit' => $date,
                'date_of_followup' => Carbon::parse($date)->addMonths(1)->format('Y-m-d'),
                'status' => 'active',
                'created_by' => $userId,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }
    }

    private function createMaternalCareRecords(int $userId, array $barangays, array $patients, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            $patient = $patients[array_rand($patients)];
            $barangayId = $barangays[array_rand($barangays)];
            $date = $this->randomDateBetween('2026-03-01', '2026-05-31');
            $lmp = Carbon::parse($date)->subMonths(rand(1, 9))->format('Y-m-d');
            
            DB::table('maternal_care_records')->insert([
                'first_name' => $patient['first_name'],
                'last_name' => $patient['last_name'],
                'middle_name' => substr($patient['last_name'], 0, 1) . '.',
                'sex' => 'Female',
                'age' => rand(18, 40),
                'address' => 'Sample Address',
                'contact_no' => $patient['contact'],
                'civil_status' => 'Married',
                'barangay_id' => $barangayId,
                'lmp' => $lmp,
                'edd' => Carbon::parse($lmp)->addMonths(9)->format('Y-m-d'),
                'gravida' => rand(1, 5),
                'para' => rand(0, 4),
                'prenatal_visit_1' => $date,
                'blood_type' => ['A+', 'B+', 'O+', 'AB+'][array_rand(['A+', 'B+', 'O+', 'AB+'])],
                'status' => 'active',
                'created_by' => $userId,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }
    }

    private function createSeniorCitizenRecords(int $userId, array $barangays, array $patients, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            $patient = $patients[array_rand($patients)];
            $barangayId = $barangays[array_rand($barangays)];
            $date = $this->randomDateBetween('2026-03-01', '2026-05-31');
            
            DB::table('senior_citizen_records')->insert([
                'first_name' => $patient['first_name'],
                'last_name' => $patient['last_name'],
                'middle_name' => substr($patient['last_name'], 0, 1) . '.',
                'sex' => rand(0, 1) ? 'Male' : 'Female',
                'age' => rand(60, 90),
                'address' => 'Sample Address',
                'contact_no' => $patient['contact'],
                'civil_status' => ['Single', 'Married', 'Widowed'][array_rand(['Single', 'Married', 'Widowed'])],
                'barangay_id' => $barangayId,
                'blood_pressure' => rand(110, 140) . '/' . rand(70, 90),
                'weight' => rand(45, 80),
                'height' => rand(150, 180),
                'bmi' => rand(18, 30),
                'has_hypertension' => rand(0, 1) ? 'Yes' : 'No',
                'has_diabetes' => rand(0, 1) ? 'Yes' : 'No',
                'mobility_status' => 'Independent',
                'nutritional_status' => 'Normal',
                'status' => 'active',
                'created_by' => $userId,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }
    }

    private function createAppointments(int $userId, array $barangays, int $count): void
    {
        $types = ['Immunization', 'Family Planning', 'Prenatal Checkup', 'Senior Citizen Checkup', 'General Consultation'];
        $patients = $this->generatePatients(20);
        
        for ($i = 0; $i < $count; $i++) {
            $patient = $patients[array_rand($patients)];
            $barangayId = $barangays[array_rand($barangays)];
            $daysFromNow = rand(0, 6); // Within 7 days
            $appointmentDate = now()->addDays($daysFromNow)->format('Y-m-d');
            $appointmentTime = sprintf('%02d:%02d:00', rand(8, 16), rand(0, 59));
            
            DB::table('appointments')->insert([
                'patient_name' => $patient['first_name'] . ' ' . $patient['last_name'],
                'contact_number' => $patient['contact'],
                'email' => strtolower($patient['first_name'] . '.' . $patient['last_name']) . '@example.com',
                'appointment_type' => $types[array_rand($types)],
                'appointment_date' => $appointmentDate,
                'appointment_time' => $appointmentTime,
                'barangay_id' => $barangayId,
                'status' => 'scheduled',
                'notes' => 'Test appointment',
                'created_by' => $userId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function randomDateBetween(string $startDate, string $endDate): string
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);
        $randomDays = rand(0, $start->diffInDays($end));
        return $start->addDays($randomDays)->format('Y-m-d');
    }
}
