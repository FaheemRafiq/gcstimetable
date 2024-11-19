<?php

namespace App\Observers;

use App\Exceptions\SlotException;
use App\Models\Slot;

class SlotObserver
{
    /**
     * Handle the Slot "creating" event.
     */
    public function creating(Slot $slot)
    {
        $this->validateSlot($slot, 'store');
    }

    /**
     * Handle the Slot "updating" event.
     */
    public function updating(Slot $slot)
    {
        $this->validateSlot($slot, 'update');
    }

    public function validateSlot(Slot $slot, string $action)
    {
        $queryBuilder = Slot::where('shift_id', $slot->shift_id)->timeOverlaps($slot->start_time, $slot->end_time);

        if($action === 'update'){
            $queryBuilder->where('id', '!=', $slot->id);
        }

        if($queryBuilder->exists()){
            throw new SlotException("Time slot already exists in this time slot $slot->name.");
        }
    }
}
