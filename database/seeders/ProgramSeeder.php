<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\Institution;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            ['name' => 'BS BSCS', 'pcode' => 'BSCS', 'dcode' => 'BSCS'],
            ['name' => 'BS BBA', 'pcode' => 'BBA', 'dcode' => 'BBA'],
            ['name' => 'BS Botany', 'pcode' => 'BOT', 'dcode' => 'BOT'],
            ['name' => 'BS Chemistry', 'pcode' => 'CHEM', 'dcode' => 'CHEM'],
            ['name' => 'BS Economics', 'pcode' => 'ECON', 'dcode' => 'ECON'],
            ['name' => 'BS Education', 'pcode' => 'EDU', 'dcode' => 'EDU'],
            ['name' => 'BS English', 'pcode' => 'ENG', 'dcode' => 'ENG', 'isMorning' => true],
            ['name' => 'BS Islamic Studies', 'pcode' => 'ISL', 'dcode' => 'ISL'],
            ['name' => 'BS Mass Communication', 'pcode' => 'MC', 'dcode' => 'MC'],
            ['name' => 'BS Mathematics', 'pcode' => 'MATH', 'dcode' => 'MATH'],
            ['name' => 'BS Physics', 'pcode' => 'BS-PHY', 'dcode' => 'PHY'],
            ['name' => 'BS Political Science', 'pcode' => 'BS-POL', 'dcode' => 'POL'],
            ['name' => 'BS Sociology', 'pcode' => 'BS-SOC', 'dcode' => 'SOC'],
            ['name' => 'BS Statistics', 'pcode' => 'BS-STAT', 'dcode' => 'STAT'],
            ['name' => 'BS Urdu', 'pcode' => 'BS-URDU', 'dcode' => 'URDU'],
            ['name' => 'BS Zoology', 'pcode' => 'BS-ZOO', 'dcode' => 'ZOO'],

            ['name' => 'Msc Mathematics', 'pcode' => 'Msc-MATH', 'dcode' => 'MATH'],
            ['name' => 'Msc Physics', 'pcode' => 'Msc-PHY', 'dcode' => 'PHY'],
            ['name' => 'Msc Chemistry', 'pcode' => 'Msc-CHEM', 'dcode' => 'CHEM'],

            // BS Evening Shift = 3
            ['name' => 'BS BSCS', 'pcode' => 'BS-BSCS', 'dcode' => 'BSCS'],
            ['name' => 'BS BBA', 'pcode' => 'BS-BBA', 'dcode' => 'BBA'],

            // Inter Morning   = 1
            ['name' => 'Fsc Pre Med', 'pcode' => 'Inter-PreMed-I', 'dcode' => 'Inter-FIRST'],
            ['name' => 'Fsc Pre Eng', 'pcode' => 'Inter-PreEng-I', 'dcode' => 'Inter-FIRST'],
            ['name' => 'ICS Phy',     'pcode' => 'Inter-ICSPhy-I',  'dcode' => 'Inter-FIRST'],
            ['name' => 'Fsc Pre Med', 'pcode' => 'Inter-PreMed-I', 'dcode' => 'Inter-SECOND'],
            ['name' => 'Fsc Pre Eng', 'pcode' => 'Inter-PreEng-I', 'dcode' => 'Inter-SECOND'],
            ['name' => 'ICS Phy',     'pcode' => 'Inter-ICSPhy-I', 'dcode' => 'Inter-SECOND'],

            // Inter Evening = 4
            ['name' => 'Fsc Pre Med', 'pcode' => 'Inter-PreMed-I', 'dcode' => 'Inter-FIRST'],
            ['name' => 'Fsc Pre Eng', 'pcode' => 'Inter-PreEng-I', 'dcode' => 'Inter-FIRST'],
            ['name' => 'ICS Phy',     'pcode' => 'Inter-ICSPhy-I',  'dcode' => 'Inter-FIRST'],
            ['name' => 'Fsc Pre Med', 'pcode' => 'Inter-PreMed-II', 'dcode' => 'Inter-SECOND'],
            ['name' => 'Fsc Pre Eng', 'pcode' => 'Inter-PreEng-II', 'dcode' => 'Inter-SECOND'],
            ['name' => 'ICS Phy',     'pcode' => 'Inter-ICSPhy-II',  'dcode' => 'Inter-SECOND'],

            ['name' => 'Msc Mathematics', 'pcode' => 'Msc-MATH', 'dcode' => 'MATH',   'type' => 'ADP'],
            ['name' => 'Msc Physics', 'pcode' => 'Msc-PHY', 'dcode' => 'PHY',   'type' => 'ADP'],
            ['name' => 'Msc Chemistry', 'pcode' => 'Msc-CHEM', 'dcode' => 'CHEM',   'type' => 'ADP'],
        ];

        // First For Institute 1
        $this->createPrograms($programs, 1);

        // Second For Institute 2
        $this->createPrograms($programs, 2);
    }

    protected function createPrograms($programs, $institution_id)
    {
        $institution = Institution::with(['departments'])->find($institution_id);

        foreach ($programs as $programData) {
            $pcode      = $programData['pcode'];
            $pname      = $programData['name'];
            $pType      = $programData['type'] ?? 'BS';
            $department = $institution->departments->where('institution_id', $institution_id)->whereIn('code', [$programData['dcode']])->first();

            if (str_contains($pcode, 'Inter')) {
                $pType = 'INTER';
            }

            // Create a program of type 'BS'
            Program::create([
                'name'          => $pname,
                'code'          => $pcode,
                'department_id' => $department->id,
                'type'          => $pType,
            ]);
        }
    }
}
