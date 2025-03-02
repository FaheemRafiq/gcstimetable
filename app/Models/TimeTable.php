<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TimeTable extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'shift_id',
    ];

    protected $appends = ['time_ago'];

    public function scopeDateRange($query, $minDate, $maxDate)
    {
        return $query->whereBetween('start_date', [$minDate, $maxDate])
            ->whereBetween('end_date', [$minDate, $maxDate]);
    }

    public function scopeIsValidForToday($query)
    {
        $currentDate = Carbon::today();

        return $query->where(function ($query) use ($currentDate) {
            $query->where('start_date', '<=', $currentDate)
                ->orWhere('end_date', '>=', $currentDate);
        });
    }

    public function getTimeAgoAttribute()
    {
        return $this->created_at?->diffForHumans();
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    public function allocations()
    {
        return $this->hasMany(Allocation::class);
    }

    public function institution()
    {
        return $this->hasOneThrough(Institution::class, Shift::class, 'id', 'id', 'shift_id', 'institution_id');
    }
}
