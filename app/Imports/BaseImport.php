<?php

namespace App\Imports;

use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use App\Exceptions\EmptyImportException;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

abstract class BaseImport implements ToCollection, WithHeadingRow, WithStartRow
{
    protected $modelClass;

    protected $headerMapping;

    public function collection(Collection $rows)
    {
        if ($rows->isEmpty() || empty($rows->first())) {
            throw new EmptyImportException;
        }

        $invalidRows = 1;

        foreach ($rows as $row) {
            $mapedRow = $this->mapRow($this->mapHeaders($row));

            if ($this->validateRow($mapedRow)) {
                $this->modelClass::updateOrCreate(
                    $this->uniqueBy($mapedRow),
                    $mapedRow
                );
            } else {
                $invalidRows++;
            }
        }

        if ($invalidRows === $rows->count()) {
            throw new EmptyImportException;
        }
    }

    abstract protected function mapRow($row): array;

    abstract protected function validateRow($row): bool;

    abstract protected function uniqueBy($row): array;

    public function headingRow(): int
    {
        return 2;
    }

    public function startRow(): int
    {
        return 3;
    }

    protected function mapHeaders($row): array
    {
        $mapped = [];

        foreach ($this->headerMapping as $csvColumn => $dbField) {
            foreach ($row as $actualColumn => $value) {
                if (Str::slug($csvColumn, '_') === Str::slug($actualColumn, '_')) {
                    $mapped[$dbField] = $value;
                }
            }
        }

        return $mapped;
    }

    public function getHeadingMap()
    {
        return $this->headerMapping;
    }
}
