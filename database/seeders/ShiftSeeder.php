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
                'name'           => 'Morning Inter',
                'type'           => 'Morning',
                'program_type'   => 'INTER',
            ],
            [
                'name'           => 'Morning BS',
                'type'           => 'Morning',
                'program_type'   => 'BS',
            ],
            [
                'name'           => 'Evening Inter',
                'type'           => 'Evening',
                'program_type'   => 'INTER',
            ],
            [
                'name'           => 'Evening BS',
                'type'           => 'Evening',
                'program_type'   => 'BS',
            ],
            [
                'name'           => 'Morning ADP',
                'type'           => 'Morning',
                'program_type'   => 'ADP',
            ],

        ];

        $this->createShifts($shifts, 1);

        $this->createShifts($shifts, 2);
    }

    protected function createShifts($shifts, $intitution_id)
    {
        foreach ($shifts as $shift) {
            Shift::create([...$shift, 'institution_id' => $intitution_id]);
        }
    }
}
