<?php

use Carbon\Carbon;
use App\Types\TimeSlot;

function DaystoText($days): string
{
    if (empty($days)) {
        return '';
    }

    // remove duplicates from the array
    $days = array_unique($days);

    sort($days); // Sort the days in ascending order
    $ranges  = [];
    $start   = $days[0];
    $end     = $days[0];
    $counter = count($days);

    for ($i = 1; $i < $counter; $i++) {
        if ($days[$i] == $end + 1) {
            $end = $days[$i];
        } else {
            $ranges[] = $start == $end ? $start : $start.'-'.$end;

            $start = $days[$i];
            $end   = $days[$i];
        }
    }

    $ranges[] = $start == $end ? $start : $start.'-'.$end;

    // Format the result
    $formattedRanges = array_map(function (string $range): string {
        return '('.$range.')';
    }, $ranges);

    return implode(' ', $formattedRanges);
}

/**
 * Check if two TimeSlot objects overlap.
 */
function isTimeSlotOverlapping(TimeSlot $timeSlot1, TimeSlot $timeSlot2): bool
{
    // Convert 24-hour time format to timestamps
    $start1 = strtotime($timeSlot1->startTime);
    $end1   = strtotime($timeSlot1->endTime);
    $start2 = strtotime($timeSlot2->startTime);
    $end2   = strtotime($timeSlot2->endTime);

    return $start1 < $end2 && $end1 > $start2;
}

if (! function_exists('generateAvatar')) {
    function generateAvatar($name, $size = 100, string $background = 'random', string $color = 'fff'): string
    {
        $initials = collect(explode(' ', $name))
            ->map(function ($word) {
                return strtoupper(substr($word, 0, 1));
            })
            ->take(2)
            ->implode('');

        return 'https://ui-avatars.com/api/?name='.urlencode($initials).
            '&size='.$size.
            '&background='.$background.
            '&color='.$color;
    }
}

if (! function_exists('timeaddminute')) {
    function timeaddminutes(string &$time, int $mintues = 1): void
    {
        $time = Carbon::parse($time)->addMinutes($mintues)->toTimeString();
    }
}
