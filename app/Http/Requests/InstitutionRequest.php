<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class InstitutionRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name'    => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:255'],
            'email'   => ['nullable', 'string', 'max:255'],
        ];
    }
}
