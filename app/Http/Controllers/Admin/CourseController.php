<?php

namespace App\Http\Controllers\Admin;

use App\Models\Course;
use App\Models\Semester;
use App\Models\Institution;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Database\QueryException;

class CourseController extends Controller
{
    public const ONLY = ['index', 'store', 'create', 'show', 'update', 'destroy'];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $admin        = Auth::user();
        $queryBuilder = Course::withCount('semesters');
        $search       = $request->query('s');
        $type         = $request->query('type');

        $queryBuilder
            ->when($search, function ($query, $search) {
                $query->where(function ($wQuery) use ($search) {
                    $wQuery->where('name', 'LIKE', "%$search%")
                        ->orWhere('code', 'LIKE', "%$search%");
                });
            })
            ->when($type, function ($query, $type) {
                $query->where('type', $type);
            });

        if (! $admin->isSuperAdmin()) {
            $queryBuilder->whereInstitution($admin->institution_id);
        }

        $courses = $queryBuilder
            ->orderByDesc('created_at')
            ->paginate(config('providers.pagination.per_page'))
            ->appends($request->query());

        return inertia()->render('Admin/Courses/index', [
            'courses' => $courses,
            'types'   => Course::TYPES,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $admin        = Auth::user();
        $institutions = [];
        $types        = Course::TYPES;

        if ($admin->isSuperAdmin()) {
            $institutions = Institution::orderByDesc('created_at')->get();
        }

        return response()->json(['institutions' => $institutions, 'types' => $types]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CourseRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Course::class);
        $message    = '';

        try {
            if ($response->allowed()) {
                Course::create($attributes);

                return back()->with('success', 'Course successfully created');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
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

        return inertia()->render('Admin/Courses/show', ['course' => $course]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CourseRequest $request, Course $course)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('update', $course);
        $message    = '';

        try {
            if ($response->allowed()) {
                $course->update($attributes);

                return back()->with('success', 'Course successfully updated');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
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
        $message  = '';

        try {
            if ($response->allowed()) {
                $course->delete();

                return back()->with('success', 'Course successfully deleted');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('courses')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    public function attachSemester(Course $course): JsonResponse
    {
        $admin = Auth::user();

        $course->load('semesters');
        $semesters = [];

        if ($admin->isSuperAdmin()) {
            $semesters = Semester::query()
                ->select('id as value', 'name as label')
                ->orderByDesc('created_at')
                ->get();
        } elseif ($admin->isInstitutionAdmin() || $admin->isDepartmentAdmin()) {
            $semesters = $admin->institution()->with([
                'programs.semesters' => function ($query) use ($course) {
                    $query->whereNotIn('id', $course->semesters->pluck('id')->toArray())
                        ->orderByDesc('created_at');
                },
            ])
                ->first()
                ->programs
                ->pluck('semesters')
                ->flatten()
                ->unique('id')
                ->map(function ($semester) {
                    return ['value' => $semester->id, 'label' => $semester->name];
                });
        }

        return response()->json(compact('semesters', 'course'));
    }

    /**
     * Attach a semester to the course.
     */
    public function attach(Course $course, Request $request): RedirectResponse
    {
        $request->validate([
            'semesters'   => 'nullable|array',
            'semesters.*' => 'nullable|integer|exists:semesters,id',
        ]);

        $response = Gate::inspect('attach', $course);
        $message  = '';

        try {
            if ($response->allowed()) {
                if ($course->semesters()->where('semester_id', $request->semester_id)->exists()) {
                    return back()->withErrors(['message' => 'Semester already attached']);
                }

                $course->semesters()->sync($request->input('semesters', []));

                return back()->with('success', 'Semester successfully attached');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('courses')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }
}
