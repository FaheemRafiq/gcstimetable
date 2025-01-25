<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Program extends Model
{
    use HasFactory;

    public const MIN_DURATION_YEARS = 1;

    public const MAX_DURATION_YEARS = 5;

    public const TYPES = [
        'INTER' => 'Intermediate',
        'BS'    => 'Bachelor',
        'ADP'   => 'Associate Degree Program',
    ];

    // guarded

    // program belongs to a department
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    // program has many semesters
    public function semesters(): HasMany
    {
        return $this->hasMany(Semester::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function institution(): HasOneThrough
    {
        return $this->hasOneThrough(Institution::class, Department::class, 'id', 'id', 'department_id', 'institution_id');
    }

    public function courses()
    {
        return $this->hasManyThrough(Course::class, Semester::class);
    }
}
