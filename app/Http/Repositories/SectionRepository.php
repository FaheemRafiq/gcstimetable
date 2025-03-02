<?php

namespace App\Http\Repositories;

use App\Models\Section;

class SectionRepository
{
    public function __construct(protected Section $model) {}

    public function getAll()
    {
        return $this->model->all();
    }

    public function getById($id)
    {
        return $this->model->whereKey($id)->get();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $section = $this->model->find($id);

        if ($section) {
            $section->update($data);

            return $section;
        }

        return null;
    }

    public function delete($id): bool
    {
        $section = $this->model->find($id);

        if ($section) {
            $section->delete();

            return true;
        }

        return false;
    }

    public function getAllByShiftId($shiftId, $sectionid = null)
    {
        return $this->model
            ->join('semesters', 'sections.semester_id', '=', 'semesters.id')
            ->join('programs', 'semesters.program_id', '=', 'programs.id')
            ->join('program_shift', 'programs.id', '=', 'program_shift.program_id') // Pivot table
            ->join('shifts', 'program_shift.shift_id', '=', 'shifts.id') // Join shifts through pivot
            ->where('shifts.id', $shiftId)
            ->when($sectionid, function ($query, $sectionid) {
                return $query->where('sections.id', $sectionid);
            })
            ->select([
                'sections.id',
                'sections.name',
                'semesters.id as SemesterId',
                'semesters.name as SemesterName',
                'semesters.number as SemesterNo',
                'programs.type as ProgramType',
            ])
            ->get();
    }
}
