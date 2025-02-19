<?php

namespace Database\Seeders;

use App\Models\Day;
use Illuminate\Database\Seeder;

class DaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $days = [
            ['name' => 'Monday', 'code' => 'MON', 'number' => 1],
            ['name' => 'Tuesday', 'code' => 'TUE', 'number' => 2],
            ['name' => 'Wednesday', 'code' => 'WED', 'number' => 3],
            ['name' => 'Thursday', 'code' => 'THU', 'number' => 4],
            ['name' => 'Friday', 'code' => 'FRI', 'number' => 5],
            ['name' => 'Saturday', 'code' => 'SAT', 'number' => 6],
        ];

        foreach ($days as $dayData) {
            Day::create($dayData);
        }
    }
}
