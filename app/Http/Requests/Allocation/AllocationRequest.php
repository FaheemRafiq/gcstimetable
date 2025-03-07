<?php

namespace App\Http\Requests\Allocation;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class AllocationRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'time_table_id' => 'required|integer',
            'slot_id'       => 'required|integer',
            'section_id'    => 'required|integer',
            'day_id'        => 'nullable|integer',
            'room_id'       => 'nullable|integer',
            'teacher_id'    => 'nullable|integer',
            'course_id'     => 'nullable|integer',
            'name'          => 'nullable|string|max:255',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'time_table_id.required' => 'The time table is required.',
            'slot_id.required'       => 'The time slot is required.',
            'day_id.required'        => 'The day is required.',
            'section_id.required'    => 'The section is required.',
        ];
    }
}
