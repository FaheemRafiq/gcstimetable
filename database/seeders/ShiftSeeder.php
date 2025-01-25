<?php

namespace Database\Seeders;

use App\Models\Shift;
use Illuminate\Database\Seeder;

class ShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shifts = [
            [
                'id'   => 1,
                'name' => 'Morning Inter',
                // 'comments' => 'Morning Inter',
                'institution_id' => 1,
                'type'           => 'Morning',
                'program_type'   => 'INTER',
            ],
            [
                'id'   => 2,
                'name' => 'Morning BS',
                // 'comments' => 'Morning BS',
                'institution_id' => 1,
                'type'           => 'Morning',
                'program_type'   => 'BS',
            ],
            [
                'id'   => 4,
                'name' => 'Evening Inter',
                // 'comments' => 'Evening Inter',
                'institution_id' => 1,
                'type'           => 'Evening',
                'program_type'   => 'INTER',
            ],
            [
                'id'   => 3,
                'name' => 'Evening BS',
                // 'comments' => 'Evening BS',
                'institution_id' => 1,
                'type'           => 'Evening',
                'program_type'   => 'BS',
            ],
            [
                'id'   => 5,
                'name' => 'Morning ADP',
                // 'comments' => 'Morning ADP',
                'institution_id' => 1,
                'type'           => 'Morning',
                'program_type'   => 'ADP',
            ],

        ];

        foreach ($shifts as $shift) {
            Shift::create($shift);
        }
    }
}
