<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public const ONLY = ['index'];
    
    public function index()
    {
        $admin      = Auth::user();
        $dateFormat = config('providers.date.readable');
        $students   = Student::select('id', 'name', 'email', 'mobile', 'created_at')
            ->when($admin->isInstitutionAdmin() || $admin->isDepartmentAdmin(), function ($query) use ($admin) {
                $query->where("institution_id", $admin->institution_id);
            })
            ->get()
            ->transform(function ($user) use ($dateFormat) {
                $user->createdAt  = $user->created_at?->format($dateFormat);

                return $user;
            });

        return Inertia::render('Admin/Students', ['students' => $students]);
    }
}
