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
    public function index()
    {
        $admin = Auth::user();

        $userCount = User::query()
            ->when($admin->isInstitutionAdmin(), function ($query) use ($admin) {
                $query->whereInstitution($admin->institution_id);
            })
            ->when($admin->isDepartmentAdmin(), function ($query) use ($admin) {
                $query->whereDepartment($admin->department_id);
            })
            ->count();

        $studentCount = Student::query()
            ->when($admin->isInstitutionAdmin() || $admin->isDepartmentAdmin(), function ($query) use ($admin) {
                $query->where("institution_id", $admin->institution_id);
            })
            ->count();

        $teacherCount = Teacher::query()
            ->when($admin->isInstitutionAdmin(), function ($query) use ($admin) {
                $query->whereHas('institution', function ($query) use ($admin) {
                    $query->where('institutions.id', $admin->institution_id);
                });
            })
            ->when($admin->isDepartmentAdmin(), function ($query) use ($admin) {
                $query->where("department_id", $admin->department_id);
            })
            ->count();

        $statistics = [
            'users'     => $userCount,
            'students'  => $studentCount,
            'teachers'  => $teacherCount,
        ];

        return Inertia::render('Dashboard', [
            'statistics' => $statistics,
        ]);
    }
}
