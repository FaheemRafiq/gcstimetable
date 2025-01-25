<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class StoreSlotRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => $this->getTimeField('start_time').'-'.$this->getTimeField('end_time'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'code'         => ['required', 'string', 'max:255'],
            'name'         => ['required', 'string', 'max:255'],
            'shift_id'     => ['required', 'integer'],
            'start_time'   => ['required', 'date_format:H:i:s'],
            'end_time'     => ['required', 'date_format:H:i:s'],
            'is_practical' => ['required', 'boolean'],
        ];
    }

    public function getTimeField(string $key): string
    {
        return $this->input($key) ? Carbon::createFromFormat('H:i:s', $this->$key)->format('h:i') : '';
    }
}
