<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProgramRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'code'          => ['required', 'string', 'max:255'],
            'duration'      => ['required', 'string'],
            'type'          => ['required', 'string', 'in:INTER,BS,ADP'],
            'shift_id'      => ['required', 'integer'],
            'department_id' => ['required', 'integer'],
        ];
    }
}
