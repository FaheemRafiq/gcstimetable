<?php

namespace App\Http\Requests;

use App\Models\PermissionGroup;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class PermissionGroupRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:255', Rule::unique(PermissionGroup::class)->ignore($this->route('permission_group')->id)],
            'permissions'   => ['nullable', 'array'],
            'permissions.*' => ['required', 'exists:permissions,id'],
        ];
    }
}
