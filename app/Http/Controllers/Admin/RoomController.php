<?php

namespace App\Http\Controllers\Admin;

use App\Models\Room;
use Inertia\Inertia;
use App\Models\Shift;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoomResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\RoomCollection;
use App\Http\Services\DateTimeService;
use App\Http\Requests\StoreRoomRequest;
use Illuminate\Database\QueryException;
use App\Http\Requests\UpdateRoomRequest;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $rooms    = [];
        $admin    = Auth::user();

        if ($admin->isInstitutionAdmin()) {
            $rooms = new RoomCollection(Room::where('institution_id', $admin->institution_id)->get());
        }

        try {
            return Inertia::render('Admin/Rooms/index', [
                'rooms' => $rooms,
            ]);
        } catch (QueryException $e) {
            return back()->with('status', $e->getMessage());
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
    public function store(StoreRoomRequest $request)
    {
        $request->validated();

        try {
            $room = Room::create($request->all());

            return response()->json($room, 201); // 201 Created
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Constraint violation or other database error'.$exception->getMessage()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($room, DateTimeService $dateTimeService)
    {
        $room = Room::whereKey($room)
            ->with([
                'allocations' => function ($query) {
                    $query->select('id', 'room_id', 'day_id', 'slot_id', 'course_id')
                        ->with([
                            'day:id,name',
                            'slot:id,start_time,end_time',
                            'course:id,name,type',
                        ]);
                }
            ])
            ->first();


        $events = new \stdClass();

        foreach ($room->allocations as $allocation) {
            if (isset($allocation->day->name)) {
                $key = strtolower($allocation->day->name);

                if (!isset($events->$key)) {
                    $events->$key = [];
                }

                $events->$key[] = [
                    'id'        => $allocation->id,
                    'name'      => $allocation->course->name ?? 'Course',
                    'type'      => $allocation->course->type ?? 'Lecture',
                    'startTime' => $dateTimeService->convertToISO8601($allocation->slot->start_time),
                    'endTime'   => $dateTimeService->convertToISO8601($allocation->slot->end_time),
                ];
            }
        }

        return Inertia::render('Admin/Rooms/show', [
            'room'   => $room,
            'events' => $events,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomRequest $request, Room $room)
    {
        //write update method like Day update method
        try {
            $room->update($request->all());

            return response()->json($room, 200); // 200 OK
        } catch (QueryException $exception) {
            return response()->json(['error' => 'Database error'.$exception->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        $response = Gate::inspect('delete', [Room::class, $room]);

        if ($response->allowed()) {

            try {
                $room->delete();
            } catch (QueryException $exception) {
                return back()->with('message', 'Database error '.$exception->getMessage());
            }

            return back()->with('success', 'User deleted successfully.');
        }

        return back()->with('error', $response->message());
    }
}
