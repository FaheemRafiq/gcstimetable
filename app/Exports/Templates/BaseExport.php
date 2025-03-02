<?php

namespace App\Exports\Templates;

use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\FromArray;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Protection;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

abstract class BaseExport implements FromArray, WithEvents, WithHeadings, WithStyles
{
    protected int $numberRows = 100;

    protected array $headerMapping;

    protected string $importClass;

    /**
     * Constructor for BaseExport
     *
     * @param  int  $rows  Number of rows to include in the template (0 means use default)
     *
     * @throws \Exception If importClass is not defined
     */
    public function __construct(int $rows = 0)
    {
        if (empty($this->importClass)) {
            throw new \Exception('The importClass property must be defined in the subclass.');
        }

        if ($rows > 0) {
            $this->numberRows = $rows + 2;
        }

        $importInstance = app($this->importClass);

        if (! method_exists($importInstance, 'getHeadingMap')) {
            throw new \Exception('The import class must implement getHeadingMap() method.');
        }

        $this->headerMapping = $importInstance->getHeadingMap();

        if (empty($this->headerMapping)) {
            throw new \Exception('Header mapping cannot be empty.');
        }
    }

    /**
     * Get the column headings for the export
     */
    public function headings(): array
    {
        return array_keys($this->headerMapping);
    }

    /**
     * Get the data for the export
     * Templates are empty by default
     */
    public function array(): array
    {
        return []; // Empty array for templates
    }

