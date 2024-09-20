<?php

namespace App\Http\Resources;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'personnel_number'  => $this->personnel_number,
            'email'             => $this->email,
            'cnic'              => $this->cnic,
            'phone_number'      => $this->phone_number,
            'bank_iban'         => $this->bank_iban,
            'is_male'           => $this->isMale,
            'date_of_birth'     => $this->date_of_birth?->format(config('providers.date.format')),

            'date_of_joining_in_this_college'   => $this->date_of_joining_in_this_college?->format(config('providers.date.format')),
            'date_of_joining_govt_service'      => $this->date_of_joining_govt_service?->format(config('providers.date.format')),
            'date_of_joining_current_rank'      => $this->date_of_joining_current_rank?->format(config('providers.date.format')),
            'father_name'                       => $this->father_name,
            'seniority_number'                  => $this->seniority_number,
            'qualification'                     => $this->qualification,
            'highest_degree_awarding_institute' => $this->highest_degree_awarding_institute,
            'highest_degree_awarding_country'   => $this->highest_degree_awarding_country,
            'highest_degree_awarding_year'      => $this->highest_degree_awarding_year,

            'degree_title'  => $this->degree_title,
            'rank'          => $this->rank,
            'position'      => $this->position,
            'department_id' => $this->department_id,
            'department'    => $this->whenLoaded('department') ? $this->department : null,
            'isvisiting'    => $this->isvisiting,
            'isActive'      => $this->isActive,
            'created_at'    => $this->created_at?->format(config('providers.date.format'))
        ];
    }
}
