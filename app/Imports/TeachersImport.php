<?php

namespace App\Imports;

use App\Models\Teacher;
use App\Models\Department;

class TeachersImport extends BaseImport
{
    protected $modelClass = Teacher::class;

    protected $departments;

    protected $headerMapping = [
        'Full Name*'        => 'name',
        'Personnel Number*' => 'personnel_number',
        'Email Address*'    => 'email',
        'CNIC'              => 'cnic',
        'Phone Number'      => 'phone_number',
        'Bank IBAN'         => 'bank_iban',
        'Gender*'           => 'is_male',
        'Date of Birth'     => 'date_of_birth',
        'Father\'s Name'    => 'father_name',
        'Department*'       => 'department_id',
        'Qualification'     => 'qualification',
        'Institute Name'    => 'highest_degree_awarding_institute',
        'Rank'              => 'rank',
        'Position'          => 'position',
        'Visiting'          => 'is_visiting',
        'Status*'           => 'is_active',
    ];

    public function __construct()
    {
        $institutionId = getPermissionsTeamId();
        try {
            $this->departments = Department::where('institution_id', $institutionId)->pluck('id', 'name')->toArray();
        } catch (\Exception $e) {
            \Log::error('Failed to load departments: '.$e->getMessage());
            $this->departments = [];
        }
    }

    protected function validateRow($row): bool
    {
        try {
            return ! empty($row['name'])                             &&
                   ! empty($row['personnel_number'])                 &&
                   filter_var($row['email'], FILTER_VALIDATE_EMAIL)  &&
                   in_array($row['is_male'], [0, 1])                 &&
                   ! empty($row['department_id'])                    &&
                   in_array($row['is_active'], [Teacher::ACTIVE, Teacher::INACTIVE]);
        } catch (\Exception $e) {
            \Log::warning('Row validation failed: '.$e->getMessage());

            return false;
        }
    }

    protected function uniqueBy($row): array
    {
        return ['name' => $row['name'], 'email' => $row['email'], 'department_id' => $row['department_id']];
    }

    protected function mapRow($row): array
    {
        try {
            $departmentId = $this->departments[$row['department_id']] ?? null;

            if (! $departmentId && ! empty($row['department_id'])) {
                \Log::warning("Department '{$row['department_id']}' not found.");
            }

            return [
                'name'              => $row['name'],
                'personnel_number'  => $row['personnel_number'],
                'email'             => $row['email'],
                'cnic'              => $row['cnic']         ?? null,
                'phone_number'      => $row['phone_number'] ?? null,
                'bank_iban'         => $row['bank_iban']    ?? null,
                'is_male'           => $row['is_male'] === 'Male' ? 1 : 0,
                'date_of_birth'     => $row['date_of_birth'] ?? null,
                'father_name'       => $row['father_name']   ?? null,
                'department_id'     => $departmentId,
                'qualification'     => in_array($row['qualification'], ['MSc', 'BS(Hons)', 'MPhil', 'PhD'])
                    ? $row['qualification']
                    : 'MPhil',
                'highest_degree_awarding_institute' => $row['highest_degree_awarding_institute'] ?? null,
                'rank'                              => in_array($row['rank'], ['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor'])
                    ? $row['rank']
                    : 'Lecturer',
                'position'          => in_array($row['position'], ['HOD', 'Regular', 'Vice Principal', 'Principal'])
                    ? $row['position']
                    : 'Regular',
                'is_visiting'        => $row['is_visiting'] === 'Yes' ? 1 : 0,
                'is_active'          => $row['is_active']   === 'Active' ? 1 : 0,
                'created_at'         => now(),
                'updated_at'         => now(),
            ];
        } catch (\Exception $e) {
            \Log::error('Failed to map row: '.$e->getMessage());
            throw $e; // Re-throw to ensure import fails gracefully
        }
    }
}
