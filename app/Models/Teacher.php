<?php

namespace App\Models;

use App\Traits\IsActiveTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Teacher extends Model
{
    use HasFactory;
    use IsActiveTrait;

    protected $casts = [
        'date_of_birth' => 'date',
        'date_of_joining_in_this_college' => 'date',
        'date_of_joining_govt_service' => 'date',
        'date_of_joining_current_rank' => 'date'
    ];


    // Teacher Belongs to Department
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    // Teacher has many Allocations
    public function allocations()
    {
        return $this->hasMany(Allocation::class);
    }

    // Teacher Belongs to some Institution
    public function institution() : HasOneThrough
    {
        return $this->hasOneThrough(Institution::class, Department::class, 'id', 'id', 'department_id', 'institution_id');
    }

    // Teacher model
    public function courses()
    {
        // Can be done using Eager Loading
        return $this->belongsToMany(Course::class, 'allocations')
            ->withPivot(['day_id', 'slot_id', 'room_id']);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
