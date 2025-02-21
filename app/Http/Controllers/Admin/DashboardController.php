<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Teacher;
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
            'teacherWorkload'    => $this->getTeacherWorkload(),
        ]);
    }

    protected function getTeacherWorkload()
    {
        return Teacher::withCount([
            'allocations' => function ($query) {
                $query->whereHas('timetable', function ($query) {
                    $query->isValidForToday();
                });
            },
        ])
            ->orderByDesc('allocations_count')
            ->limit(10)
            ->get()
            ->map(fn ($teacher): array => [
                'id'          => $teacher->id,
                'teacher'     => $teacher->name,
                'allocations' => $teacher->allocations_count,
            ]);
    }
}
