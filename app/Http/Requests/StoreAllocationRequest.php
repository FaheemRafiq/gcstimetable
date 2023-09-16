<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAllocationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'course_id' => 'required',
            'teacher_id' => 'required|unique:allocations,teacher_id,NULL,id,day_id,slot_id',
            'room_id' => 'required',
            'day_id' => 'required',
            'slot_id' => 'required',
            'section_id' => 'required',
        ];
    }
}
