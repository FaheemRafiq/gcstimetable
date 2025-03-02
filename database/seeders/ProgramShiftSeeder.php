<?php

namespace Database\Seeders;

use App\Models\Shift;
use Illuminate\Database\Seeder;

class ProgramShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shifts = Shift::with('institution.programs')->get();

        foreach ($shifts as $shift) {
            $programs = $shift->institution->programs->where('type', $shift->program_type)->all();

            if (count($programs) > 0) {
                $shift->programs()->attach($programs);
            }
        }
    }
}
