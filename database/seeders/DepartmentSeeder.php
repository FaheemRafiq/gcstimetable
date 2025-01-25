<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define an array of department names and codes
        $departments = [
            ['name' => 'Intermediate First Year', 'code' => 'Inter-FIRST'],
            ['name' => 'Intermediate Second Year', 'code' => 'Inter-SECOND'],

            ['name' => 'BBA', 'code' => 'BBA'],
            ['name' => 'Botany', 'code' => 'BOT'],
            ['name' => 'Chemistry', 'code' => 'CHEM'],
            ['name' => 'Economics', 'code' => 'ECON'],
            ['name' => 'Education', 'code' => 'EDU'],
            ['name' => 'English', 'code' => 'ENG'],
            ['name' => 'Computer Science', 'code' => 'BSCS'],
            ['name' => 'Islamic Studies', 'code' => 'ISL'],
            ['name' => 'Mass Communication', 'code' => 'MC'],
            ['name' => 'Mathematics', 'code' => 'MATH'],
            ['name' => 'Physics', 'code' => 'PHY'],
            ['name' => 'Political Science', 'code' => 'POL'],
            ['name' => 'Sociology', 'code' => 'SOC'],
            ['name' => 'Statistics', 'code' => 'STAT'],
            ['name' => 'Urdu', 'code' => 'URDU'],
            ['name' => 'Zoology', 'code' => 'ZOO'],
        ];
        $institution_id = 1;

        // Create records for departments using the array
        foreach ($departments as $departmentData) {
            Department::create([
                'name'           => $departmentData['name'],
                'code'           => $departmentData['code'],
                'institution_id' => $institution_id,
            ]);
        }

        $institution_id = 2;

        // Create records for departments using the array
        foreach ($departments as $departmentData) {
            Department::create([
                'name'           => $departmentData['name'],
                'code'           => $departmentData['code'],
                'institution_id' => $institution_id,
            ]);
        }
    }
}
