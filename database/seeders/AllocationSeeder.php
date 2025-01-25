<?php

namespace Database\Seeders;

use App\Models\TimeTable;
use App\Models\Allocation;
use Illuminate\Database\Seeder;

class AllocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timeTables = TimeTable::with([
            'shift.institution.teachers',
            'shift.institution.rooms',
            'shift.institution.days',
            'shift.semesters' => function ($query) {
                $query->with('sections', 'courses');
            },
            'shift.slots',
        ])->get();

        $allocations = [];

        foreach ($timeTables as $timeTable) {
            $teachers  = $timeTable->shift->institution->teachers;
            $rooms     = $timeTable->shift->institution->rooms;
            $days      = $timeTable->shift->institution->days;
            $semesters = $timeTable->shift->semesters;
            $slots     = $timeTable->shift->slots;

            foreach ($days as $day) {
                foreach ($slots as $slot) {
                    // Randomize teacher, course, and room for each allocation
                    $randomSemester = $semesters->random();
                    $teacher        = $teachers->random();
                    $room           = $rooms->random();
                    $course         = $randomSemester->courses->random();
                    $section        = $randomSemester->sections->random();

                    $allocations[] = [
                        'time_table_id' => $timeTable->id,
                        'section_id'    => $section->id,
                        'teacher_id'    => $teacher->id,
                        'course_id'     => $course->id,
                        'room_id'       => $room->id,
                        'day_id'        => $day->id,
                        'slot_id'       => $slot->id,
                        'created_at'    => now(),
                        'updated_at'    => now(),
                    ];
                }
            }
        }

        Allocation::insert($allocations);
    }
}
