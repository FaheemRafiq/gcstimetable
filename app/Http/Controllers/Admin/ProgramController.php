<?php

namespace App\Http\Controllers\Admin;

use App\Models\Shift;
use App\Models\Program;
use App\Models\Department;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\ProgramRequest;
use Illuminate\Database\QueryException;
use App\Http\Resources\ProgramCollection;
use App\Http\Requests\StoreProgramRequest;
use App\Http\Requests\UpdateProgramRequest;

class ProgramController extends Controller
{
    public const ONLY = ['index', 'create', 'store', 'show', 'update', 'destroy'];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admin      = Auth::user();
        $builder    = Program::query();

        if ($admin->isInstitutionAdmin()) {

            $builder->whereHas("institution", function ($q) use ($admin) {
                $q->where('institutions.id', $admin->institution_id);
            });

        } elseif ($admin->isDepartmentAdmin()) {

            $programs = $builder->where('department_id', $admin->department_id);
        }

        $programs = $builder->with('shift:id,name')->latest()->get();

        return inertia()->render('Admin/Programs/index', [
            'programs' => new ProgramCollection($programs),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $admin       = Auth::user();
        $shifts      = Shift::select('id', 'name', 'program_type', 'institution_id')->whereInstitution($admin->institution_id)->active()->get();
        $departments = Department::select('id', 'name', 'code', 'institution_id')->where('institution_id', $admin->institution_id)->get();

        return response()->json(['shifts' => $shifts, 'departments' => $departments, 'program_types' => Program::TYPES]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProgramRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Program::class);
        $message    = '';
        try {

            if ($response->allowed()) {
                Program::create($attributes);

                return back()->with('success', 'Program successfully created');
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
        // $response = Gate::inspect('view', $program);

        // if ($response->denied()) {
        //     return back()->with('error', $response->message());
        // }

        $program->load('semesters', 'shift');

        return inertia()->render('Admin/Programs/show', [
            'program' => $program,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProgramRequest $request, Program $program)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('update', $program);
        $message    = '';
        try {

            if ($response->allowed()) {
                $program->update($attributes);

                return back()->with('success', 'Program successfully updated');
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
     * Remove the specified resource from storage.
     */
    public function destroy(Program $program)
    {
        $response = Gate::inspect('delete', $program);
        $message  = '';
        try {

            if ($response->allowed()) {
                $program->delete();

                return back()->with('success', 'Program successfully deleted');
            } else {
                $message = $response->message();
            }

        } catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('programs')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->with('error', $message);
    }
}
