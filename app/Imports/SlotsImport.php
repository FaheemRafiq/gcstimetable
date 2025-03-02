<?php

namespace App\Imports;

use App\Models\Slot;
use App\Models\Shift;

class SlotsImport extends BaseImport
{
    protected $modelClass = Slot::class;

    protected $headerMapping = [
        'Name*'         => 'name',
        'Code*'         => 'code',
        'Start Time*'   => 'start_time',
        'End Time*'     => 'end_time',
        'Is Practical*' => 'is_practical',
        'Shift*'        => 'shift_id',
    ];

    protected function validateRow($row): bool
    {
        return ! empty($row['name'])    &&
            ! empty($row['code'])       &&
            ! empty($row['start_time']) &&
            ! empty($row['end_time'])   &&
            ! empty($row['shift_id']);
    }

    protected function uniqueBy($row): array
    {
        return [
            'code'     => $row['code'],
            'shift_id' => $row['shift_id'],
        ];
    }

    protected function mapRow($row): array
    {
        $shift = Shift::where('name', $row['shift_id'])->where('institution_id', getPermissionsTeamId())->first();

        return [
            'name'         => $row['name'],
            'code'         => $row['code'],
            'start_time'   => $this->formatTime($row['start_time']),
            'end_time'     => $this->formatTime($row['end_time']),
            'is_practical' => $row['is_practical'] == 'Yes',
            'shift_id'     => $shift?->id ?? null,
            'created_at'   => now(),
            'updated_at'   => now(),
        ];
    }

    private function formatTime($time)
    {
        return \Carbon\Carbon::createFromFormat('H:i:s', $time)->format('H:i:s');
    }
}
