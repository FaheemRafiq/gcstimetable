<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Program;
use App\Models\Student;
use App\Models\Teacher;
use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use stdClass;

class DashboardController extends Controller
{
    public function index()
    {
        $admin          = Auth::user();
        $institutionId  = null;
        $departmentId   = null;

        if ($admin->isInstitutionAdmin()) {
            $institutionId = $admin->institution_id;
        }

        if ($admin->isDepartmentAdmin()) {
            $departmentId = $admin->department_id;
        }

        $cacheKey = "dashboard_statistics_$admin->id";

        $statistics = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($institutionId, $departmentId, $admin) {
            $userQuery = User::query()
                ->when($institutionId, function ($query, $institutionId) {
                    $query->whereInstitution($institutionId);
                })
                ->when($departmentId, function ($query, $departmentId) {
                    $query->whereDepartment($departmentId);
                });

            $studentQuery = Student::query()
                ->when($admin->isInstitutionAdmin() || $admin->isDepartmentAdmin(), function ($query) use ($admin) {
                    $query->where("institution_id", $admin->institution_id);
                });

            $teacherQuery = Teacher::query()
                ->when($institutionId, function ($query, $institutionId) {
                    $query->whereHas('institution', function ($query) use ($institutionId) {
                        $query->where('institutions.id', $institutionId);
                    });
                })
                ->when($departmentId, function ($query, $departmentId) {
                    $query->where("department_id", $departmentId);
                });

            return [
                'users'     => $userQuery->count(),
                'students'  => $studentQuery->count(),
                'teachers'  => $teacherQuery->count(),
            ];
        });

        // Additional data for visualizations
        $charts = [
            'programsPerDepartment' => Department::select('name')
                ->withCount('programs')
                ->get(),
            'studentsPerProgram' => Student::selectRaw('program_id, count(*) as total')
                ->groupBy('program_id')
                ->get(),
            'historicalGrowth' => Student::selectRaw('YEAR(created_at) as year, count(*) as total')
                ->groupBy('year')
                ->orderBy('year', 'ASC')
                ->get(),
        ];

        return Inertia::render('Admin/Dashboard/index', compact('statistics', 'charts'));
    }
}
