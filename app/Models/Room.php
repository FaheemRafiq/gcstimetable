<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    public function isBsRoom(): bool
    {
        return $this->type === 'BS';
    }

    public function isInterRoom(): bool
    {
        return $this->type === 'INTER';
    }

    public function isBothInterAndBsRoom(): bool
    {
        return $this->type === 'BOTH';
    }

    public function scopeWhereTypeWithBoth($query, string $type)
    {
        return $query->where('type', $type)->orWhere('type', 'BOTH');
    }

    public function scopeAvailable($query)
    {
        return $query->where('isavailable', 1);
    }

    public function scopeWhereInstitution($query, int $institutionId)
    {
        return $query->where('institution_id', $institutionId);
    }

    // Room has many Allocations
    public function allocations(): HasMany
    {
        return $this->hasMany(Allocation::class);
    }

    // Room belongs to an Institution
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
