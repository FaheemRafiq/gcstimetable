<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SectionResouce extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'is_active'   => $this->is_active,
            'semester_id' => $this->semester_id,
            'created_at'  => $this->created_at?->format(config('providers.date.readable')),
            'updated_at'  => $this->updated_at?->format(config('providers.date.readable')),
        ];
    }
}
