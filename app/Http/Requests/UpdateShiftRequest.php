<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShiftRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'type'           => ['required', 'string', 'in:Morning,Afternoon,Evening'],
            'program_type'   => ['required', 'string', 'in:INTER,BS,ADP'],
        ];
    }
}
