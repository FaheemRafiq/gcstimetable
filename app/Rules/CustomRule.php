<?php

namespace App\Rules;

use Closure;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Validation\ValidationRule;

class CustomRule implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        Log::info('CustomRule: validate method called.');

        $fail('The selected combination of day, slot, teacher, and course is not unique.');
        //  [$day_id, $slot_id, $teacher_id, $course_id ] = explode('-', $value);
        Log::info('attribute is '.$attribute);
        // Log::info("value is ".$value);
        // $count = DB::table('allocations')
        //     ->where('day_id', $day_id)
        //     ->where('slot_id', $slot_id)
        //     ->where('teacher_id', $teacher_id)
        //     ->where('section_id', $section_id)
        //     ->where('course_id', $course_id)

        //     ->count();

        // if ($count > 0) {
        //     $fail('The selected combination of day, slot, teacher, and course is not unique.');
        // }
    }
}
