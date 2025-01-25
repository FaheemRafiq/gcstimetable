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
        $firstTimeTable = TimeTable::with([
            'shift.institution.teachers' => function ($query) {
                $query->first();
            },
            'shift.institution.rooms' => function ($query) {
                $query->first();
            },
            'shift.institution.days',
            'shift.semesters' => function ($query) {
                $query->with('sections', 'courses')->first();
            },
            'shift.slots',
        ])->first();

        // Fetch required entities
        $teacherId   = $firstTimeTable->shift->institution->teachers->first()->id;
        $courseId    = $firstTimeTable->shift->semesters->first()->courses->first()->id;
        $roomId      = $firstTimeTable->shift->institution->rooms->first()->id;
        $sectionId   = $firstTimeTable->shift->semesters->first()->sections->first()->id;
        $timeTableId = $firstTimeTable->id;

        $allocations = [];

        foreach ($firstTimeTable->shift->institution->days as $day) {
            foreach ($firstTimeTable->shift->slots as $slot) {
                $allocations[] = [
                    'time_table_id' => $timeTableId,
                    'section_id'    => $sectionId,
                    'teacher_id'    => $teacherId,
                    'course_id'     => $courseId,
                    'room_id'       => $roomId,
                    'day_id'        => $day->id,
                    'slot_id'       => $slot->id,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ];
            }
        }

        $secondTimeTable = TimeTable::with([
            'shift.institution.teachers' => function ($query) {
                $query->first();
            },
            'shift.institution.rooms' => function ($query) {
                $query->first();
            },
            'shift.institution.days',
            'shift.semesters' => function ($query) {
                $query->with('sections', 'courses')->first();
            },
            'shift.slots',
        ])->skip(1)->first();

        // Fetch required entities
        $teacherId   = $secondTimeTable->shift->institution->teachers->first()->id;
        $courseId    = $secondTimeTable->shift->semesters->first()->courses->first()->id;
        $roomId      = $secondTimeTable->shift->institution->rooms->first()->id;
        $sectionId   = $secondTimeTable->shift->semesters->first()->sections->first()->id;
        $timeTableId = $secondTimeTable->id;

        foreach ($secondTimeTable->shift->institution->days as $day) {
            foreach ($secondTimeTable->shift->slots as $slot) {
                $allocations[] = [
                    'time_table_id' => $timeTableId,
                    'section_id'    => $sectionId,
                    'teacher_id'    => $teacherId,
                    'course_id'     => $courseId,
                    'room_id'       => $roomId,
                    'day_id'        => $day->id,
                    'slot_id'       => $slot->id,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ];
            }
        }

        Allocation::insert($allocations);
    }
}
