<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class AllocationCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($allocation): array {
            return [
                'id'      => $allocation->id,
                'name'    => $allocation->name,
                'course'  => new CourseResource($allocation->course),
                'teacher' => new TeacherResource($allocation->teacher),
                'room'    => new RoomResource($allocation->room),
                'day'     => new DayResource($allocation->day),
                'slot'    => new SlotResource($allocation->slot),
            ];
        })->toArray();
    }
}
