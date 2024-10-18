<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeTable extends Model
{
    use HasFactory;

    protected $appends = ['time_ago'];

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
}
