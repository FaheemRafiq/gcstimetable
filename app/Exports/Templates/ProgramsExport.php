<?php

namespace App\Exports\Templates;

use App\Models\Program;
use App\Models\Department;
use App\Imports\ProgramsImport;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProgramsExport extends BaseExport
{
    protected string $importClass = ProgramsImport::class;

    public function __construct(int $rows = 0)
    {
        parent::__construct($rows);
    }

    protected function getInstructionText(): string
    {
        return 'PROGRAM IMPORT TEMPLATE - Required fields marked with *';
    }

    protected function getSheetTitle(): string
    {
        return 'Programs Import';
    }

    protected function getColumnWidth(string $header): float
    {
        return match (true) {
            str_contains($header, 'Name')       => 30,
            str_contains($header, 'Code')       => 15,
            str_contains($header, 'Duration')   => 12,
            str_contains($header, 'Type')       => 15,
            str_contains($header, 'Department') => 25,
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
                    'type'          => $this->addDropdown($sheet, $column, array_values(Program::TYPES), 'Select Program Type'),
                    'duration'      => $this->addNumberValidation($sheet, $column, 1, 10, false),
                    'department_id' => $this->addDropdown($sheet, $column, Department::where('institution_id', getPermissionsTeamId())->pluck('name')->toArray(), 'Select Department'),
                    default         => null,
                };
            } catch (\Exception $e) {
                Log::error("Failed to set validation for column {$column}: ".$e->getMessage());
            }
        }
    }

    protected function getCommentForField(string $field, string $header): ?string
    {
        return match ($field) {
            'name'          => 'Required: Full program name (e.g., Computer Science)',
            'code'          => 'Required: Unique program code (e.g., BSCS)',
            'duration'      => 'Required: Duration in years (default is 4)',
            'type'          => 'Required: Select program type from dropdown. Options: '.implode(', ', Program::TYPES),
            'department_id' => 'Required: Select the department offering this program.',
            default         => null,
        };
    }
}
