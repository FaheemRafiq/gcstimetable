<?php

namespace App\Exports\Templates;

use App\Models\Department;
use App\Enums\TeacherRankEnum;
use App\Imports\TeachersImport;
use App\Enums\TeacherPositionEnum;
use Illuminate\Support\Facades\Log;
use App\Enums\TeacherQualificationEnum;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TeachersExport extends BaseExport
{
    protected string $importClass = TeachersImport::class;

    public function __construct(int $rows = 0)
    {
        parent::__construct($rows);
    }

    protected function getInstructionText(): string
    {
        return 'TEACHER IMPORT TEMPLATE - Required fields marked with *';
    }

    protected function getSheetTitle(): string
    {
        return 'Teachers Import';
    }

    protected function getColumnWidth(string $header): float
    {
        return match (true) {
            str_contains($header, 'Name') || str_contains($header, 'Email')    => 25,
            str_contains($header, 'Number')                                    => 20,
            str_contains($header, 'Gender') || str_contains($header, 'Status') => 10,
            default                                                            => 15,
        };
    }

    protected function setupColumnValidations(Worksheet $sheet): void
    {
        $institutionId = getPermissionsTeamId();

        foreach ($this->headerMapping as $header => $field) {
            $columnIndex = array_search($header, array_keys($this->headerMapping)) + 1;
            $column      = Coordinate::stringFromColumnIndex($columnIndex);

            try {
                match ($field) {
                    'is_male'        => $this->addDropdown($sheet, $column, ['Female', 'Male'], 'Select Gender'),
                    'department_id'  => $this->addDropdown($sheet, $column, $this->getDepartments($institutionId), 'Select Department'),
                    'qualification'  => $this->addDropdown($sheet, $column, array_column(TeacherQualificationEnum::cases(), 'value'), 'Select Qualification'),
                    'rank'           => $this->addDropdown($sheet, $column, array_column(TeacherRankEnum::cases(), 'value'), 'Select Rank'),
                    'position'       => $this->addDropdown($sheet, $column, array_column(TeacherPositionEnum::cases(), 'value'), 'Select Position'),
                    'is_visiting'    => $this->addDropdown($sheet, $column, ['No', 'Yes'], 'Select Visiting Status', 'Yes'),
                    'is_active'      => $this->addDropdown($sheet, $column, ['Active', 'Inactive'], 'Select Status', 'Active'),
                    'date_of_birth'  => $this->addDateValidation($sheet, $column),
                    default          => null,
                };
            } catch (\Exception $e) {
                Log::error("Failed to set validation for column {$column}: ".$e->getMessage());
            }
        }
    }

    protected function getCommentForField(string $field, string $header): ?string
    {
        return match ($field) {
            'name'                               => 'Required: Teacher\'s full name (First Last)',
            'personnel_number'                   => 'Required: Unique personnel/employee ID',
            'email'                              => 'Required: Institutional or personal email address',
            'cnic'                               => 'Optional: National ID card number without dashes',
            'phone_number'                       => 'Optional: Phone number with country code (e.g., +92...)',
            'bank_iban'                          => 'Optional: International Bank Account Number',
            'is_male'                            => 'Required: Select gender from dropdown',
            'date_of_birth'                      => 'Optional: Date in YYYY-MM-DD format',
            'father_name'                        => 'Optional: Teacher\'s father\'s name',
            'department_id'                      => 'Required: Select Department from dropdown',
            'qualification'                      => 'Optional: Select highest qualification from dropdown',
            'highest_degree_awarding_institute'  => 'Optional: Institute that awarded highest degree',
            'rank'                               => 'Optional: Academic rank (e.g., Professor, Lecturer)',
            'position'                           => 'Optional: Position held within department',
            'is_visiting'                        => 'Optional: Is this a visiting faculty member?',
            'is_active'                          => 'Required: Current employment status',
            default                              => null,
        };
    }

    private function getDepartments(?int $institutionId): array
    {
        if ($institutionId === null) {
            Log::warning('Institution ID not set for department dropdown.');

            return ['N/A'];
        }
        try {
            return Department::where('institution_id', $institutionId)->pluck('name')->toArray() ?: ['N/A'];
        } catch (\Exception $e) {
            Log::error('Failed to load departments: '.$e->getMessage());

            return ['N/A'];
        }
    }
}
