<?php

namespace App\Http\Controllers\Admin;

use App\Models\Room;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Shift;
use App\Models\Course;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Semester;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Display the dashboard page.
     */
    public function index(): \Inertia\Response
    {
        /** @var \App\Models\User $admin */
        $admin         = Auth::user();
        $institutionId = null;
        $departmentId  = null;

        if ($admin->isInstitutionAdmin()) {
            $institutionId = $admin->institution_id;
        }

        if ($admin->isDepartmentAdmin()) {
            $departmentId = $admin->department_id;
        }

        $statistics = (function () use ($institutionId, $departmentId, $admin): array {
            $userQuery = User::query()
            ->when($institutionId, function ($query, $institutionId): void {
                $query->whereInstitution($institutionId);
            })
            ->when($departmentId, function ($query, $departmentId): void {
                $query->whereDepartment($departmentId);
            });

            $studentQuery = Student::query()
            ->when($admin->isInstitutionAdmin() || $admin->isDepartmentAdmin(), function ($query) use ($admin): void {
                $query->where('institution_id', $admin->institution_id);
            });

            $teacherQuery = Teacher::query()
            ->when($institutionId, function ($query, $institutionId): void {
                $query->whereHas('institution', function ($query) use ($institutionId): void {
                $query->where('institutions.id', $institutionId);
                });
            })
            ->when($departmentId, function ($query, $departmentId): void {
                $query->where('department_id', $departmentId);
            });

            return [
            'users'    => $userQuery->count(),
            'students' => $studentQuery->count(),
            'teachers' => $teacherQuery->count(),
            ];
        })();

        return Inertia::render('Admin/Dashboard/index', [
            'statistics'         => $statistics,
            'courseTypes'        => $this->getCourseTypes(),
            'shiftCoverage'      => $this->getShiftCoverage(),
            'teacherWorkload'    => $this->getTeacherWorkload(),
            'roomUtilization'    => $this->getRoomUtilization(),
            'studentEnrollment'  => $this->getStudentEnrollment(),
            'semesterProgress'   => $this->getSemesterProgress(),
        ]);
    }

    protected function getCourseTypes()
    {
        return Course::selectRaw('type, count(*) as count')
            ->groupBy('type')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->type => $item->count]);
    }

    protected function getShiftCoverage()
    {
        return Shift::withCount(['slots', 'allocations'])
            ->get()
            ->map(fn ($shift): array => [
                'shift'       => $shift->name,
                'total_slots' => $shift->slots_count,
                'allocated'   => $shift->allocations_count,
            ]);
    }

    protected function getTeacherWorkload()
    {
        return Teacher::withCount('allocations')
            ->orderByDesc('allocations_count')
            ->limit(10)
            ->get()
            ->map(fn ($teacher): array => [
                'teacher'     => $teacher->name,
                'allocations' => $teacher->allocations_count,
            ]);
    }

    protected function getRoomUtilization()
    {
        return Room::with(['allocations' => fn ($q) => $q->select('room_id', 'day_id', 'slot_id')])
            ->get()
            ->map(fn ($room): array => [
                'room'        => $room->name,
                'utilization' => $room->allocations->groupBy(['day_id', 'slot_id']),
            ]);
    }

    protected function getStudentEnrollment()
    {
        return Student::with('program')
            ->selectRaw('program_id, semester_id, count(*) as total')
            ->groupBy('program_id', 'semester_id')
            ->get()
            ->map(fn ($student): array => [
                'program'  => $student->program->name,
                'semester' => $student->semester_id,
                'students' => $student->total,
            ]);
    }

    protected function getSemesterProgress()
    {
        return Semester::withCount(['courses', 'allocations'])
            ->orderByDesc('allocations_count') // Sort by allocated courses in descending order
            ->limit(5) // Limit to top 5 semesters
            ->get()
            ->map(fn ($semester): array => [
                'semester'  => $semester->name,
                'total'     => $semester->courses_count,
                'allocated' => $semester->allocations_count,
            ]);
    }
}
