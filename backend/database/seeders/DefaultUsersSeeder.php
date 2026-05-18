<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DefaultUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['username' => 'admin'],
            [
                'first_name' => 'Admin',
                'last_name' => 'User',
                'email' => 'admin@medimoms.com',
                'password' => Hash::make('admin123'),
                'contact_number' => '09123456789',
                'role' => 'admin',
                'status' => 'approved',
                'email_verified' => true,
            ]
        );

        // Create midwife user
        $midwife = User::firstOrCreate(
            ['username' => 'midwife1'],
            [
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'email' => 'midwife1@medimoms.com',
                'password' => Hash::make('midwife123'),
                'contact_number' => '09987654321',
                'role' => 'midwife',
                'status' => 'approved',
                'email_verified' => true,
            ]
        );

        // Assign first barangay to midwife if exists
        if ($midwife && \DB::table('barangays')->count() > 0) {
            $barangayId = \DB::table('barangays')->first()->id;
            $midwife->barangays()->syncWithoutDetaching([$barangayId]);
        }

        $this->command->info('Default users created successfully!');
        $this->command->info('Admin - username: admin, password: admin123');
        $this->command->info('Midwife - username: midwife1, password: midwife123');
    }
}
