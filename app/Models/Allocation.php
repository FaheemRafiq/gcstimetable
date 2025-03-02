<?php

namespace App\Models;

use App\Observers\AllocationObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

/*
*   Allocation Observer
*/
#[ObservedBy(AllocationObserver::class)]

/*
*   Allocation Model
*/
class Allocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'teacher_id',
        'room_id',
        'day_id',
        'slot_id',
        'section_id',
        'time_table_id',
        'name',
    ];

    // Custom Methods

    public function hasTeacher(): bool
    {
        return (bool) $this->teacher_id;
    }

    public function hasCourse(): bool
    {
        return (bool) $this->course_id;
    }

    public function hasRoom(): bool
    {
        return (bool) $this->room_id;
    }

    public function hasSection(): bool
    {
        return (bool) $this->section_id;
    }

    public function hasDay(): bool
    {
        return (bool) $this->day_id;
    }

    public function hasSlot(): bool
    {
        return (bool) $this->slot_id;
    }

    public function shouldCheckDuplicate(): bool
    {
        return $this->hasDay() && $this->hasSlot() && $this->hasTeacher() && $this->hasCourse();
    }

    // Scopes

    public function scopeWithAll($query)
    {
        return $query->with(['course', 'teacher:id,name,email', 'room', 'slot', 'day', 'section.semester']);
    }

    public function scopeDuplicate($query)
    {
        return $query
            ->where('day_id', $this->day_id)
            ->where('slot_id', $this->slot_id)
            ->where('teacher_id', $this->teacher_id)
            ->where('course_id', $this->course_id);
    }

    public function scopeComplete($query, $complete = true)
    {
        if ($complete) {
            return $query->whereNotNull('day_id')
                ->whereNotNull('slot_id')
                ->whereNotNull('teacher_id')
                ->whereNotNull('room_id')
                ->whereNotNull('course_id')
                ->whereNotNull('section_id');
        }

        return $query->whereNull('day_id')
            ->orWhereNull('slot_id')
            ->orWhereNull('teacher_id')
            ->orWhereNull('course_id')
            ->orWhereNull('room_id')
            ->orWhereNull('section_id');
    }

    public function scopeWhereSection($query, $section_id)
    {
        return $query->where('section_id', $section_id);
    }

    public function scopeWhereTimeTable($query, $time_table_id)
    {
        return $query->where('time_table_id', $time_table_id);
    }

    public function scopeConflictForDayAndTime($query, $dayId, $startTime, $endTime)
    {
        return $query->where('day_id', $dayId)
            ->whereHas('slot', fn ($q) => $q->timeOverlaps($startTime, $endTime));
    }

    public function scopeExcludeById($query, $excludeId = null)
    {
        return $excludeId ? $query->where('id', '!=', $excludeId) : $query;
    }

    public function scopeWhereInstitutionId(Builder $query, $institutionId): void
    {
        $query->whereHas('timetable', function (Builder $query) use ($institutionId): void {
            $query
                ->isValidForToday()
                ->whereHas('shift', function (Builder $query) use ($institutionId): void {
                    $query->where('institution_id', $institutionId);
                });
        });
    }

    // Relationships
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function slot(): BelongsTo
    {
        return $this->belongsTo(Slot::class, 'slot_id');
    }

    public function day(): BelongsTo
    {
        return $this->belongsTo(Day::class, 'day_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

    public function timetable(): BelongsTo
    {
        return $this->belongsTo(TimeTable::class, 'time_table_id');
    }
}
