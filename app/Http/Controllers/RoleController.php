<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public const ONLY = ['index', 'show', 'store', 'update', 'destroy'];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::withCount('permissions')->get();

        return Inertia::render('Admin/Roles/index', compact('roles'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $attributes = $request->validate([
            'name'       => 'required',
            'guard_name' => 'required',
        ]);

        Role::create($attributes);

        return back()->with('success', 'Role created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        return Inertia::render('Admin/Roles/show', compact('role'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        $attributes = $request->validate([
            'name'       => 'required',
            'guard_name' => 'required',
        ]);

        $role->update($attributes);

        return back()->with('success', 'Role updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $role->delete();

        return back()->with('success', 'Role deleted successfully');
    }
}
