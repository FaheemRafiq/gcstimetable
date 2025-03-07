<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Student::factory()->count(10)->create();
    }
}
