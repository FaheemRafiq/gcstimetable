<?php

namespace App\Http\Requests;

use App\Models\Program;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class ProgramRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        $types = array_keys(Program::TYPES);

        return [
            'name'     => ['required', 'string', 'max:255'],
            'type'     => ['bail', 'required', 'string', Rule::in($types)],
            'duration' => [
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
                    ->ignore($this->route('program')->id ?? null),
            ],
            'shift_id'      => ['required', 'integer', 'exists:shifts,id'],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
        ];
    }

    public function messages()
    {
        return [
            'code.unquie' => sprintf('This program code %s already exists in type of %s.', $this->code, $this->type),
        ];
    }
}
