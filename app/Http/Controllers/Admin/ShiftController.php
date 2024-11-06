<?php

namespace App\Http\Controllers\Admin;

use App\Models\Shift;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
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
        //
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
