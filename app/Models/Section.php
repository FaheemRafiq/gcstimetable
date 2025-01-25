<?php

namespace App\Models;

use App\Traits\IsActiveTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Section extends Model
{
    use HasFactory;
    use IsActiveTrait;

    // Section Belongs to a Semester
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    // Section has many Courses
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
