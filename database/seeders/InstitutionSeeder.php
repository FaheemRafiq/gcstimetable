<?php

namespace Database\Seeders;

use App\Models\Institution;
use Illuminate\Database\Seeder;

class InstitutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define an array of institution data
        $institutions = [
            ['id' => 1, 'name' => 'Govt. Graduate College of Science', 'address' => 'P.O. Box 30197, Nairobi', 'phone' => '020-4910000', 'email' => 'admin@uol.com'],
            ['id' => 2, 'name' => 'Govt. Islamic College', 'address' => 'P.O. Box 43844, Nairobi', 'phone' => '020-4910000', 'email' => 'kenya@africa.com'],
        ];

        // Create records for institutions using the array
        foreach ($institutions as $institutionData) {
            Institution::create($institutionData);
        }
    }
}
