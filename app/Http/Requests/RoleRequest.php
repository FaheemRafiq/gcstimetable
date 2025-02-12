<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        $user = Auth::user();

        if (! $user->isSuperAdmin()) {
            $this->merge([
                'institution_id' => $user->institution_id,
            ]);
        } else {
            $institution_id = $this->input('institution_id');

            if ($institution_id == 'null') {
                $this->merge([
                    'institution_id' => null,
                ]);
            }
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('role')?->id ?? null;

        return [
            'name'           => ['required', 'string'],
            'guard_name'     => ['required', 'string'],
            'institution_id' => 'nullable|exists:institutions,id',
            'permissions'    => ['required', 'array'],
            'permissions.*'  => ['required', 'exists:permissions,id'],

            // Ensure the combination of name, guard_name, and institution_id is unique
            Rule::unique('roles')->where(function ($query) use ($id) {
                $query->where('name', $this->input('name'))
                    ->where('guard_name', $this->input('guard_name'))
                    ->where('institution_id', $this->input('institution_id'));

                if ($id) {
                    $query->where('id', '!=', $id);
                }
            }),
        ];
    }
}
