<?php

namespace App\Http\Controllers\Admin;

use App\Models\Semester;
use App\Http\Controllers\Controller;
use Illuminate\Database\QueryException;
use App\Http\Resources\SemesterCollection;
use App\Http\Requests\StoreSemesterRequest;
use App\Http\Requests\UpdateSemesterRequest;

class SemesterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        // get program id from the request

        $programId = request()->input('program_id');

        try {
            return response()->json(new SemesterCollection(Semester::all()->where('program_id', $programId)->sortByDesc('updated_at')), 200); // 200 OK
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
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
    public function store(StoreSemesterRequest $request)
    {
        // write store method like Department store method
        try {
            $semester = Semester::create($request->all());

            return response()->json($semester, 201); // 201 Created
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Constraint violation or other database error'.$exception->getMessage()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Semester $semester)
    {
        // write show method like Day show method
        if (! $semester) {
            return response()->json(['message' => 'Semester not found'], 404);
        }

        return response()->json($semester);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Semester $semester)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSemesterRequest $request, Semester $semester)
    {
        // write update method like Day update method
        try {
            $semester->update($request->all());

            return response()->json($semester, 200); // 200 OK
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Semester $semester)
    {
        try {
            $semester->delete();

            return response()->json(['semester' => $semester,  'message' => 'Resource successfully deleted'], 200);
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }
}
