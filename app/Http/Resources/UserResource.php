<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'email'         => $this->email,
            'createdAt'     => $this->created_at?->format(config('providers.date.readable')),
            'verifiedAt'    => $this->email_verified_at?->format(config('providers.date.readable')),

            'profilePhotoUrl'   => $this->profile_photo_url,
            'label'             => $this->label,
            'roles'             => RoleResource::collection($this->roles),
            'permissions'       => PermissionResource::collection($this->getAllPermissions()),
            'institution'       => $this->institution
        ];
    }

    public function getAllPermissions()
    {
        $permissions = [];
        foreach ($this->roles as $role) {
            foreach ($role->permissions as $permission) {
                $permissions[] = $permission;
            }
        }
        return collect($permissions)->unique('id')->values();
    }
}
