<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'code'           => ['required', 'string', 'max:255'],
            'capacity'       => ['required', 'integer', 'min:1'],
            'isavailable'    => ['required', 'boolean'],
            'type'           => ['required', 'string', 'in:INTER,BS,BOTH'],
        ];
    }
}
