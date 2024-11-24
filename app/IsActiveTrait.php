<?php

namespace App;

trait IsActiveTrait
{
    public const ACTIVE = 'active';
    public const INACTIVE = 'inactive';

    // Scopes
    public function scopeWhereActive($query, $value)
    {
        return $query->where('is_active', $value);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', 'inactive');
    }

    // helpers
    public function isActive()
    {
        return $this->is_active === 'active';
    }

    public function isInactive()
    {
        return $this->is_active === 'inactive';
    }
}
