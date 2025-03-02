<?php

namespace Database\Seeders;

use App\Models\Institution;
use Illuminate\Database\Seeder;

class TimeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $years = date('Y').'-'.now()->addYear()->format('Y');

        $timeTables = [
            [
                'title'       => '1st Year Morning Shift College Time Table '.$years,
                'description' => 'This time table is only for the Intermediate Programs.',
            ],
            [
                'title'       => 'BS College Time Table '.$years,
                'description' => 'This time table is only for BS Programs.',
            ],
            [
                'title'       => 'ADP College Time Table '.$years,
                'description' => 'This time table is only for ADP Programs.',
            ],
        ];

        $institutions = Institution::with('shifts')->get();

        foreach ($institutions as $institution) {
            foreach ($institution->shifts as $shift) {
                $datesData = [
                    'start_date'  => now()->subMonth()->format('Y-m-d'),
                    'end_date'    => now()->addMonths(5)->format('Y-m-d'),
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ];

                if (str_contains($shift->program_type, 'INTER')) {
                    $shift->timetables()->create(array_merge($timeTables[0], $datesData));
                }

                if (str_contains($shift->program_type, 'BS')) {
                    $shift->timetables()->create(array_merge($timeTables[1], $datesData));
                }

                if (str_contains($shift->program_type, 'ADP')) {
                    $shift->timetables()->create(array_merge($timeTables[2], $datesData));
                }
            }
        }
    }
}
