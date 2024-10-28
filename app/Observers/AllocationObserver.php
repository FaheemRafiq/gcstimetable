<?php

namespace App\Observers;

use App\Models\Allocation;
use App\Exceptions\AllocationException;
use Illuminate\Validation\ValidationException;

class AllocationObserver
{
    /**
     * Handle the Allocation "creating" event.
     */
    public function creating(Allocation $allocation)
    {
        $this->validateAllocation($allocation, 'store');
    }

    /**
     * Handle the Allocation "updating" event.
     */
    public function updating(Allocation $allocation)
    {
        $this->validateAllocation($allocation, 'update');
    }

    public function validateAllocation(Allocation $allocation, string $action)
    {
        /**
         * Required in Request Validation
         * 1. Time Table
         * 2. Slot
         * 3. Section
         * 4. Day
         */

        $excludeId = $action === 'update' ? $allocation->id : null;
        $allocation->load('slot');
        $currentSlot = $allocation->slot;

        if ($allocation->hasRoom() && (!$allocation->hasTeacher() || !$allocation->hasCourse())) {
            throw new AllocationException('Room allocation must have a 🧑‍🏫 teacher and a 📘 course.');
        }

        if ($allocation->hasTeacher() && !$allocation->hasCourse()) {
            throw new AllocationException('Teacher allocation must have a 📘 course.');
        }

        if ($allocation->hasCourse() && !$allocation->hasSection()) {
            throw new AllocationException('Course allocation must have a section.');
        }

        // 1. Prevent Double Booking for Rooms
        if ($allocation->hasRoom()) {

            $roomConflict = Allocation::where('room_id', $allocation->room_id)
                ->conflictForDayAndTime($allocation->day_id, $allocation->time_table_id, $currentSlot->start_time, $currentSlot->end_time)
                ->excludeById($excludeId)
                ->exists();

            if ($roomConflict) {
                throw ValidationException::withMessages(['room_id' => 'Room is not available for this time slot and day.']);
            }
        }

        // 2. Restrict Teacher’s Availability Across Shifts
        if ($allocation->hasTeacher()) {

            $teacherConflict = Allocation::where('teacher_id', $allocation->teacher_id)
                ->conflictForDayAndTime($allocation->day_id, $allocation->time_table_id, $currentSlot->start_time, $currentSlot->end_time)
                ->excludeById($excludeId)
                ->exists();

            if ($teacherConflict) {
                throw ValidationException::withMessages(['teacher_id' => 'Teacher has another class scheduled in this time slot.']);
            }
        }

        // 3. Limit Courses Per Section Per Slot
        if ($allocation->hasCourse() && $allocation->hasSection()) {

            $sectionConflict = Allocation::whereSection($allocation->section_id)
                ->conflictForDayAndTime($allocation->day_id, $allocation->time_table_id, $currentSlot->start_time, $currentSlot->end_time)
                ->excludeById($excludeId)
                ->exists();

            if ($sectionConflict) {
                throw new AllocationException('This section already has a course allocated at this time slot.');
            }
        }

        // 4. Section Conflict Across Timetables
        if ($allocation->hasSection()) {
            
            $sectionTimeTableConflict = Allocation::whereSection($allocation->section_id)
                ->where('time_table_id', '!=', $allocation->time_table_id)
                ->excludeById($excludeId)
                ->exists();

            if ($sectionTimeTableConflict) {
                throw new AllocationException('Section cannot be allocated to multiple timetables for the same day and slot.');
            }
        }

        // Existing duplicate check
        if ($allocation->shouldCheckDuplicate()) {
            $duplicate = $allocation->duplicate()
                ->excludeById($excludeId)
                ->exists();
            if ($duplicate) {
                throw new AllocationException('Allocation already exists with the same teacher, room, day, and course.');
            }
        }
    }
}
