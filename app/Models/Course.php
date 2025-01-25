<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Course extends Model
{
    use HasFactory;

    public const TYPES = [
        'CLASS' => 'Class',
        'LAB'   => 'Lab',
    ];

    // Scopes

    public function scopeWhereInstitution($query, $institutionId)
    {
        return $query->where('institution_id', $institutionId);
    }

    // Course my Taught by many Teachers on Different Days
    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(Teacher::class, 'allocations');
    }

    // Course has many Allocations
    public function allocations(): HasMany
    {
        return $this->hasMany(Allocation::class);
    }

    // Course is in many rooms from Allocation Model
    public function rooms(): BelongsToMany
    {
        return $this->belongsToMany(Room::class, 'allocations');
    }

    // Course is in many slots from Allocation Model
    public function slots(): BelongsToMany
    {
        return $this->belongsToMany(Slot::class, 'allocations');
    }

    // Course is in many days from Allocation Model
    public function days(): BelongsToMany
    {
        return $this->belongsToMany(Day::class, 'allocations');
    }

    public function semesters()
    {
        return $this->belongsToMany(Semester::class);
    }
}
