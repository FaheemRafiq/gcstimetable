<?php

namespace App\Http\Requests;

use App\Models\Section;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SectionRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'is_active'   => ['required', Rule::in([Section::ACTIVE, Section::INACTIVE])],
            'semester_id' => ['required', 'exists:semesters,id'],
            'name'        => [
                'required',
                'string',
                'max:255',
                Rule::unique(Section::class)
                ->where(function ($query) {
                    return $query->where('semester_id', $this->semester_id);
                })->ignore($this->route('section')),
            ],
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
            'name.unique' => 'The name should be unique within the same semester.',
        ];
    }
}
