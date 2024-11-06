<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class StudentController extends Controller
{
    public function index()
    {
        $dateFormat = config('providers.date.readable');
        $students = Student::select('id', 'name', 'email', 'mobile', 'created_at')
        ->get()
        ->transform(function ($user) use ($dateFormat) {
            $user->createdAt  = $user->created_at?->format($dateFormat);

            return $user;
        });

        return Inertia::render('Admin/Students', ['students' => $students]);
    }
}
