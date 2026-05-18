<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Barangay;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'first_name' => 'Admin',
            'middle_name' => null,
            'last_name' => 'User',
            'username' => 'admin',
            'email' => 'admin@medimoms.com',
            'password' => Hash::make('admin123'),
            'contact_number' => '09111111111',
            'role' => 'admin',
            'status' => 'approved',
            'email_verified' => true,
        ]);

        $barangays = [
            'Alipit', 'Bagumbayan', 'Bubukal', 'Calios', 'Duhat',
            'Gatid', 'Jasaan', 'Labuin', 'Malinao', 'Oogong',
            'Pagsawitan', 'Palasan', 'Patimbao', 'San Jose',
            'San Juan', 'San Pablo Norte', 'San Pablo Sur', 'Santisima Cruz',
            'Santo Angel Central', 'Santo Angel Norte', 'Santo Angel Sur',
            'Poblacion I', 'Poblacion II', 'Poblacion III', 'Poblacion IV', 'Poblacion V'
        ];

        foreach ($barangays as $name) {
            Barangay::create([
                'name' => $name,
                'address' => "Santa Cruz, Laguna",
                'contact_number' => '0491234567',
                'population' => rand(1000, 5000),
            ]);
        }

        $midwife = User::create([
            'first_name' => 'Maria',
            'middle_name' => 'Santos',
            'last_name' => 'Cruz',
            'username' => 'midwife1',
            'email' => 'midwife1@medimoms.com',
            'password' => Hash::make('midwife123'),
            'contact_number' => '09222222222',
            'role' => 'midwife',
            'status' => 'approved',
            'email_verified' => true,
            'approved_by' => $admin->id,
            'approved_at' => now(),
        ]);

        $midwife->barangays()->attach([1, 2, 3]);

        // Add Dr. JM - Santo Angel Norte (20), Central (19), Sur (21)
        $drJM = User::create([
            'first_name' => 'Jay Mark',
            'middle_name' => 'Bohol',
            'last_name' => 'Del Valle',
            'username' => 'drjm',
            'email' => 'legenddelvalle42@gmail.com',
            'password' => Hash::make('Delvalle2005'),
            'contact_number' => '09123456789',
            'role' => 'midwife',
            'status' => 'approved',
            'email_verified' => true,
            'approved_by' => $admin->id,
            'approved_at' => now(),
        ]);

        $drJM->barangays()->attach([19, 20, 21]); // Santo Angel Central, Norte, Sur
    }
}
