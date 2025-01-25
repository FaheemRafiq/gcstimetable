<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'name'      => $this->name,
            'guardName' => $this->guard_name,
            'createdAt' => $this->created_at?->format(config('providers.date.readable')),
            'updatedAt' => $this->updated_at?->format(config('providers.date.readable')),
        ];
    }
}
