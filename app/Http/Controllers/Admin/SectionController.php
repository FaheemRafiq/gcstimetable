<?php

namespace App\Http\Controllers\Admin;

use App\Models\Section;
use App\Http\Controllers\Controller;
use Illuminate\Database\QueryException;
use App\Http\Resources\SectionCollection;
use App\Http\Requests\StoreSectionRequest;
use App\Http\Requests\UpdateSectionRequest;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $semesterid = request()->input('semester_id');

        try {
            return response()->json(new SectionCollection(Section::all()->where('semester_id', $semesterid)->sortByDesc('updated_at')), 200); // 200 OK
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
    public function store(StoreSectionRequest $request)
    {

        try {
            $section = Section::create($request->all());

            return response()->json($section, 201); // 201 Created
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Constraint violation or other database error'.$exception->getMessage()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Section $section)
    {
        // write show method like Day show method
        if (! $section) {
            return response()->json(['message' => 'Section not found'], 404);
        }

        return response()->json($section);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Section $section)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSectionRequest $request, Section $section)
    {

        try {
            $section->update($request->all());

            return response()->json($section, 200); // 200 OK
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Section $section)
    {
        try {
            $section->delete();

            return response()->json(['section' => $section,  'message' => 'Resource successfully deleted'], 200);
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }
}
