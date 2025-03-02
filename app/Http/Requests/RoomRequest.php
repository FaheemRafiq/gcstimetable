<?php

namespace App\Http\Requests;

use App\Models\Room;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class RoomRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->isMethod('post')) { // Only merge institution_id when storing
            $this->merge([
                'institution_id' => $this->user()->institution_id ?? null,
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
        return [
            'name'           => ['required', 'string', 'max:255'],
            'code'           => ['required', 'string', 'max:255'],
            'capacity'       => ['required', 'integer', 'min:1'],
            'is_available'   => ['required', 'boolean'],
            'type'           => ['required', 'string', Rule::in(Room::TYPES ?? ['INTER', 'BS', 'BOTH'])],
            'institution_id' => $this->isMethod('post') ? ['required', 'integer'] : [], // Only required on store
        ];
    }
}
