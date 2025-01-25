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
        // Define an array of day data
        $days = [
            ['name' => 'Monday', 'code' => 'MON', 'number' => 1],
            ['name' => 'Tuesday', 'code' => 'TUE', 'number' => 2],
            ['name' => 'Wednesday', 'code' => 'WED', 'number' => 3],
            ['name' => 'Thursday', 'code' => 'THU', 'number' => 4],
            ['name' => 'Friday', 'code' => 'FRI', 'number' => 5],
            ['name' => 'Saturday', 'code' => 'SAT', 'number' => 6],
        ];

        $insitution_id = 1;

        // Create records for days using the array
        foreach ($days as $dayData) {
            $dayData['institution_id'] = $insitution_id;
            Day::create($dayData);
        }

        $insitution_id = 2;

        // Create records for days using the array
        foreach ($days as $dayData) {
            $dayData['institution_id'] = $insitution_id;
            Day::create($dayData);
        }
    }
}
