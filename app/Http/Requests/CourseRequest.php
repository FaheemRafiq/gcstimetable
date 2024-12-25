<?php

namespace App\Http\Requests;

use App\Models\Course;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $types = array_keys(Course::TYPES);

        return [
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('courses', 'code')
                ->ignore($this->route('course') ?? null),
            ],
            'semester_id' => [
                'bail',
                'required',
                'integer',
                'exists:semesters,id',
            ],
            'name' => [
                'required',
                'string',
                'max:255'
            ],
            'credit_hours' => [
                'required',
                'integer',
                'min:1',
            ],
            'display_code' => [
                'required',
                'string',
                'max:255',
            ],
            'type' => [
                'required',
                'string',
                Rule::in($types),
            ],
            'is_default' => [
                'required',
                'boolean',
            ],
        ];
    }
}
