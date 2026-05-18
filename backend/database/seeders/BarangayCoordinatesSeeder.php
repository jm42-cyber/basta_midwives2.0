<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BarangayCoordinatesSeeder extends Seeder
{
    public function run(): void
    {
        // Exact coordinates for Santa Cruz, Laguna barangays
        $barangays = [
            ['name' => 'Alipit', 'latitude' => 14.2685, 'longitude' => 121.4065],
            ['name' => 'Bagumbayan', 'latitude' => 14.2798, 'longitude' => 121.4142],
            ['name' => 'Bubukal', 'latitude' => 14.2512, 'longitude' => 121.4251],
            ['name' => 'Calios', 'latitude' => 14.2468, 'longitude' => 121.4389],
            ['name' => 'Duhat', 'latitude' => 14.2649, 'longitude' => 121.4210],
            ['name' => 'Gatid', 'latitude' => 14.2873, 'longitude' => 121.4295],
            ['name' => 'Jasaan', 'latitude' => 14.2597, 'longitude' => 121.4357],
            ['name' => 'Labuin', 'latitude' => 14.2415, 'longitude' => 121.4462],
            ['name' => 'Malinao', 'latitude' => 14.2734, 'longitude' => 121.4029],
            ['name' => 'Oogong', 'latitude' => 14.2826, 'longitude' => 121.4208],
            ['name' => 'Pagsawitan', 'latitude' => 14.2921, 'longitude' => 121.4086],
            ['name' => 'Palasan', 'latitude' => 14.2559, 'longitude' => 121.4173],
            ['name' => 'Patimbao', 'latitude' => 14.2680, 'longitude' => 121.4334],
            ['name' => 'San Jose', 'latitude' => 14.2775, 'longitude' => 121.4182],
            ['name' => 'San Juan', 'latitude' => 14.2702, 'longitude' => 121.4097],
            ['name' => 'San Pablo Norte', 'latitude' => 14.2837, 'longitude' => 121.4231],
            ['name' => 'San Pablo Sur', 'latitude' => 14.2761, 'longitude' => 121.4265],
            ['name' => 'Santisima Cruz', 'latitude' => 14.2750, 'longitude' => 121.4179],
            ['name' => 'Santo Angel Central', 'latitude' => 14.2698, 'longitude' => 121.4302],
            ['name' => 'Santo Angel Norte', 'latitude' => 14.2746, 'longitude' => 121.4348],
            ['name' => 'Santo Angel Sur', 'latitude' => 14.2653, 'longitude' => 121.4359],
            ['name' => 'Poblacion I', 'latitude' => 14.2769, 'longitude' => 121.4179],
            ['name' => 'Poblacion II', 'latitude' => 14.2782, 'longitude' => 121.4193],
            ['name' => 'Poblacion III', 'latitude' => 14.2795, 'longitude' => 121.4205],
            ['name' => 'Poblacion IV', 'latitude' => 14.2758, 'longitude' => 121.4162],
            ['name' => 'Poblacion V', 'latitude' => 14.2743, 'longitude' => 121.4150],
        ];

        foreach ($barangays as $barangay) {
            $updated = DB::table('barangays')
                ->where('name', 'LIKE', '%' . $barangay['name'] . '%')
                ->update([
                    'latitude' => $barangay['latitude'],
                    'longitude' => $barangay['longitude'],
                    'updated_at' => now(),
                ]);
            
            if ($updated) {
                $this->command->info("✅ Updated: {$barangay['name']}");
            } else {
                $this->command->warn("⚠️  Not found: {$barangay['name']}");
            }
        }
        
        $this->command->info("\n✅ Coordinate update complete for Santa Cruz, Laguna barangays!");
    }
}
