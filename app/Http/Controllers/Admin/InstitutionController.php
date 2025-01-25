<?php

namespace App\Http\Controllers\Admin;

use App\Models\Institution;
use App\Http\Controllers\Controller;
use Illuminate\Database\QueryException;
use App\Http\Requests\StoreInstitutionRequest;
use App\Http\Requests\UpdateInstitutionRequest;

class InstitutionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return all institutions with proper exception handling
        try {
            return response()->json(Institution::all()->sortByDesc('updated_at'), 200); // 200 OK
        } catch (QueryException $queryException) {
            return response()->json(['error' => 'Database error'.$queryException->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): void
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInstitutionRequest $request)
    {
        try {
            $institution = Institution::create($request->all());

            return response()->json($institution, 201); // 201 Created
        } catch (QueryException $queryException) {
            return response()->json(['error' => 'Constraint violation or other database error'.$queryException->getMessage()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Institution $institution)
    {
        if (! $institution) {
            return response()->json(['message' => 'Institution not found'], 404);
        }

        return response()->json($institution);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Institution $institution): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInstitutionRequest $request, Institution $institution): Institution
    {
        // save the request data and return it
        $institution->update($request->all());

        return $institution;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Institution $institution)
    {
        if (! $institution) {
            return response()->json(['message' => 'Institution not found'], 404);
        }

        $institution->delete();

        // return response()->json($institution);
        return response()->json(['institution' => $institution, 'message' => 'Resource successfully deleted'], 200);
    }
}
