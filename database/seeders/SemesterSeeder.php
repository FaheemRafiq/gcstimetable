<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\Semester;
use Illuminate\Database\Seeder;

class SemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all BS programs
        $bsPrograms = Program::where('code', 'like', 'BS-%')->get();
        // Fetch all Inter programs
        $interPrograms = Program::where('code', 'like', 'Inter-%')->get();

        // Iterate through each BS program
        foreach ($bsPrograms as $program) {
            for ($i = 1; $i <= 8; $i++) {
                $semesterName = $i.($i % 10 == 1 && $i != 11 ? 'st' : ($i % 10 == 2 && $i != 12 ? 'nd' : ($i % 10 == 3 && $i != 13 ? 'rd' : 'th'))).' Semester';

                Semester::create([
                    'name'       => $program->code.'-'.$semesterName,
                    'number'     => $i,
                    'program_id' => $program->id,
                ]);
            }
        }

        // Iterate through each Inter program
        foreach ($interPrograms as $program) {
            for ($i = 1; $i <= 1; $i++) {
                Semester::create([
                    'name'       => $program->code.'-'.'Year',
                    'number'     => $i,
                    'program_id' => $program->id,
                ]);
            }
        }
    }
}
