<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\Department;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // BS Morning Shift = 2
        $programs = [
            ['name' => 'BS BSCS', 'pcode' => 'BSCS', 'dcode' => 'BSCS',    'shift_id' => 2],
            ['name' => 'BS BBA', 'pcode' => 'BBA', 'dcode' => 'BBA',      'shift_id' => 2],
            ['name' => 'BS Botany', 'pcode' => 'BOT', 'dcode' => 'BOT',   'shift_id' => 2],
            ['name' => 'BS Chemistry', 'pcode' => 'CHEM', 'dcode' => 'CHEM',          'shift_id' => 2],
            ['name' => 'BS Economics', 'pcode' => 'ECON', 'dcode' => 'ECON',          'shift_id' => 2],
            ['name' => 'BS Education', 'pcode' => 'EDU', 'dcode' => 'EDU',           'shift_id' => 2],
            ['name' => 'BS English', 'pcode' => 'ENG', 'dcode' => 'ENG', 'isMorning' => true,             'shift_id' => 2],
            ['name' => 'BS Islamic Studies', 'pcode' => 'ISL', 'dcode' => 'ISL',              'shift_id' => 2],
            ['name' => 'BS Mass Communication', 'pcode' => 'MC', 'dcode' => 'MC',              'shift_id' => 2],
            ['name' => 'BS Mathematics', 'pcode' => 'MATH', 'dcode' => 'MATH',              'shift_id' => 2],
            ['name' => 'BS Physics', 'pcode' => 'BS-PHY', 'dcode' => 'PHY',              'shift_id' => 2],
            ['name' => 'BS Political Science', 'pcode' => 'BS-POL', 'dcode' => 'POL',              'shift_id' => 2],
            ['name' => 'BS Sociology', 'pcode' => 'BS-SOC', 'dcode' => 'SOC',              'shift_id' => 2],
            ['name' => 'BS Statistics', 'pcode' => 'BS-STAT', 'dcode' => 'STAT',              'shift_id' => 2],
            ['name' => 'BS Urdu', 'pcode' => 'BS-URDU', 'dcode' => 'URDU',              'shift_id' => 2],
            ['name' => 'BS Zoology', 'pcode' => 'BS-ZOO', 'dcode' => 'ZOO',              'shift_id' => 2],

            ['name' => 'Msc Mathematics', 'pcode' => 'Msc-MATH', 'dcode' => 'MATH',              'shift_id' => 2],
            ['name' => 'Msc Physics', 'pcode' => 'Msc-PHY', 'dcode' => 'PHY', 'shift_id' => 2],
            ['name' => 'Msc Chemistry', 'pcode' => 'Msc-CHEM', 'dcode' => 'Chem', 'shift_id' => 2],

            // BS Evening Shift = 3
            ['name' => 'BS BSCS', 'pcode' => 'BS-BSCS', 'dcode' => 'BSCS', 'shift_id' => 3],
            ['name' => 'BS BBA', 'pcode' => 'BS-BBA', 'dcode' => 'BBA',   'shift_id' => 3],

            // Inter Morning   = 1
            ['name' => 'Fsc Pre Med', 'pcode' => 'Inter-PreMed-I', 'dcode' => 'Inter-FIRST', 'shift_id' => 1],
            ['name' => 'Fsc Pre Eng', 'pcode' => 'Inter-PreEng-I', 'dcode' => 'Inter-FIRST', 'shift_id' => 1],
            ['name' => 'ICS Phy',     'pcode' => 'Inter-ICSPhy-I',  'dcode' => 'Inter-FIRST', 'shift_id' => 1],
            ['name' => 'Fsc Pre Med', 'pcode' => 'Inter-PreMed-I', 'dcode' => 'Inter-SECOND', 'shift_id' => 1],
            ['name' => 'Fsc Pre Eng', 'pcode' => 'Inter-PreEng-I', 'dcode' => 'Inter-SECOND', 'shift_id' => 1],
            ['name' => 'ICS Phy',     'pcode' => 'Inter-ICSPhy-I', 'dcode' => 'Inter-SECOND', 'shift_id' => 1],

            // Inter Evening = 4
            ['name' => 'Fsc Pre Med', 'pcode' => 'Inter-PreMed-I', 'dcode' => 'Inter-FIRST', 'shift_id' => 4],
            ['name' => 'Fsc Pre Eng', 'pcode' => 'Inter-PreEng-I', 'dcode' => 'Inter-FIRST', 'shift_id' => 4],
            ['name' => 'ICS Phy',     'pcode' => 'Inter-ICSPhy-I',  'dcode' => 'Inter-FIRST', 'shift_id' => 4],
            ['name' => 'Fsc Pre Med', 'pcode' => 'Inter-PreMed-II', 'dcode' => 'Inter-SECOND', 'shift_id' => 4],
            ['name' => 'Fsc Pre Eng', 'pcode' => 'Inter-PreEng-II', 'dcode' => 'Inter-SECOND', 'shift_id' => 4],
            ['name' => 'ICS Phy',     'pcode' => 'Inter-ICSPhy-II',  'dcode' => 'Inter-SECOND', 'shift_id' => 4],

            ['name' => 'Msc Mathematics', 'pcode' => 'Msc-MATH', 'dcode' => 'MATH',   'type' => 'ADP', 'shift_id' => 2],
            ['name' => 'Msc Physics', 'pcode' => 'Msc-PHY', 'dcode' => 'PHY',   'type' => 'ADP', 'shift_id' => 2],
            ['name' => 'Msc Chemistry', 'pcode' => 'Msc-CHEM', 'dcode' => 'Chem',   'type' => 'ADP', 'shift_id' => 2],
        ];

        // Create records for programs using the array

        // First For Institute 1
        $this->createPrograms($programs, 1);

        // Second For Institute 2
        $this->createPrograms($programs, 2);
    }

    protected function createPrograms($programs, $institution_id)
    {
        foreach ($programs as $programData) {
            $pcode = $programData['pcode'];
            $pname = $programData['name'];
            $pType = $programData['type'] ?? 'BS';

            if (str_contains($pcode, 'Inter')) {
                $pType = 'INTER';
            }

            // Create a program of type 'BS'
            Program::create([
                'name'          => $pname,
                'code'          => $pcode,
                'department_id' => Department::where(['code' => $programData['dcode'], 'institution_id' => $institution_id])->first()->id,
                'type'          => $pType,
                'shift_id'      => $programData['shift_id'],
            ]);
        }
    }
}
