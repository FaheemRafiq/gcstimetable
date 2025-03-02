<?php

namespace App\Imports;

use App\Models\Room;

class RoomsImport extends BaseImport
{
    protected $modelClass = Room::class;

    protected $headerMapping = [
        'Name*'             => 'name',
        'Code*'             => 'code',
        'Capacity*'         => 'capacity',
        'Is Available*'     => 'is_available',
        'Type*'             => 'type',
    ];

    protected function validateRow($row): bool
    {
        return ! empty($row['name'])          &&
            ! empty($row['code'])             &&
            ! empty($row['capacity'])         &&
            ! empty($row['is_available'])     &&
            ! empty($row['type'])             &&
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
            'code'           => $row['code'],
            'capacity'       => $row['capacity'],
            'is_available'   => $row['is_available'] == 'Yes',
            'type'           => in_array($row['type'], Room::TYPES) ? $row['type'] : 'INTER',
            'institution_id' => getPermissionsTeamId(),
            'created_at'     => now(),
            'updated_at'     => now(),
        ];
    }
}
