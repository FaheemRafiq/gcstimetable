<?php

namespace App\Exports\Templates;

use App\Models\Program;
use App\Imports\SemestersImport;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SemestersExport extends BaseExport
{
    protected string $importClass = SemestersImport::class;

    public function __construct(int $rows = 0)
    {
        parent::__construct($rows);
    }

    protected function getInstructionText(): string
    {
        return 'SEMESTER IMPORT TEMPLATE - Required fields marked with *';
    }

    protected function getSheetTitle(): string
    {
        return 'Semesters Import';
    }

    protected function getColumnWidth(string $header): float
    {
        return match (true) {
            str_contains($header, 'Name')         => 25,
            str_contains($header, 'Number')       => 12,
            str_contains($header, 'Is Active')    => 15,
            str_contains($header, 'Program')      => 30,
            default                               => 10,
        };
    }

    protected function setupColumnValidations(Worksheet $sheet): void
    {
        foreach ($this->headerMapping as $header => $field) {
            $columnIndex = array_search($header, array_keys($this->headerMapping)) + 1;
            $column      = Coordinate::stringFromColumnIndex($columnIndex);
            $programs    = Program::whereHas('department', function ($query) {
                $query->where('institution_id', getPermissionsTeamId());
            })->pluck('name')->toArray();

            try {
                match ($field) {
                    'number'      => $this->addNumberValidation($sheet, $column, 1, 8, false),
                    'is_active'   => $this->addDropdown($sheet, $column, ['Active', 'In-Active'], 'Is Active?', 'Active'),
                    'program_id'  => $this->addDropdown($sheet, $column, $programs, 'Select Program'),
                    default       => null,
                };
            } catch (\Exception $e) {
                Log::error("Failed to set validation for column {$column}: ".$e->getMessage());
            }
        }
    }

    protected function getCommentForField(string $field, string $header): ?string
    {
        return match ($field) {
            'name'       => 'Required: Semester name (e.g., Fall 2024)',
            'number'     => 'Required: Semester number (1-8)',
            'is_active'  => 'Required: Select semester status (Active/In-Active)',
            'program_id' => 'Required: Select the program this semester belongs to.',
            default      => null,
        };
    }
}
