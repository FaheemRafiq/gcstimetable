<?php

namespace App\Http\Requests;

use App\Models\Teacher;
use App\Enums\TeacherRankEnum;
use Illuminate\Validation\Rule;
use App\Enums\TeacherPositionEnum;
use App\Enums\TeacherQualificationEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class TeacherRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name'                              => ['required', 'string', 'max:255'],
            'personnel_number'                  => ['required', 'string', 'max:255', Rule::unique('teachers', 'personnel_number')->ignore($this->route('teacher'))],
            'email'                             => ['required', 'email:rfc,dns', 'max:255', Rule::unique('teachers', 'email')->ignore($this->route('teacher'))],
            'cnic'                              => ['nullable', 'string', 'max:255', Rule::unique('teachers', 'cnic')->ignore($this->route('teacher'))],
            'phone_number'                      => ['nullable', 'string', 'max:255', Rule::unique('teachers', 'phone_number')->ignore($this->route('teacher'))],
            'bank_iban'                         => ['nullable', 'string', 'max:255', Rule::unique('teachers', 'bank_iban')->ignore($this->route('teacher'))],
            'isMale'                            => ['required', 'boolean'],
            'date_of_birth'                     => ['required', 'date'],
            'date_of_joining_in_this_college'   => ['nullable', 'date'],
            'date_of_joining_govt_service'      => ['nullable', 'date'],
            'date_of_joining_current_rank'      => ['nullable', 'date'],
            'father_name'                       => ['required', 'string', 'max:255'],
            'seniority_number'                  => ['nullable', 'integer'],
            'qualification'                     => ['nullable', 'string', Rule::enum(TeacherQualificationEnum::class)],
            'highest_degree_awarding_institute' => ['nullable', 'string', 'max:255'],
            'highest_degree_awarding_country'   => ['nullable', 'string', 'max:255'],
            'highest_degree_awarding_year'      => ['nullable', 'integer', 'min:1900', 'max:'.date('Y')],
            'degree_title'                      => ['required', 'string', 'max:255'],
            'rank'                              => ['nullable', 'string', Rule::enum(TeacherRankEnum::class)],
            'position'                          => ['nullable', 'string', Rule::enum(TeacherPositionEnum::class)],
            'department_id'                     => ['required', 'integer', 'exists:departments,id'],
            'isvisiting'                        => ['required', 'boolean'],
            'is_active'                         => ['required', Rule::in(Teacher::ACTIVE, Teacher::INACTIVE)],
        ];
    }
}
