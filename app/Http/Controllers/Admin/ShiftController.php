<?php

namespace App\Http\Controllers\Admin;

use App\Models\Shift;
use App\Http\Requests\ShiftRequest;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\QueryException;

class ShiftController extends Controller
{
    public const ONLY = ['index', 'show', 'store', 'update', 'destroy'];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admin      = Auth::user();
        $shiftQuery = Shift::query();

        if ($admin->isInstitutionAdmin() || $admin->isDepartmentAdmin()) {
            $shiftQuery->whereInstitution($admin->institution_id);
        }

        return inertia()->render('Admin/Shifts/index', [
            'shifts' => $shiftQuery->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ShiftRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Shift::class);
        $message    = '';
        try {
            if ($response->allowed()) {
                Shift::create($attributes);

                return back()->with('success', 'Shift successfully created');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('shifts')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Shift $shift)
    {
        $response = Gate::inspect('view', $shift);
        $message  = '';

        if ($response->allowed()) {
            return inertia()->render('Admin/Shifts/show', [
                'shift' => $shift->load('slots'),
            ]);
        } else {
            $message = $response->message();
        }

        return back()->with('error', $message);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ShiftRequest $request, Shift $shift)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('update', $shift);
        $message    = '';

        try {
            if ($response->allowed()) {
                $shift->update($attributes);

                return back()->with('success', 'Resource successfully updated');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('shifts')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shift $shift)
    {
        $response = Gate::inspect('delete', $shift);
        $message  = '';

        try {
            if ($response->allowed()) {
                $shift->delete();

                return back()->with('success', 'Resource successfully deleted');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('shifts')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->with('error', $message);
    }
}
