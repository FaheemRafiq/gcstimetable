<?php

namespace App\Imports;

use App\Models\Shift;
use App\Models\Program;

class ShiftsImport extends BaseImport
{
    protected $modelClass = Shift::class;

    protected $headerMapping = [
        'Name*'             => 'name',
        'Type*'             => 'type',
        'Program Type*'     => 'program_type',
        'Is Active*'        => 'is_active',
    ];

    protected function validateRow($row): bool
    {
        return ! empty($row['name'])          &&
            ! empty($row['type'])             &&
            ! empty($row['program_type'])     &&
            ! empty($row['is_active']);
    }

    protected function uniqueBy($row): array
    {
        return [
            'name'           => $row['name'],
            'program_type'   => $row['program_type'],
        ];
    }

    protected function mapRow($row): array
    {
        return [
            'name'           => $row['name'],
            'type'           => in_array($row['type'], array_keys(Shift::TYPES)) ? $row['type'] : 'Morning',
            'is_active'      => $row['is_active'] === 'Active' ? Shift::ACTIVE : Shift::INACTIVE,
            'program_type'   => in_array($row['program_type'], array_keys(Program::TYPES)) ? $row['type'] : 'INTER',
            'institution_id' => getPermissionsTeamId(),
            'created_at'     => now(),
            'updated_at'     => now(),
        ];
    }
}
