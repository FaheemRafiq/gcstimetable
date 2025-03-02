<?php

namespace App\Http\Controllers;

use Gate;
use Inertia\Inertia;
use App\Models\Permission;
use App\Models\PermissionGroup;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use App\Http\Requests\PermissionGroupRequest;

class PermissionGroupController extends Controller
{
    public const ONLY = ['index', 'create', 'store', 'update', 'destroy'];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Gate::denies('viewAny', PermissionGroup::class)) {
            abort(403);
        }

        $groups = PermissionGroup::with('permissions')->get();

        return Inertia::render('Admin/PermissionGroups/index', compact('groups'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permissions = Permission::whereNull('permission_group_id')->get();

        return response()->json(compact('permissions'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PermissionGroupRequest $request)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('create', PermissionGroup::class);
        $message    = '';
        try {
            if ($response->allowed()) {
                $program = PermissionGroup::create($attributes);

                if ($request->input('permissions') && $program) {
                    Permission::where('id', $request->input('permissions'))->update(['permission_group_id' => $program->id]);
                }

                return back()->with('success', 'Permission group successfully created');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('permission_groups')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PermissionGroupRequest $request, PermissionGroup $permissionGroup)
    {
        $attributes = $request->validated();
        $response   = Gate::inspect('update', $permissionGroup);
        $message    = '';
        try {
            if ($response->allowed()) {
                $permissionGroup->update($attributes);

                if ($request->input('permissions') && $permissionGroup) {
                    Permission::where('id', $request->input('permissions'))->update(['permission_group_id' => $permissionGroup->id]);
                }

                return back()->with('success', 'Permission group successfully updated');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('permission_groups')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PermissionGroup $permissionGroup)
    {
        $response = Gate::inspect('delete', $permissionGroup);
        $message  = '';
        try {
            if ($response->allowed()) {
                $permissionGroup->delete();

                return back()->with('success', 'Permission group successfully deleted');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('permission_groups')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->with('error', $message);
    }
}
