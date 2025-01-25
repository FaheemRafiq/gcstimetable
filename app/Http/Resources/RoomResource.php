<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'code'           => $this->code,
            'capacity'       => $this->capacity,
            'type'           => $this->type,
            'isavailable'    => $this->isavailable,
            'institution_id' => $this->institution_id,
        ];
    }
}
