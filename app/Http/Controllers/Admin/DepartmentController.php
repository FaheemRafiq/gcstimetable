<?php

namespace App\Http\Controllers\Admin;

use App\Models\Department;
use App\Http\Controllers\Controller;
use Illuminate\Database\QueryException;
use App\Http\Resources\DepartmentCollection;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        // get the institution id from the request
        $institutionId = request()->input('institutionid');

        // return DEpartments with proper Exception Handling
        try {
            return response()->json(new DepartmentCollection(Department::all()->where('institution_id', $institutionId)->sortByDesc('updated_at')), 200); // 200 OK
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
    public function store(StoreDepartmentRequest $request)
    {

        try {
            $department = Department::create($request->all());

            return response()->json($department, 201); //
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Constraint violation or other database error'.$exception->getMessage()], 422);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Department $department)
    {        // write show method like Day show method
        if (! $department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        // return response()->json($department);
        return response()->json($department, 200);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Department $department)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDepartmentRequest $request, Department $department)
    {
        //write update method like Day update method
        try {
            $department->update($request->all());

            return response()->json($department, 200); // 200 OK
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department)
    {
        // write destroy method like Day destroy method
        try {
            $department->delete();

            return response()->json(['department' => $department,  'message' => 'Resource successfully deleted'], 200);
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }
}
