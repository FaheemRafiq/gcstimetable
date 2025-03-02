<?php

namespace App\Imports;

use App\Models\Course;

class CoursesImport extends BaseImport
{
    protected $modelClass = Course::class;

    protected $headerMapping = [
        'Course Code*'      => 'code',
        'Course Name*'      => 'name',
        'Credit Hours*'     => 'credit_hours',
        'Display Code*'     => 'display_code',
        'Type*'             => 'type',
        'Is Default*'       => 'is_default',
    ];

    protected function validateRow($row): bool
    {
        return ! empty($row['name'])         &&
               ! empty($row['display_code']) &&
               ! empty($row['code'])         &&
               ! empty($row['institution_id']);
    }

    protected function uniqueBy($row): array
    {
        return [
            'code'           => $row['code'],
            'institution_id' => $row['institution_id'],
        ];
    }

    protected function mapRow($row): array
    {
        return [
            'name'           => $row['name'],
            'is_default'     => $row['is_default'] ?? 0,
            'display_code'   => $row['display_code'],
            'code'           => $row['code'],
            'credit_hours'   => $row['credit_hours'] ?? 3,
            'type'           => in_array($row['type'], ['CLASS', 'LAB']) ? $row['type'] : 'CLASS',
            'institution_id' => getPermissionsTeamId(),
            'created_at'     => now(),
            'updated_at'     => now(),
        ];
    }
}
