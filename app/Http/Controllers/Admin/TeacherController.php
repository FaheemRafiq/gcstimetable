<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\TeacherResource;
use Illuminate\Database\QueryException;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;

class TeacherController extends Controller
{
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
        ;

        return Inertia::render('Admin/Teachers/index', [
            'teachers' => TeacherResource::collection($teachers)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeacherRequest $request)
    {
        try {
            $teacher = Teacher::create($request->all());

            return response()->json($teacher, 201); // 201 Created
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Constraint violation or other database error'.$exception->getMessage()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Teacher $teacher)
    {
        if (! $teacher) {
            return response()->json(['message' => 'Teacher not found'], 404);
        }

        return response()->json($teacher);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Teacher $teacher)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherRequest $request, Teacher $teacher)
    {
        try {
            $teacher->update($request->all());

            return response()->json($teacher, 200); // 200 OK
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        try {
            $teacher->delete();

            return response()->json(['teacher' => $teacher,  'message' => 'Resource successfully deleted'], 200);
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }
}
