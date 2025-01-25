<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class RoomCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->map(function ($room): array {
            return [
                'id'             => $room->id,
                'name'           => $room->name,
                'code'           => $room->code,
                'capacity'       => $room->capacity,
                'institution_id' => $room->institution_id,
                'type'           => $room->type,
                'isavailable'    => $room->isavailable,
                'createdAt'      => $room->created_at?->format(config('providers.date.readable')),
            ];
        })->all();
    }
}
