<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Enums\RoleEnum;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public const ONLY = ['index', 'store', 'update', 'destroy'];

    public function __construct()
    {
        $this->middleware('role:'.RoleEnum::SUPER_ADMIN->value);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permissions = Permission::withCount('roles')->get();

        return Inertia::render('Admin/Permissions/index', compact('permissions'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $attributes = $request->validate([
            'name' => 'required',
        ]);

        Permission::create($attributes);

        return back()->with('success', 'Permission created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Permission $permission)
    {
        $attributes = $request->validate([
            'name' => 'required',
        ]);

        $permission->update($attributes);

        return back()->with('success', 'Permission updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        $permission->delete();

        return back()->with('success', 'Permission deleted successfully');
    }
}
