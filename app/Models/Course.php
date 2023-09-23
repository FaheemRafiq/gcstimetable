<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    // Course model
    // guarded
    protected $guarded = [];
   
    
    // Allocation is said to be completed if all the fields are not null
    public function isCompleted()
    {
        return $this->day_id && $this->slot_id && $this->teacher_id && $this->room_id && $this->section_id;
    }

    



    // Course my Taught by many Teachers on Different Days
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'allocations');
    }
    
    // Course has many Allocations
    public function allocations()
    {
        return $this->hasMany(Allocation::class);
    }

    // Course is in many rooms from Allocation Model
    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'allocations');
    }

    // Course is in many slots from Allocation Model
    public function slots()
    {
        return $this->belongsToMany(Slot::class, 'allocations');
    }

    // Course is in many days from Allocation Model
    public function days()
    {
        return $this->belongsToMany(Day::class, 'allocations');
    }

}
