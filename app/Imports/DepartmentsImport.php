<?php

namespace App\Imports;

use App\Models\Department;

class DepartmentsImport extends BaseImport
{
    protected $modelClass = Department::class;

    protected $headerMapping = [
        'Name'           => 'name',
        'Code'           => 'code',
    ];

    protected function validateRow($row): bool
    {
        return ! empty($row['name']) &&
               ! empty($row['code']) &&
               ! empty($row['institution_id']);
    }

    protected function uniqueBy($row): array
    {
        return ['code' => $row['code'], 'institution_id' => $row['institution_id']];
    }

    protected function mapRow($row): array
    {
        return [
            'name'           => $row['name'],
            'code'           => $row['code'],
            'institution_id' => getPermissionsTeamId(),
            'created_at'     => now(),
            'updated_at'     => now(),
        ];
    }
}
