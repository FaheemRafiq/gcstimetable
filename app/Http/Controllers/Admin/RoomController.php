<?php

namespace App\Http\Controllers\Admin;

use stdClass;
use App\Models\Room;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\RoomCollection;
use App\Http\Services\DateTimeService;
use App\Http\Requests\StoreRoomRequest;
use Illuminate\Database\QueryException;
use App\Http\Requests\UpdateRoomRequest;

class RoomController extends Controller
{
    public const ONLY = ['index', 'show', 'store', 'update', 'destroy'];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = [];
        $admin = Auth::user();

        if ($admin->isInstitutionAdmin() || $admin->isDepartmentAdmin()) {
            $rooms = new RoomCollection(Room::where('institution_id', $admin->institution_id)->orderByDesc('created_at')->get());
        }

        try {
            return Inertia::render('Admin/Rooms/index', [
                'rooms' => $rooms,
            ]);
        } catch (QueryException $queryException) {
            return back()->with('status', $queryException->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomRequest $request)
    {
        $admin      = Auth::user();
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Room::class);
        $message    = '';
        try {
            if ($response->allowed()) {
                $exists = Room::where(['type' => $attributes['type'], 'code' => $attributes['code']])->whereInstitution($admin->institution_id)->exists();

                if ($exists) {
                    return back()->withErrors(['message' => $attributes['type'].' room already exists for '.$attributes['code']]);
                }

                Room::create($attributes);

                return back()->with('success', 'Resource successfully created');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('rooms')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Display the specified resource.
     */
    public function show($room, DateTimeService $dateTimeService)
    {
        $room = Room::whereKey($room)
            ->with([
                'allocations' => function ($query): void {
                    $query->select('id', 'room_id', 'day_id', 'slot_id', 'course_id')
                        ->with([
                            'day:id,name',
                            'slot:id,start_time,end_time',
                            'course:id,name,type',
                        ]);
                },
            ])
            ->first();

        $events = new stdClass;

        foreach ($room->allocations as $allocation) {
            if (isset($allocation->day->name)) {
                $key = strtolower($allocation->day->name);

                if (! isset($events->$key)) {
                    $events->$key = [];
                }

                $events->$key[] = [
                    'id'        => $allocation->id,
                    'name'      => $allocation->course->name ?? 'Course',
                    'type'      => $allocation->course->type ?? 'Lecture',
                    'startTime' => '2024-11-17T'.$allocation->slot->start_time,
                    'endTime'   => '2024-11-17T'.$allocation->slot->end_time,
                ];
            }
        }

        return Inertia::render('Admin/Rooms/show', [
            'room'   => $room,
            'events' => $events,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomRequest $request, Room $room)
    {
        $admin      = Auth::user();
        $attributes = $request->validated();
        $response   = Gate::inspect('update', $room);
        $message    = '';
        try {
            if ($response->allowed()) {
                $exists = Room::where(['type' => $attributes['type'], 'code' => $attributes['code']])->whereInstitution($admin->institution_id)->where('id', '!=', $room->id)->exists();

                if ($exists) {
                    return back()->withErrors(['message' => $attributes['code'].' room already exists for '.$attributes['type']]);
                }

                $room->update($attributes);

                return back()->with('success', 'Resource successfully updated');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('rooms')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
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
                return back()->with('error', 'Database error '.$exception->getMessage());
            }

            return back()->with('success', 'Room deleted successfully.');
        }

        return back()->withErrors(['message' => $response->message()]);
    }
}
