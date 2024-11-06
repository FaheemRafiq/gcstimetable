<?php

namespace App\Http\Controllers\Admin;

use App\Models\Program;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;
use App\Http\Resources\ProgramCollection;
use App\Http\Requests\StoreProgramRequest;
use App\Http\Requests\UpdateProgramRequest;

class ProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admin      = Auth::user();
        $programs   = [];

        try {
            if ($admin->isSuperAdmin()) {
                $programs = Program::latest()->get();

            } elseif ($admin->isInstitutionAdmin()) {

                $programs = Program::whereHas("institution", function ($q) use ($admin) {
                    $q->where('institutions.id', $admin->institution_id);
                })
                ->latest()
                ->get();
            } elseif ($admin->isDepartmentAdmin()) {
                $programs = Program::where('department_id', $admin->department_id)
                ->latest()
                ->get();
            }

            return inertia()->render('Admin/Programs/index', [
                'programs' => new ProgramCollection($programs),
            ]);
        } catch (QueryException $exception) {
            dd($exception->getMessage());
            logger($exception->getMessage());
        }
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
    public function store(StoreProgramRequest $request)
    {
        // write store method like Department store method
        try {
            $program = Program::create($request->all());

            return response()->json($program, 201); // 201 Created
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Constraint violation or other database error'.$exception->getMessage()], 422);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Program $program)
    {
        // write show method like Day show method
        if (! $program) {
            return response()->json(['message' => 'Program not found'], 404);
        }

        return response()->json($program);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Program $program)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProgramRequest $request, Program $program)
    {
        // write update method like Day update method
        try {
            $program->update($request->all());

            return response()->json($program, 200); // 200 OK
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Program $program)
    {
        // write destroy method like Day destroy method
        try {
            $program->delete();

            return response()->json($program, 204); // 204 Successfully Deleted or 200 OK
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }
}
