<?php

namespace App\Services;

use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use App\Exceptions\EmptyImportException;

class ImportService
{
    public array $imports =  [
        'departments' => \App\Imports\DepartmentsImport::class,
        'shifts'      => \App\Imports\ShiftsImport::class,
        'shift_slots' => \App\Imports\SlotsImport::class,
        'courses'     => \App\Imports\CoursesImport::class,
        'teachers'    => \App\Imports\TeachersImport::class,
        'rooms'       => \App\Imports\RoomsImport::class,
        'programs'    => \App\Imports\ProgramsImport::class,
        'semesters'   => \App\Imports\SemestersImport::class,
    ];

    public array $exports = [
        'departments' => \App\Exports\Templates\DepartmentsExport::class,
        'shifts'      => \App\Exports\Templates\ShiftsExport::class,
        'shift_slots' => \App\Exports\Templates\SlotsExport::class,
        'courses'     => \App\Exports\Templates\CoursesExport::class,
        'teachers'    => \App\Exports\Templates\TeachersExport::class,
        'rooms'       => \App\Exports\Templates\RoomsExport::class,
        'programs'    => \App\Exports\Templates\ProgramsExport::class,
        'semesters'   => \App\Exports\Templates\SemestersExport::class,
    ];

    /**
     * Process file import.
     *
     * @param  \Illuminate\Http\UploadedFile  $file
     */
    public function import(string $table, $file): array
    {
        $filePath = $file->store('temp'); // Temporarily store the file
        $fullPath = storage_path('app/'.$filePath);

        try {
            $exportClass = app($this->exports[$table]);

            if (! $exportClass->validateTemplate($fullPath)) {
                Storage::delete($filePath);

                return ['error' => 'The uploaded file does not match the expected template.'];
            }

            Excel::import(app()->make($this->imports[$table]), $file);

            return ['success' => "Successfully imported {$table}."];
        } catch (EmptyImportException $e) {
            return ['error' => $e->getMessage()];
        } catch (\Exception $e) {
            return ['error' => "Import failed: {$e->getMessage()}"];
        } finally {
            Storage::delete($filePath); // Clean up the temp file
        }
    }

    /**
     * Export a template for a specific table.
     *
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function exportTemplate(string $table, ?int $numberRows = null)
    {
        $exportClass = app()->makeWith($this->exports[$table], $numberRows ? ['rows' => $numberRows] : []);

        return Excel::download($exportClass, "{$table}_template.xlsx");
    }
}
