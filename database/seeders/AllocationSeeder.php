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
            'shift.institution.activeDays',
            'shift.programs.semesters' => function ($query) {
                $query->with('sections', 'courses');
            },
            'shift.slots',
        ])->get();

        $allocations = [];

        foreach ($timeTables as $timeTable) {
            $teachers  = $timeTable->shift->institution->teachers;
            $rooms     = $timeTable->shift->institution->rooms;
            $days      = $timeTable->shift->institution->activeDays;
            $semesters = $timeTable->shift->programs->pluck('semesters')->flatten();
            $slots     = $timeTable->shift->slots;

            foreach ($days as $day) {
                foreach ($slots as $slot) {
                    // Randomize teacher, course, and room for each allocation
                    $randomSemester = count($semesters)                                   > 0 ? $semesters->random() : null;
                    $teacher        = count($teachers)                                    > 0 ? $teachers->random() : null;
                    $room           = count($rooms)                                       > 0 ? $rooms->random() : null;
                    $course         = $randomSemester && count($randomSemester->courses)  > 0 ? $randomSemester->courses->random() : null;
                    $section        = $randomSemester && count($randomSemester->sections) > 0 ? $randomSemester->sections->random() : null;

                    $allocations[] = [
                        'time_table_id' => $timeTable->id,
                        'section_id'    => $section?->id,
                        'teacher_id'    => $teacher?->id,
                        'course_id'     => $course?->id,
                        'room_id'       => $room?->id,
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
