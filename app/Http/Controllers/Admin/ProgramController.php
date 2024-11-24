<?php

namespace App\Http\Controllers\Admin;

use App\Models\Shift;
use App\Models\Program;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
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
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $admin = Auth::user();

        $shifts = Shift::whereInstitution($admin->institution_id)->get();

        return inertia()->share('shifts', $shifts)->render('Admin/Programs/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProgramRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Program::class);
        $message    = '';
        try {

            if ($response->allowed()) {
                Program::create($attributes);

                return back()->with('success', 'Resource successfully created');
            } else {
                $message = $response->message();
            }

        } catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('programs')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);

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
