<?php

namespace App\Models;

use App\IsActiveTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    use HasFactory;
    use IsActiveTrait;

    // guarded

    // Scopes

    public function scopeBsRoom($query)
    {
        return $query->where('name', 'LIKE', '%BS%');
    }

    public function scopeInterRoom($query)
    {
        return $query->whereRaw('UPPER(name) LIKE ?', ['%INTER%']);
    }

    public function scopeBothInterAndBsRoom($query)
    {
        return $query->where('name', 'LIKE', '%BS%')
                     ->orWhereRaw('UPPER(name) LIKE ?', ['%INTER%']);
    }

    public function scopeWhereInstitution($query, $value)
    {
        return $query->where('institution_id', $value);
    }

    // has many slots
    public function slots(): HasMany
    {
        return $this->hasMany(Slot::class);
    }

    // has many programs
    public function programs(): HasMany
    {
        return $this->hasMany(Program::class);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function semesters() 
    {
        return $this->hasManyThrough(Semester::class, Program::class);
    }
}
