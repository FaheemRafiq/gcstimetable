<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\SlotException;
use App\Models\Slot;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\SlotCollection;
use App\Http\Requests\StoreSlotRequest;
use Illuminate\Database\QueryException;
use App\Http\Requests\UpdateSlotRequest;

class SlotController extends Controller
{
    const ONLY = ['index', 'store', 'update', 'destroy'];

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
     * Store a newly created resource in storage.
     */
    public function store(StoreSlotRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Slot::class);
        $message    = '';
        try {

            if ($response->allowed()) {
                Slot::create($attributes);

                return back()->with('success', 'Resource successfully created');
            } else {
                $message = $response->message();
            }

        } catch (SlotException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('shifts')->error('QueryException', $logData);

            $message = 'Validation error 👉 ' . $exception->getMessage();
        } catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('shifts')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSlotRequest $request, Slot $slot)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('update', $slot);
        $message    = '';

        try {
            if ($response->allowed()) {
                $slot->update($attributes);

                return back()->with('success', 'Resource successfully updated');
            } else {
                $message = $response->message();
            }

        } catch (SlotException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('shifts')->error('QueryException', $logData);

            $message = 'Validation error 👉 ' . $exception->getMessage();
        } catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('shifts')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Slot $slot)
    {
        $response = Gate::inspect('delete', $slot);
        $message  = '';

        try {
            if ($response->allowed()) {
                $slot->delete();

                return back()->with('success', 'Resource successfully deleted');
            } else {
                $message = $response->message();
            }

        } catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
            Log::channel('shifts')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->with('error', $message);
    }
}
