<?php

namespace App\Imports;

use App\Models\Day;
use App\Models\Program;
use App\Models\Semester;

class SemestersImport extends BaseImport
{
    protected $modelClass = Semester::class;

    protected $headerMapping = [
        'Name*'       => 'name',
        'Number*'     => 'number',
        'Is Active*'  => 'is_active',
        'Program*'    => 'program_id',
    ];

    protected function validateRow($row): bool
    {
        return ! empty($row['name'])   &&
            ! empty($row['number'])    &&
            ! empty($row['is_active']) &&
            ! empty($row['program_id']);
    }

    protected function uniqueBy($row): array
    {
        return [
            'number'     => $row['number'],
            'program_id' => $row['program_id'],
        ];
    }

    protected function mapRow($row): array
    {
        $program = null;

        if (isset($row['program_id'])) {
            $program = Program::query()->whereHas('department', function ($query) {
                $query->where('institution_id', getPermissionsTeamId());
            })
                ->where('name', $row['program_id'])
                ->first();
        }

        return [
            'name'       => $row['name'],
            'number'     => (int) $row['number'],
            'is_active'  => in_array($row['is_active'], [Day::ACTIVE, Day::INACTIVE]) ? $row['is_active'] : Day::ACTIVE,
            'program_id' => $program?->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
