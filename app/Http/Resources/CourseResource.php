<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'is_default'   => $this->is_default,
            'display_code' => $this->display_code,
            'code'         => $this->code,
            'credit_hours' => $this->credit_hours,
            'type'         => $this->type,
            'semester_id'  => $this->semester_id,
        ];
    }
}
