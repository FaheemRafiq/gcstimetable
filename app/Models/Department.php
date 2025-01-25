<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Department extends Model
{
    use HasFactory;

    // guarded

    // Department has many teachers
    public function teachers(): HasMany
    {
        return $this->hasMany(Teacher::class);
    }

    // Department has many Programs
    public function programs(): HasMany
    {
        return $this->hasMany(Program::class);
    }

    // Department belongs to an Institution
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function courses() {}
}
