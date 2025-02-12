<?php

namespace App\Models;

use App\Enums\RoleEnum;
use Spatie\Permission\Models\Role as ModelsRole;

class Role extends ModelsRole
{
    public function scopeInstitutionRoles($query, $institutionId)
    {
        return $query->where(function ($query) use ($institutionId) {
            $query->where('institution_id', $institutionId)
                ->orWhereNull('institution_id');
        })
            ->whereNot('name', RoleEnum::SUPER_ADMIN->value);
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }
}
