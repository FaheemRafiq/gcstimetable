<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Institution extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
    ];

    // Institution has many Departments
    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    // Institution has many Rooms
    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    // Institution has many departments and each department has many teachers  so return all the teachers of this Institution
    public function teachers(): HasManyThrough
    {
        return $this->hasManyThrough(Teacher::class, Department::class);
    }

    public function programs(): HasManyThrough
    {
        return $this->hasManyThrough(Program::class, Department::class);
    }

    public function timetables()
    {
        return $this->hasManyThrough(TimeTable::class, Shift::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    // Institution has many days
    public function days(): BelongsToMany
    {
        return $this->belongsToMany(Day::class)->withPivot('is_active');
    }

    public function activeDays(): BelongsToMany
    {
        return $this->days()->wherePivot('is_active', Day::ACTIVE);
    }

    // Institution has many slots
    public function slots(): HasMany
    {
        return $this->hasMany(Slot::class);
    }

    public function shifts(): HasMany
    {
        return $this->hasMany(Shift::class);
    }
}
