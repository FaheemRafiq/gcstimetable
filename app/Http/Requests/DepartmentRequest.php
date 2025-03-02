<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class DepartmentRequest extends FormRequest
{
    public function prepareForValidation()
    {
        $auth = Auth::user();

        if (! $auth->isSuperAdmin()) {
            $this->merge([
                'institution_id' => $auth->institution_id,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            'name'           => ['required', 'string', 'max:255'],
            'code'           => ['required', 'string', 'max:255'],
            'institution_id' => ['required', 'integer'],
        ];

        // For create and update, handle unique validation differently
        $rules['code'][] = 'unique:departments,code,'
            .($this->department ? $this->department->id : 'NULL')
            .',id,institution_id,'
            .$this->institution_id;

        return $rules;
    }
}
