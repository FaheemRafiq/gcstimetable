<?php

namespace App\Models;

use App\Traits\IsActiveTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Semester extends Model
{
    use HasFactory;
    use IsActiveTrait;

    protected $fillable = [
        'name',
        'number',
        'is_active',
        'program_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($semester) {
            $semester->sections()->create([
                'name' => 'A',
            ]);
        });
    }

    // Semester Has Many Sections
    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }

    // Semester has many Courses
    public function courses()
    {
        return $this->belongsToMany(Course::class);
    }

    // belongs to a program
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    public function allocations()
    {
        return $this->hasManyThrough(Allocation::class, Section::class);
    }
}
