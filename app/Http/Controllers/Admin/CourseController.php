<?php

namespace App\Http\Controllers\Admin;

use App\Models\Course;
use App\Models\Semester;
use App\Models\Institution;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\QueryException;
use App\Http\Requests\CourseRequest;

class CourseController extends Controller
{
    public const ONLY = ['index', 'store', 'create', 'show', 'update', 'destroy'];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admin   = Auth::user();
        $courses = [];

        if ($admin->isSuperAdmin()) {
            $courses = Course::with('semester')->orderByDesc('created_at')->get();

        } elseif ($admin->isInstitutionAdmin()) {
            $institution = Institution::with('programs.courses.semester')->where('id', $admin->institution_id)->first();

            $courses = $institution->programs->flatMap(function ($program) {
                return $program->courses;
            });
        }

        return inertia()->render('Admin/Courses/index', compact('courses'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $admin      = Auth::user();
        $semesters  = [];
        $types      = Course::TYPES;

        if ($admin->isSuperAdmin()) {
            $semesters = Semester::orderByDesc('created_at')->get();

        } elseif ($admin->isInstitutionAdmin()) {
            $institution = Institution::with('programs.semesters')->where('id', $admin->institution_id)->first();

            $semesters = $institution->programs->flatMap(function ($program) {
                return $program->semesters;
            });
        }

        return response()->json(compact('semesters', 'types'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CourseRequest $request)
    {
        $attributes = $request->validated();
        $response = Gate::inspect('create', Course::class);
        $message = '';

        try {
            if ($response->allowed()) {
                Course::create($attributes);

                return back()->with('success', 'Course successfully created');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('courses')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $course->load('semester');

        return inertia()->render('Admin/Courses/show', compact('course'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CourseRequest $request, Course $course)
    {
        $attributes = $request->validated();
        $response = Gate::inspect('update', $course);
        $message = '';

        try {
            if ($response->allowed()) {
                $course->update($attributes);

                return back()->with('success', 'Course successfully updated');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('courses')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $response = Gate::inspect('delete', $course);
        $message = '';

        try {
            if ($response->allowed()) {
                $course->delete();

                return back()->with('success', 'Course successfully deleted');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('courses')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }
}
