<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AllocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'      => $this->id,
            'name'    => $this->name,
            'course'  => new CourseResource($this->course), // Assuming CourseResource exists
            'teacher' => new TeacherResource($this->teacher), // Assuming TeacherResource exists
            'room'    => new RoomResource($this->room), // Assuming RoomResource exists
            'day'     => new DayResource($this->day), // Assuming DayResource exists
            'slot'    => new SlotResource($this->slot), // Assuming SlotResource exists
        ];
    }
}
