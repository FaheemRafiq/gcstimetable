<?php

namespace App\Exports\Templates;

use App\Models\Shift;
use App\Imports\SlotsImport;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SlotsExport extends BaseExport
{
    protected string $importClass = SlotsImport::class;

    public function __construct(int $rows = 0)
    {
        parent::__construct($rows);
    }

    protected function getInstructionText(): string
    {
        return 'SLOT IMPORT TEMPLATE - Required fields marked with *';
    }

    protected function getSheetTitle(): string
    {
        return 'Slots Import';
    }

    protected function getColumnWidth(string $header): float
    {
        return match (true) {
            str_contains($header, 'Name')       => 25,
            str_contains($header, 'Code')       => 15,
            str_contains($header, 'Start') ||
            str_contains($header, 'End')        => 18,
            str_contains($header, 'Practical')  => 12,
            default                             => 10,
        };
    }

    protected function setupColumnValidations(Worksheet $sheet): void
    {
        foreach ($this->headerMapping as $header => $field) {
            $columnIndex = array_search($header, array_keys($this->headerMapping)) + 1;
            $column      = Coordinate::stringFromColumnIndex($columnIndex);

            try {
                match ($field) {
                    'shift_id'     => $this->addDropdown($sheet, $column, Shift::where('institution_id', getPermissionsTeamId())->pluck('name')->toArray(), 'Select Shift'),
                    'is_practical' => $this->addDropdown($sheet, $column, ['Yes', 'No'], 'Is Practical?', 'No'),
                    'start_time', 'end_time' => $this->setupTimeValidation($sheet, $column),
                    default       => null,
                };
            } catch (\Exception $e) {
                Log::error("Failed to set validation for column {$column}: ".$e->getMessage());
            }
        }
    }

    private function setupTimeValidation(Worksheet $sheet, string $column): void
    {
        $validation = $sheet->getCell("{$column}3")->getDataValidation();
        $validation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_CUSTOM);
        $validation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_STOP);
        $validation->setAllowBlank(false);
        $validation->setShowInputMessage(true);
        $validation->setShowErrorMessage(true);
        $validation->setPromptTitle('Time Format');
        $validation->setPrompt('Enter time in HH:MM:SS format');
        $validation->setErrorTitle('Invalid Time');
        $validation->setError('Time must be in HH:MM:SS format.');
        $validation->setFormula1('AND(ISNUMBER(SEARCH(":",'.$column.'3)),LEN('.$column.'3)=8)');
        $sheet->setDataValidation("{$column}3:{$column}{$this->numberRows}", $validation);
    }

    protected function getCommentForField(string $field, string $header): ?string
    {
        return match ($field) {
            'name'         => 'Required: Full slot name (e.g., Morning Slot)',
            'code'         => 'Required: Unique slot code (e.g., S101)',
            'start_time'   => 'Required: Start time in HH:MM:SS format',
            'end_time'     => 'Required: End time in HH:MM:SS format',
            'is_practical' => 'Required: Is this a practical slot? Select Yes or No.',
            'shift_id'     => 'Required: Select the shift for this slot.',
            default        => null,
        };
    }
}
