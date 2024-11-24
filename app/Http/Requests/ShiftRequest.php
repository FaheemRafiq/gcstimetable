<?php

namespace App\Http\Requests;

use App\Models\Shift;
use App\Models\Program;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class ShiftRequest extends FormRequest
{
    public function prepareForValidation(): void
    {
        $this->merge([
            'institution_id' => $this->input('institution_id') ?? $this->user()->institution_id,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $programTypes   = array_keys(Program::TYPES);
        $types          = array_keys(Shift::TYPES);

        return [
            'name'           => ['required', 'string', 'max:255'],
            'is_active'      => ['required', Rule::in([Shift::ACTIVE, Shift::INACTIVE])],
            'program_type'   => ['bail', 'required', 'string', Rule::in($programTypes)],
            'institution_id' => ['bail', 'required', 'integer'],
            'type'           => [
                'required', 
                'string', 
                Rule::in($types),
                Rule::unique(Shift::class)
                    ->where('program_type', $this->program_type)
                    ->where('type', $this->type)
                    ->where('institution_id', $this->institution_id)
                    ->ignore($this->route('shift')->id ?? null),
            ],
        ];
    }

    public function messages()
    {
        return [
            'type.unique' => "The {$this->type} shift type already exists for {$this->program_type}.",
        ];
    }
}
