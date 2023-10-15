<?php

namespace App\Models;

use App\Models\Scopes\ProgramScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semester extends Model
{

    use HasFactory;
    // guarded
    protected $guarded = [];


     /**
      * The "booted" method of the model.
      */
     protected static function booted(): void
     {
         static::addGlobalScope(new ProgramScope);
     }


    // Semester Has Many Sections
    public function sections() : HasMany
    {
        return $this->hasMany(Section::class);
    }

    // Semester has many Courses
    public function courses() : HasMany
    {
        return $this->hasMany(Course::class);
    }


    // belongs to a program
    public function program() : BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

}
