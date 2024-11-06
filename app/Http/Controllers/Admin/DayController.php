<?php

namespace App\Http\Controllers\Admin;

use App\Models\Day;
use App\Http\Controllers\Controller;
use App\Http\Resources\DayCollection;
use App\Http\Requests\StoreDayRequest;
use App\Http\Requests\UpdateDayRequest;
use Illuminate\Database\QueryException;

class DayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        // get the institution id from the request
        $institutionId = request()->input('institutionid');

        // return all days by institution
        try {
            $days = new DayCollection(Day::all()->where('institution_id', $institutionId)->sortByDesc('updated_at'));

            return response()->json($days, 200); // 200 OK

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
    public function store(StoreDayRequest $request)
    {
        try {
            $day = Day::create($request->all());

            return response()->json($day, 201); // 201 Created
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Constraint violation or other database error'.$exception->getMessage()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Day $day)
    {
        if (! $day) {
            return response()->json(['message' => 'Day not found'], 404);
        }

        return response()->json($day);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Day $day)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDayRequest $request, Day $day)
    {
        // save the request data and return it
        $day->update($request->all());

        return $day;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Day $day)
    {
        if (! $day) {
            return response()->json(['message' => 'Day not found'], 404);
        }

        $day->delete();

        // return response()->json($day);
        return response()->json(['day' => $day, 'message' => 'Resource successfully deleted'], 200);
    }
}