    /**
     * Apply styles to the worksheet
     */
    public function styles(Worksheet $sheet): array
    {
        $lastColumn = Coordinate::stringFromColumnIndex(count($this->headerMapping));

        return [
            2 => [
                'font' => [
                    'bold'  => true,
                    'size'  => 12,
                    'name'  => 'Arial',
                    'color' => ['argb' => 'FFFFFFFF'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical'   => Alignment::VERTICAL_CENTER,
                ],
                'fill' => [
                    'fillType'   => Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FF4472C4'],
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color'       => ['argb' => 'FF999999'],
                    ],
                    'bottom' => [
                        'borderStyle' => Border::BORDER_MEDIUM,
                        'color'       => ['argb' => 'FF666666'],
                    ],
                ],
            ],
            "A3:{$lastColumn}{$this->numberRows}" => [
                'font' => [
                    'color' => ['argb' => 'FF000000'],
                    'name'  => 'Arial',
                    'size'  => 11,
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color'       => ['argb' => 'FFD9D9D9'],
                    ],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_LEFT,
                    'vertical'   => Alignment::VERTICAL_TOP,
                ],
            ],
        ];
    }

    /**
     * Register events for the export
     */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $this->configureWorksheet($sheet);
            },
        ];
    }

    /**
     * Configure the worksheet with all styling and validation
     */
    protected function configureWorksheet(Worksheet $sheet): void
    {
        $lastColumn = Coordinate::stringFromColumnIndex(count($this->headerMapping));

        // Add instruction row
        $this->addInstructionRow($sheet, $lastColumn);

        // Freeze panes
        $sheet->freezePane('A3');

        // Set column widths
        $this->setColumnWidths($sheet);

        // Protect sheet
        $this->protectSheet($sheet, $lastColumn);

        // Add footer
        $this->addFooter($sheet, $lastColumn);

        // Apply alternating row colors
        $this->applyAlternatingRowColors($sheet, $lastColumn);

        // Add validations and comments
        $this->setupColumnValidations($sheet);
        $this->addCommentsAndHighlights($sheet);

        // Add color key
        $this->addColorKey($sheet);

        // Reset row 3 styles to ensure consistency
        $this->resetRowStyles($sheet, $lastColumn);

        // Set sheet title
        $sheet->setTitle($this->getSheetTitle());
    }

    /**
     * Add instruction row to the worksheet
     */
    protected function addInstructionRow(Worksheet $sheet, string $lastColumn): void
    {
        $sheet->insertNewRowBefore(1);
        $sheet->mergeCells("A1:{$lastColumn}1");
        $sheet->setCellValue('A1', $this->getInstructionText());
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold'  => true,
                'size'  => 14,
                'color' => ['argb' => 'FFFFFFFF'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical'   => Alignment::VERTICAL_CENTER,
            ],
            'fill' => [
                'fillType'   => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FF203764'],
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color'       => ['argb' => 'FF999999'],
                ],
            ],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(35);
    }

    /**
     * Set column widths based on content type
     */
    protected function setColumnWidths(Worksheet $sheet): void
    {
        foreach (array_keys($this->headerMapping) as $index => $header) {
            $column = Coordinate::stringFromColumnIndex($index + 1);
            $sheet->getColumnDimension($column)->setWidth($this->getColumnWidth($header));
        }
    }

    /**
     * Protect the worksheet but allow data entry
     */
    protected function protectSheet(Worksheet $sheet, string $lastColumn): void
    {
        $sheet->getProtection()->setSheet(true);
        $sheet->getStyle("A3:{$lastColumn}{$this->numberRows}")->getProtection()->setLocked(Protection::PROTECTION_UNPROTECTED);
    }

    /**
     * Add footer to the worksheet
     */
    protected function addFooter(Worksheet $sheet, string $lastColumn): void
    {
        $lastRow = $this->numberRows + 2;
        $sheet->mergeCells("A{$lastRow}:{$lastColumn}{$lastRow}");
        $sheet->setCellValue("A{$lastRow}", 'Note: Please do not modify the header row or column structure. Fill in all required fields marked with *.');
        $sheet->getStyle("A{$lastRow}")->applyFromArray([
            'font' => [
                'italic' => true,
                'size'   => 11,
                'color'  => ['argb' => 'FF333333'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_LEFT,
            ],
            'fill' => [
                'fillType'   => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFEEEEEE'],
            ],
        ]);
    }

    /**
     * Apply alternating row colors
     */
    protected function applyAlternatingRowColors(Worksheet $sheet, string $lastColumn): void
    {
        for ($i = 3; $i <= $this->numberRows; $i += 2) {
            $sheet->getStyle("A{$i}:{$lastColumn}{$i}")->applyFromArray([
                'fill' => [
                    'fillType'   => Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FFF5F5F5'],
                ],
                'font' => [
                    'color' => ['argb' => 'FF000000'],
                    'name'  => 'Arial',
                    'size'  => 11,
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_LEFT,
                    'vertical'   => Alignment::VERTICAL_TOP,
                ],
            ]);
        }
    }

    /**
     * Add color key to explain required vs optional fields
     */
    protected function addColorKey(Worksheet $sheet): void
    {
        $keyRow = $this->numberRows + 4;
        $sheet->setCellValue("A{$keyRow}", 'Color Key:');
        $sheet->setCellValue("B{$keyRow}", 'Required Fields');
        $sheet->getStyle("B{$keyRow}")->applyFromArray($this->getRequiredStyles());
        $sheet->setCellValue("C{$keyRow}", 'Optional Fields');
        $sheet->getStyle("C{$keyRow}")->applyFromArray($this->getOptionalStyles());
    }

    /**
     * Reset row styles for consistency
     */
    protected function resetRowStyles(Worksheet $sheet, string $lastColumn): void
    {
        $sheet->getStyle("A3:{$lastColumn}3")->applyFromArray([
            'font' => [
                'color' => ['argb' => 'FF000000'],
                'name'  => 'Arial',
                'size'  => 11,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_LEFT,
                'vertical'   => Alignment::VERTICAL_TOP,
            ],
            'fill' => [
                'fillType'   => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFF5F5F5'],
            ],
        ]);
    }

    /**
     * Get styles for required fields
     */
    protected function getRequiredStyles(): array
    {
        return [
            'fill' => [
                'fillType'   => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FF2F5597'],
            ],
            'font' => [
                'color' => ['argb' => 'FFFFFFFF'],
            ],
        ];
    }

    /**
     * Get styles for optional fields
     */
    protected function getOptionalStyles(): array
    {
        return [
            'fill' => [
                'fillType'   => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FF4472C4'],
            ],
            'font' => [
                'color' => ['argb' => 'FFFFFFFF'],
            ],
        ];
    }

    /**
     * Add dropdown validation to a column
     */
    protected function addDropdown(Worksheet $sheet, string $column, array $options, string $promptTitle, ?string $defaultValue = null): void
    {
        if ($defaultValue !== null && ! in_array($defaultValue, $options, true)) {
            Log::warning("Invalid default value '{$defaultValue}' for column {$column}. Ignoring.");
            $defaultValue = null;
        }

        if ($defaultValue !== null) {
            for ($row = 3; $row <= $this->numberRows; $row++) {
                $sheet->setCellValue("{$column}{$row}", $defaultValue);
            }
        }

        $validation = $sheet->getCell("{$column}3")->getDataValidation();
        $validation->setType(DataValidation::TYPE_LIST);
        $validation->setErrorStyle(DataValidation::STYLE_STOP);
        $validation->setAllowBlank(true);
        $validation->setShowDropDown(true);
        $validation->setShowInputMessage(true);
        $validation->setShowErrorMessage(true);
        $validation->setPromptTitle($promptTitle);
        $validation->setPrompt('Choose from the list');
        $validation->setErrorTitle('Invalid Input');
        $validation->setError('Please select a valid option from the dropdown.');
        $validation->setFormula1('"'.implode(',', $options).'"');
        $sheet->setDataValidation("{$column}3:{$column}{$this->numberRows}", $validation);
    }

    /**
     * Add date validation to a column
     */
    protected function addDateValidation(Worksheet $sheet, string $column, ?string $minDate = null, ?string $maxDate = null): void
    {
        $minDate = $minDate ?? '1900-01-01';
        $maxDate = $maxDate ?? (date('Y') + 1).'-12-31';

        $validation = $sheet->getCell("{$column}3")->getDataValidation();
        $validation->setType(DataValidation::TYPE_DATE);
        $validation->setErrorStyle(DataValidation::STYLE_STOP);
        $validation->setAllowBlank(true);
        $validation->setShowInputMessage(true);
        $validation->setShowErrorMessage(true);
        $validation->setPromptTitle('Date Format');
        $validation->setPrompt('Enter date in YYYY-MM-DD format');
        $validation->setErrorTitle('Invalid Date');
        $validation->setError('Please enter a valid date in YYYY-MM-DD format.');
        $validation->setFormula1(Date::PHPToExcel($minDate));
        $validation->setFormula2(Date::PHPToExcel($maxDate));
        $sheet->setDataValidation("{$column}3:{$column}{$this->numberRows}", $validation);
    }

    /**
     * Add number validation to a column
     */
    protected function addNumberValidation(Worksheet $sheet, string $column, ?float $min = null, ?float $max = null, bool $allowDecimal = true): void
    {
        $validation = $sheet->getCell("{$column}3")->getDataValidation();
        $validation->setType($allowDecimal ? DataValidation::TYPE_DECIMAL : DataValidation::TYPE_WHOLE);
        $validation->setErrorStyle(DataValidation::STYLE_STOP);
        $validation->setAllowBlank(true);
        $validation->setShowInputMessage(true);
        $validation->setShowErrorMessage(true);
        $validation->setPromptTitle('Number Input');
        $validation->setPrompt($allowDecimal ? 'Enter a decimal number' : 'Enter a whole number');
        $validation->setErrorTitle('Invalid Number');
        $validation->setError($allowDecimal ? 'Please enter a valid decimal number.' : 'Please enter a valid whole number.');

        if ($min !== null) {
            $validation->setFormula1($min);
        }

        if ($max !== null) {
            $validation->setFormula2($max);
        }

        $sheet->setDataValidation("{$column}3:{$column}{$this->numberRows}", $validation);
    }

    /**
     * Add a comment to a cell
     */
    protected function addComment(Worksheet $sheet, string $cell, string $text): void
    {
        $comment = $sheet->getComment($cell);
        $comment->getText()->createTextRun($text);
        $comment->setWidth('200pt');
        $comment->setHeight('100pt');
    }

    /**
     * Add comments and highlights to columns based on required/optional status
     */
    protected function addCommentsAndHighlights(Worksheet $sheet): void
    {
        foreach ($this->headerMapping as $header => $field) {
            $columnIndex = array_search($header, array_keys($this->headerMapping)) + 1;
            $column      = Coordinate::stringFromColumnIndex($columnIndex);
            $cell        = "{$column}2";

            $comment = $this->getCommentForField($field, $header);

            if ($comment) {
                $this->addComment($sheet, $cell, $comment);
            }

            $isRequired = str_ends_with($header, '*');
            $styles     = $isRequired ? $this->getRequiredStyles() : $this->getOptionalStyles();
            $sheet->getStyle($cell)->applyFromArray($styles);
        }
    }

    /**
     * Get column width based on header type
     */
    protected function getColumnWidth(string $header): float
    {
        return match (true) {
            str_contains($header, 'Name') => 25,
            default                       => 20,
        };
    }

    /**
     * Validate if the uploaded file matches the expected Teachers template
     *
     * @param  string  $filePath  Path to the uploaded .xlsx file
     *
     * @throws \Exception
     */
    public function validateTemplate(string $filePath): bool
    {
        try {
            // Load the uploaded spreadsheet
            $spreadsheet = IOFactory::load($filePath);
            $sheet       = $spreadsheet->getSheetByName($this->getSheetTitle());

            // Check if the expected sheet exists
            if (! $sheet) {
                Log::warning("Template validation failed: Sheet '{$this->getSheetTitle()}' not found.");

                return false;
            }

            // Get the expected headers from the export class
            $expectedHeaders = $this->headings();

            // Get the headers from the uploaded file (assuming row 2 as per your template)
            $uploadedHeaders = [];
            $highestColumn   = $sheet->getHighestColumn();
            $columnCount     = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($highestColumn);

            for ($col = 1; $col <= $columnCount; $col++) {
                $cellValue = $sheet->getCell(Coordinate::stringFromColumnIndex($col).'2')->getValue();

                if ($cellValue !== null) { // Only include non-empty cells
                    $uploadedHeaders[] = trim((string) $cellValue);
                }
            }

            // Compare headers
            if ($uploadedHeaders !== $expectedHeaders) {
                Log::warning('Template validation failed: Headers do not match.', [
                    'expected' => $expectedHeaders,
                    'uploaded' => $uploadedHeaders,
                ]);

                return false;
            }

            // Additional checks (optional)
            // 1. Check instruction row (row 1)
            $instructionCell = $sheet->getCell('A1')->getValue();

            if (trim((string) $instructionCell) !== $this->getInstructionText()) {
                Log::warning('Template validation failed: Instruction text mismatch.');

                return false;
            }

            // 2. Check if sheet is protected (optional)
            if (! $sheet->getProtection()->getSheet()) {
                Log::warning('Template validation failed: Sheet protection not enabled.');

                return false;
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Error validating template: '.$e->getMessage());

            return false;
        }
    }

    /**
     * Get instruction text for the template
     */
    abstract protected function getInstructionText(): string;

    /**
     * Get sheet title for the template
     */
    abstract protected function getSheetTitle(): string;

    /**
     * Setup column validations
     */
    abstract protected function setupColumnValidations(Worksheet $sheet): void;

    /**
     * Get comment for a specific field
     */
    abstract protected function getCommentForField(string $field, string $header): ?string;
}
