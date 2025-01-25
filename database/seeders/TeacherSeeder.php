<?php

namespace Database\Seeders;

use App\Models\Teacher;
use App\Models\Department;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Teacher::factory()->count(10)->create();
        // create Teacher with name ' Abdul Wahab , Zeeshan , Sadaf ,  Ahsan Ghafoor
        $faker    = Faker::create();
        $teachers = [
            [
                'name'             => 'Abdul Wahab',
                'personnel_number' => $faker->unique()->randomNumber(8),
                'department_id'    => Department::where('code', 'BSCS')->first()->id,
            ],
            [
                'name'             => 'Zeeshan',
                'personnel_number' => $faker->unique()->randomNumber(8),
                'department_id'    => Department::where('code', 'BSCS')->first()->id,
            ],
            [
                'name'             => 'Sadaf',
                'personnel_number' => $faker->unique()->randomNumber(8),
                'department_id'    => Department::where('code', 'BSCS')->first()->id,
            ],
            [
                'name'             => 'Ahsan Ghafoor',
                'personnel_number' => $faker->unique()->randomNumber(8),
                'department_id'    => Department::where('code', 'BSCS')->first()->id,
            ],

        ];

        foreach ($teachers as $key => $teacher) {
            Teacher::create($teacher);
        }
    }
}
