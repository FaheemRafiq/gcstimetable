<?php

namespace App\Observers;

use App\Exceptions\AllocationException;
use App\Models\Allocation;
use Illuminate\Validation\ValidationException;

class AllocationObserver
{
    /**
     * Handle the Allocation "creating" event.
     */
    public function creating(Allocation $allocation)
    {
        $this->validateAllocation($allocation);
    }

    /**
     * Handle the Allocation "updating" event.
     */
    public function updating(Allocation $allocation)
    {
        $this->validateAllocation($allocation);
    }

    public function validateAllocation(Allocation $allocation)
    {
        
        if (!$allocation->hasDay() || !$allocation->hasSlot()) {
            throw new AllocationException('Allocation must have a day and a slot.');
        }

        if ($allocation->hasRoom() && (!$allocation->hasTeacher() || !$allocation->hasCourse())) {
            throw new AllocationException('Room allocation must have a teacher and a course.');
        }

        if ($allocation->hasTeacher() && !$allocation->hasCourse()) {
            throw new AllocationException('Teacher allocation must have a course.');
        }

        if ($allocation->hasCourse() && !$allocation->hasSection()) {
            throw new AllocationException('Course allocation must have a section.');
        }

        if ($allocation->shouldCheckDuplicate()) {

            if ($allocation->duplicate()->exists()) {
                
                throw new AllocationException('Allocation already exists.');
            }
        }
    }
}
