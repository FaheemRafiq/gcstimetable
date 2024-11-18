<?php

namespace App\Http\Controllers\Admin;

use App\Models\Shift;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\QueryException;
use App\Http\Requests\StoreShiftRequest;
use App\Http\Requests\UpdateShiftRequest;

class ShiftController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $admin  = Auth::user();
        $shifts = [];

        if($admin->isSuperAdmin()){
            $shifts = Shift::all();

        } if($admin->isInstitutionAdmin() || $admin->isDepartmentAdmin()){

            $shifts = Shift::whereInstitution($admin->institution_id)->get();
        }
        
        return inertia()->render('Admin/Shifts/index', [
            'shifts' => $shifts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShiftRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', Shift::class);
        $message    = '';
        try {

            if ($response->allowed() || true) {
                Shift::create($attributes);

                return back()->with('success', 'Resource successfully created');
            } else {
                $message = $response->message();
            }

        }catch (QueryException $exception) {
            $logData = ["message" => $exception->getMessage(), 'file' => $exception->getFile(), 'line' => $exception->getLine()];
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShiftRequest $request, Shift $shift)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shift $shift)
    {
        //
    }
}
