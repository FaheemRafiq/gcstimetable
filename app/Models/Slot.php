<?php

namespace App\Models;

use App\Observers\SlotObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

/*
*   Allocation Observer
*/
#[ObservedBy(SlotObserver::class)]

/*
*   Allocation Model
*/
class Slot extends Model
{
    use HasFactory;

    // Scopes

    public function scopeTimeOverlaps(Builder $query, string $startTime, string $endTime)
    {
        timeaddminutes($startTime);
        timeaddminutes($endTime, -1);

        return $query->where(function ($q) use ($startTime, $endTime): void {
            $q->whereBetween('start_time', [$startTime, $endTime])
                ->orWhereBetween('end_time', [$startTime, $endTime])
                ->orWhere(function ($q2) use ($startTime, $endTime): void {
                    $q2->where('start_time', '<=', $startTime)
                        ->where('end_time', '>=', $endTime);
                });
        });
    }

    // Slot belongs to a Shift
    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    // Slot has many Allocations
    public function allocations(): HasMany
    {
        return $this->hasMany(Allocation::class);
    }

    // Slot belongs to an Institution
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
