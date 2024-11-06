<?php

namespace App\Http\Controllers\Admin;

use App\Models\Slot;
use App\Http\Controllers\Controller;
use App\Http\Resources\SlotCollection;
use App\Http\Requests\StoreSlotRequest;
use Illuminate\Database\QueryException;
use App\Http\Requests\UpdateSlotRequest;

class SlotController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // get the institution id from the request
        $institutionId = request()->input('institutionid');

        try {
            return response()->json(new SlotCollection(Slot::all()->where('institution_id', $institutionId)->sortByDesc('updated_at')), 200); // 200 OK
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
    public function store(StoreSlotRequest $request)
    {
        try {
            $semester = Slot::create($request->all());

            return response()->json($semester, 201); // 201 Created
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Constraint violation or other database error'.$exception->getMessage()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Slot $slot)
    {
        if (! $slot) {
            return response()->json(['message' => 'Semester not found'], 404);
        }

        return response()->json($slot);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Slot $slot)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSlotRequest $request, Slot $slot)
    {
        try {
            $slot->update($request->all());

            return response()->json($slot, 200); // 200 OK
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Slot $slot)
    {
        try {
            $slot->delete();

            return response()->json(['slot' => $slot,  'message' => 'Resource successfully deleted'], 200);
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }
}
