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

    protected $fillable = [
        'name',
        'personnel_number',
        'email',
        'cnic',
        'phone_number',
        'bank_iban',
        'is_male',
        'date_of_birth',
        'date_of_joining_in_this_college',
        'date_of_joining_govt_service',
        'date_of_joining_current_rank',
        'father_name',
        'seniority_number',
        'qualification',
        'highest_degree_awarding_institute',
        'highest_degree_awarding_country',
        'highest_degree_awarding_year',
        'degree_title',
        'rank',
        'position',
        'department_id',
        'is_visiting',
        'is_active',
        'user_id',
    ];

    protected $casts = [
        'date_of_birth'                   => 'date',
        'date_of_joining_in_this_college' => 'date',
        'date_of_joining_govt_service'    => 'date',
        'date_of_joining_current_rank'    => 'date',
    ];

    public function scopeWhereActive($query)
    {
        return $query->where('is_active', self::ACTIVE);
    }

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
    public function institution(): HasOneThrough
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
