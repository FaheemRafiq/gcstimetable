<?php

namespace App\Http\Controllers\Admin;

use App\Models\Course;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\SemesterRequest;
use App\Http\Resources\SectionResouce;
use Illuminate\Database\QueryException;

class SemesterController extends Controller
{
    public const ONLY = ['index', 'create', 'show', 'store', 'update', 'destroy'];

    public function index()
    {
        $admin   = Auth::user();
        $builder = Semester::query();

        if ($admin->isInstitutionAdmin()) {
            $builder->whereHas('program', function ($query) use ($admin): void {
                $query->whereIn('department_id', $admin->institution?->departments?->pluck('id')->toArray() ?? []);
            });
        } elseif ($admin->isDepartmentAdmin()) {
            $builder->whereHas('program', function ($query) use ($admin): void {
                $query->whereIn('department_id', [$admin->department_id]);
            });
        }

        $semesters = $builder->with('program:id,name,code')->withCount('sections')->latest()->get();

        return inertia()->render('Admin/Semesters/index', ['semesters' => $semesters]);
    }

    public function create()
    {
        $admin    = Auth::user();
        $programs = $admin->institution->programs()->select('programs.id', 'programs.name', 'programs.code')->get();

        return response()->json(['programs' => $programs]);
    }

    public function show(Semester $semester)
    {
        $semester->load(['program:id,name,code', 'sections', 'courses']);

        $sections = SectionResouce::collection($semester->sections)->toArray(request());

        return inertia()->render('Admin/Semesters/show', ['semester' => $semester, 'sections' => $sections]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SemesterRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Semester::class);
        $message    = '';
        try {
            if ($response->allowed()) {
                Semester::create($attributes);

                return back()->with('success', 'Semester successfully created');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('semesters')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Update the specified resource in storage.
     *
     *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\Response
     */
    public function update(SemesterRequest $request, Semester $semester)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('update', $semester);
        $message    = '';
        try {
            if ($response->allowed()) {
                $semester->update($attributes);

                return back()->with('success', 'Semester successfully updated');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('semesters')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Remove the specified resource from storage.
     *
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Semester $semester)
    {
        $response = Gate::inspect('delete', $semester);
        $message  = '';
        try {
            if ($response->allowed()) {
                $semester->delete();

                return back()->with('success', 'Semester successfully deleted');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('semesters')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->with('error', $message);
    }

    /**
     * Attach Course to Semester
     *
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function attachCourse(Semester $semester)
    {
        $admin  = Auth::user();

        $semester->load('courses');

        $courses = [];

        if ($admin->isSuperAdmin()) {
            $courses = Course::select('id', 'name', 'code')->get();
        } elseif ($admin->isInstitutionAdmin() || $admin->isDepartmentAdmin()) {
            $courses = Course::whereInstitution($admin->institution_id)->select('id', 'name', 'code')->get();
        }

        return response()->json(compact('courses', 'semester'));
    }

    /**
     * Attach Course to Semester
     *
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function attach(Semester $semester, Request $request)
    {
        $request->validate([
            'courses'   => 'nullable|array',
            'courses.*' => 'nullable|integer|exists:courses,id',
        ]);

        $response = Gate::inspect('attach', $semester);
        $message  = '';

        try {
            if ($response->allowed()) {
                $semester->courses()->sync(request()->input('courses', []));

                return back()->with('success', 'Courses successfully attached to semester');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('semesters')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }
}
