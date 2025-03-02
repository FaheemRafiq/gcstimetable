<?php

namespace App\Exports\Templates;

use App\Models\Shift;
use App\Models\Program;
use App\Imports\ShiftsImport;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ShiftsExport extends BaseExport
{
    protected string $importClass = ShiftsImport::class;

    /**
     * Constructor for ShiftsExport
     *
     * @param  int  $rows  Number of rows to include in the template
     */
    public function __construct(int $rows = 0)
    {
        parent::__construct($rows);
    }

    /**
     * Get instruction text for the template
     */
    protected function getInstructionText(): string
    {
        return 'SHIFT IMPORT TEMPLATE - Required fields marked with *';
    }

    /**
     * Get sheet title for the template
     */
    protected function getSheetTitle(): string
    {
        return 'Shifts Import';
    }

    /**
     * Get column width based on header type
     */
    protected function getColumnWidth(string $header): float
    {
        return match (true) {
            str_contains($header, 'Name')                                        => 25,
            str_contains($header, 'Program Type')                                => 20,
            str_contains($header, 'Is Active') || str_contains($header, 'Type')  => 12,
            default                                                              => 10,
        };
    }

    /**
     * Setup column validations for the shifts template
     */
    protected function setupColumnValidations(Worksheet $sheet): void
    {
        foreach ($this->headerMapping as $header => $field) {
            $columnIndex = array_search($header, array_keys($this->headerMapping)) + 1;
            $column      = Coordinate::stringFromColumnIndex($columnIndex);

            try {
                match ($field) {
                    'type'         => $this->addDropdown($sheet, $column, array_keys(Shift::TYPES), 'Select Shift Type'),
                    'program_type' => $this->addDropdown($sheet, $column, array_keys(Program::TYPES), 'Select Program Type'),
                    'is_active'    => $this->addDropdown($sheet, $column, ['Active', 'In-Active'], 'Is Active?', 'Active'),
                    default        => null,
                };
            } catch (\Exception $e) {
                Log::error("Failed to set validation for column {$column}: ".$e->getMessage());
            }
        }
    }

    /**
     * Get comment for a specific field
     */
    protected function getCommentForField(string $field, string $header): ?string
    {
        return match ($field) {
            'name'         => 'Required: Full shift name (e.g., Evening Shift)',
            'type'         => 'Required: Select shift type from dropdown. Options: '.implode(', ', array_keys(Shift::TYPES)),
            'program_type' => 'Required: Select program type from dropdown. Options: '.implode(', ', array_keys(Program::TYPES)),
            'is_active'    => 'Required: Is this a default shift? Select Yes or No.',
            default        => null,
        };
    }
}
