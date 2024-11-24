<?php

namespace App\Http\Requests;

use App\Models\Semester;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SemesterRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['required', 'string', Rule::in(Semester::ACTIVE, Semester::INACTIVE)],
            'program_id' => [ 'bail', 'required', 'integer'],
            'number' => [
                'required',
                'integer',
                'min:1',
                'max:10',
                Rule::unique(Semester::class)
                ->where('program_id', $this->program_id)
                ->where('number', $this->number)
                ->ignore($this->route('semester')->id ?? null),
            ],
        ];
    }

    public function messages()
    {
        return [
            'number.unique' => 'The semester no. is already exists for this program.',
        ];
    }
}
