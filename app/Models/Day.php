<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Day extends Model
{
    use HasFactory;

    public const ACTIVE = 'active';

    public const INACTIVE = 'inactive';

    // Day has many Allocations
    public function allocations(): HasMany
    {
        return $this->hasMany(Allocation::class);
    }

    // Day belongs to an Institution
    public function institution(): BelongsToMany
    {
        return $this->belongsToMany(Institution::class);
    }
}
