<?php

namespace App\Http\Requests;

use App\Models\Program;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class ProgramRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        $this->merge([
            'shifts' => $this->has('shifts') && $this->filled('shifts') ? collect($this->shifts)->pluck('value')->toArray() : [],
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        $types = array_keys(Program::TYPES);

        return [
            'name'          => ['required', 'string', 'max:255'],
            'type'          => ['bail', 'required', 'string', Rule::in($types)],
            'department_id' => ['bail', 'required', 'integer', 'exists:departments,id'],
            'duration'      => [
                'bail',
                'required',
                'integer',
                'min:'.Program::MIN_DURATION_YEARS,
                'max:'.Program::MAX_DURATION_YEARS,
            ],
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique(Program::class)
                    ->where('code', $this->code)
                    ->where('type', $this->type)
                    ->where('department_id', $this->department_id)
                    ->ignore($this->route('program')->id ?? null),
            ],
            'shifts'        => ['nullable', 'array'],
            'shifts.*'      => ['required', 'integer', 'exists:shifts,id'],
        ];
    }

    public function messages()
    {
        return [
            'code.unquie' => sprintf('This program code %s already exists in type of %s.', $this->code, $this->type),
        ];
    }
}
