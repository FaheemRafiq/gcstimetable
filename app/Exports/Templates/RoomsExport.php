<?php

namespace App\Exports\Templates;

use App\Models\Room;
use App\Imports\RoomsImport;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RoomsExport extends BaseExport
{
    protected string $importClass = RoomsImport::class;

    /**
     * Constructor for RoomsExport
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
        return 'ROOM IMPORT TEMPLATE - Required fields marked with *';
    }

    /**
     * Get sheet title for the template
     */
    protected function getSheetTitle(): string
    {
        return 'Rooms Import';
    }

    /**
     * Get column width based on header type
     */
    protected function getColumnWidth(string $header): float
    {
        return match (true) {
            str_contains($header, 'Name')                                       => 25,
            str_contains($header, 'Code')                                       => 15,
            str_contains($header, 'Capacity') || str_contains($header, 'Type')  => 12,
            default                                                             => 10,
        };
    }

    /**
     * Setup column validations for the Rooms template
     */
    protected function setupColumnValidations(Worksheet $sheet): void
    {
        foreach ($this->headerMapping as $header => $field) {
            $columnIndex = array_search($header, array_keys($this->headerMapping)) + 1;
            $column      = Coordinate::stringFromColumnIndex($columnIndex);

            try {
                match ($field) {
                    'type'         => $this->addDropdown($sheet, $column, Room::TYPES, 'Select Room Type'),
                    'code'         => $this->setupCodeValidation($sheet, $column),
                    'capacity'     => $this->addNumberValidation($sheet, $column, 1, 100, false),
                    'is_available' => $this->addDropdown($sheet, $column, ['Yes', 'No'], 'Is Available?', 'Yes'),
                    default        => null,
                };
            } catch (\Exception $e) {
                Log::error("Failed to set validation for column {$column}: ".$e->getMessage());
            }
        }
    }

    /**
     * Setup special validation for room code
     */
    private function setupCodeValidation(Worksheet $sheet, string $column): void
    {
        $validation = $sheet->getCell("{$column}3")->getDataValidation();
        $validation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_CUSTOM);
        $validation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_STOP);
        $validation->setAllowBlank(false);
        $validation->setShowInputMessage(true);
        $validation->setShowErrorMessage(true);
        $validation->setPromptTitle('Room Code');
        $validation->setPrompt('Enter a unique room code (e.g., R101)');
        $validation->setErrorTitle('Invalid Code');
        $validation->setError('Room code must be 2-10 characters.');
        // Formula to ensure code is 2-10 characters
        $validation->setFormula1('AND(LEN('.$column.'3)>=2,LEN('.$column.'3)<=10)');
        $sheet->setDataValidation("{$column}3:{$column}{$this->numberRows}", $validation);
    }

    /**
     * Get comment for a specific field
     */
    protected function getCommentForField(string $field, string $header): ?string
    {
        return match ($field) {
            'name'         => 'Required: Full room name (e.g., Room 101)',
            'code'         => 'Required: Unique room code (e.g., CS101). Must be 2-10 characters.',
            'capacity'     => 'Required: Number of capacity (e.g., 30). Must be a whole number.',
            'is_available' => 'Required: Is this a default room? Select Yes or No.',
            'type'         => 'Required: Select room type from dropdown. Options: '.implode(', ', Room::TYPES),
            default        => null,
        };
    }
}
