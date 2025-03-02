<?php

namespace App\Imports;

use App\Models\Program;
use App\Models\Department;

class ProgramsImport extends BaseImport
{
    protected $modelClass = Program::class;

    protected $headerMapping = [
        'Name*'        => 'name',
        'Code*'        => 'code',
        'Duration*'    => 'duration',
        'Type*'        => 'type',
        'Department*'  => 'department_id',
    ];

    protected function validateRow($row): bool
    {
        return ! empty($row['name'])  &&
            ! empty($row['code'])     &&
            ! empty($row['duration']) &&
            ! empty($row['type'])     &&
            ! empty($row['department_id']);
    }

    protected function uniqueBy($row): array
    {
        return [
            'code'          => $row['code'],
            'department_id' => $row['department_id'],
        ];
    }

    protected function mapRow($row): array
    {
        $department = Department::where('name', $row['department_id'])
            ->where('institution_id', getPermissionsTeamId())
            ->first();

        return [
            'name'          => $row['name'],
            'code'          => $row['code'],
            'duration'      => (int) $row['duration'],
            'type'          => in_array($row['type'], Program::TYPES) ? $row['type'] : 'BS',
            'department_id' => $department?->id ?? null,
            'created_at'    => now(),
            'updated_at'    => now(),
        ];
    }
}
