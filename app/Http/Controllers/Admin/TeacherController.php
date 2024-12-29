<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Teacher;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Enums\TeacherRankEnum;
use App\Enums\TeacherPositionEnum;
use App\Enums\TeacherQualificationEnum;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\TeacherRequest;
use App\Http\Resources\TeacherResource;
use Illuminate\Database\QueryException;

class TeacherController extends Controller
{
    public const ONLY = ['index', 'create', 'store', 'edit', 'update', 'destroy'];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $admin          = Auth::user();
        $queyBuilder    = Teacher::query();

        if ($admin->isInstitutionAdmin()) {

            $queyBuilder
                ->whereHas('department', function ($query) use ($admin) {
                    $query->where('institution_id', $admin->institution_id);
                })
                ->with('department.institution');
        } elseif ($admin->isDepartmentAdmin()) {
            $queyBuilder->where('department_id', $admin->department_id)
                ->with('department.institution');
        }

        $teachers = $queyBuilder->paginate($request->input('per_page', config('providers.per_page')));

        return Inertia::render('Admin/Teachers/index', [
            'teachers' => TeacherResource::collection($teachers)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $admin = Auth::user();
        $ranks = TeacherRankEnum::toArray();
        $positions = TeacherPositionEnum::toArray();
        $qualifications = TeacherQualificationEnum::toArray();
        $departments = [];

        if ($admin->isInstitutionAdmin()) {
            $departments = Department::where('institution_id', $admin->institution_id)->pluck('name', 'id');
        } elseif ($admin->isDepartmentAdmin()) {
            $departments = Department::where('id', $admin->department_id)->pluck('name', 'id');
        }

        return Inertia::render('Admin/Teachers/create', compact('ranks', 'positions', 'departments', 'qualifications'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TeacherRequest $request)
    {
        $attributes = $request->validated();
        $message = '';

        try {
            Teacher::create($attributes);
            return back()->with('success', 'Teacher successfully created');
        } catch (QueryException $exception) {
            Log::channel('teachers')->error('QueryException', [
                "message" => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine()
            ]);
            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Teacher $teacher)
    {
        $admin = Auth::user();
        $ranks = TeacherRankEnum::toArray();
        $positions = TeacherPositionEnum::toArray();
        $qualifications = TeacherQualificationEnum::toArray();
        $departments = [];

        if ($admin->isInstitutionAdmin()) {
            $departments = Department::where('institution_id', $admin->institution_id)->pluck('name', 'id');
        } elseif ($admin->isDepartmentAdmin()) {
            $departments = Department::where('id', $admin->department_id)->pluck('name', 'id');
        }

        return Inertia::render('Admin/Teachers/edit', [
            'teacher' => new TeacherResource($teacher),
            'ranks' => $ranks,
            'positions' => $positions,
            'departments' => $departments,
            'qualifications' => $qualifications
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TeacherRequest $request, Teacher $teacher)
    {
        $attributes = $request->validated();
        $message = '';

        try {
            $teacher->update($attributes);
            return back()->with('success', 'Teacher successfully updated');
        } catch (QueryException $exception) {
            Log::channel('teachers')->error('QueryException', [
                "message" => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine()
            ]);
            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        $message = '';

        try {
            $teacher->delete();
            return back()->with('success', 'Teacher successfully deleted');
        } catch (QueryException $exception) {
            Log::channel('teachers')->error('QueryException', [
                "message" => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine()
            ]);
            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }
}
