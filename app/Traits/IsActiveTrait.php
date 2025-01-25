<?php

namespace App\Traits;

trait IsActiveTrait
{
    public const ACTIVE = 'active';

    public const INACTIVE = 'inactive';

    // Scopes
    public function scopeWhereActive($query)
    {
        return $query->where('is_active', self::ACTIVE);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', self::ACTIVE);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', self::INACTIVE);
    }

    // helpers
    public function isActive(): bool
    {
        return $this->is_active === self::ACTIVE;
    }

    public function isInactive(): bool
    {
        return $this->is_active === self::INACTIVE;
    }
}
