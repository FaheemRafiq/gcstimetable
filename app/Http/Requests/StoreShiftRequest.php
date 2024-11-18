<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShiftRequest extends FormRequest
{
    public function prepareForValidation(): void
    {
        $this->merge([
            'institution_id' => $this->user()->institution_id,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'      => ['required', 'string', 'max:255'],
            'type'      => ['required', 'string', 'in:Morning,Afternoon,Evening'],
            'program_type'   => ['required', 'string', 'in:INTER,BS,ADP'],
            'institution_id' => ['required', 'integer'],
        ];
    }
}
