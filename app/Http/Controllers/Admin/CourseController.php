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
        $admin = Auth::user();
        $queryBuilder = Course::withCount('semesters')->orderByDesc('created_at');

        if (!$admin->isSuperAdmin()) {
            $queryBuilder->whereInstitution($admin->institution_id);
        }

        $courses = $queryBuilder->paginate(config('providers.pagination.per_page'));

        return inertia()->render('Admin/Courses/index', compact('courses'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $admin          = Auth::user();
        $institutions   = [];
        $types          = Course::TYPES;

        if ($admin->isSuperAdmin()) {
            $institutions = Institution::orderByDesc('created_at')->get();
        }

        return response()->json(compact('institutions', 'types'));
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
        $course->load('semesters');

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
