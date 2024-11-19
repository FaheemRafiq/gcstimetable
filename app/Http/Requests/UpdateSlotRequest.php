<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSlotRequest extends FormRequest
{
    public function prepareForValidation(): void
    {
        $this->merge([
            'name' => $this->getTimeField('start_time').'-'.$this->getTimeField('end_time'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'code'          => ['required', 'string', 'max:255'],
            'name'          => ['required', 'string', 'max:255'],
            'start_time'    => ['required', 'date_format:H:i:s'],
            'end_time'      => ['required', 'date_format:H:i:s'],
            'is_practical'  => ['required', 'boolean'],
        ];
    }

    public function getTimeField(string $key)
    {
        return $this->input($key) ? Carbon::createFromFormat('H:i:s', $this->$key)->format('h:i') : '';
    }
}
