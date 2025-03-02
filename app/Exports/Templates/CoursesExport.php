<?php

namespace App\Exports\Templates;

use App\Models\Course;
use App\Imports\CoursesImport;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CoursesExport extends BaseExport
{
    protected string $importClass = CoursesImport::class;

    /**
     * Constructor for CoursesExport
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
        return 'COURSE IMPORT TEMPLATE - Required fields marked with *';
    }

    /**
     * Get sheet title for the template
     */
    protected function getSheetTitle(): string
    {
        return 'Courses Import';
    }

    /**
     * Get column width based on header type
     */
    protected function getColumnWidth(string $header): float
    {
        return match (true) {
            str_contains($header, 'Name')                                   => 25,
            str_contains($header, 'Code')                                   => 15,
            str_contains($header, 'Hours') || str_contains($header, 'Type') => 12,
            default                                                         => 10,
        };
    }

    /**
     * Setup column validations for the Courses template
     */
    protected function setupColumnValidations(Worksheet $sheet): void
    {
        foreach ($this->headerMapping as $header => $field) {
            $columnIndex = array_search($header, array_keys($this->headerMapping)) + 1;
            $column      = Coordinate::stringFromColumnIndex($columnIndex);

            try {
                match ($field) {
                    'type'         => $this->addDropdown($sheet, $column, array_keys(Course::TYPES), 'Select Course Type'),
                    'is_default'   => $this->addDropdown($sheet, $column, ['No', 'Yes'], 'Is Default Course?', 'No'),
                    'credit_hours' => $this->addNumberValidation($sheet, $column, 0, 20, false),
                    'code'         => $this->setupCodeValidation($sheet, $column),
                    default        => null,
                };
            } catch (\Exception $e) {
                Log::error("Failed to set validation for column {$column}: ".$e->getMessage());
            }
        }
    }

    /**
     * Setup special validation for course code
     */
    private function setupCodeValidation(Worksheet $sheet, string $column): void
    {
        $validation = $sheet->getCell("{$column}3")->getDataValidation();
        $validation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_CUSTOM);
        $validation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_STOP);
        $validation->setAllowBlank(false);
        $validation->setShowInputMessage(true);
        $validation->setShowErrorMessage(true);
        $validation->setPromptTitle('Course Code');
        $validation->setPrompt('Enter a unique course code (e.g., CS101)');
        $validation->setErrorTitle('Invalid Code');
        $validation->setError('Course code must be 2-10 characters.');
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
            'code'         => 'Required: Unique course code (e.g., CS101). Must be 2-10 characters.',
            'name'         => 'Required: Full course name (e.g., Introduction to Programming)',
            'credit_hours' => 'Required: Number of credit hours (e.g., 3). Must be a whole number.',
            'display_code' => 'Required: Display code for course (e.g., CS-101)',
            'type'         => 'Required: Select course type from dropdown. Options: '.implode(', ', array_keys(Course::TYPES)),
            'is_default'   => 'Required: Is this a default course? Select Yes or No.',
            default        => null,
        };
    }
}
