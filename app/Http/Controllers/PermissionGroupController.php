<?php

namespace App\Http\Controllers;

use Gate;
use Exception;
use Inertia\Inertia;
use App\Models\Permission;
use App\Models\PermissionGroup;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
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
                    Permission::whereIn('id', $request->input('permissions'))->update(['permission_group_id' => $program->id]);
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
     * Update the specified permission group in storage.
     *
     * @throws Exception
     */
    public function update(PermissionGroupRequest $request, PermissionGroup $permissionGroup): RedirectResponse
    {
        // Start a database transaction to ensure atomicity
        try {
            DB::beginTransaction();

            $attributes = $request->validated();
            $response   = Gate::inspect('update', $permissionGroup);

            if (! $response->allowed()) {
                throw new \Exception($response->message() ?: 'Unauthorized action on permission group.');
            }

            // Update the permission group attributes
            $permissionGroup->update($attributes);

            $newPermissions = $request->input('permissions', []); // Default to empty array if null

            // Handle permissions update within the transaction
            if (! empty($newPermissions)) {
                // Detach permissions not in the new list
                Permission::where('permission_group_id', $permissionGroup->id)
                    ->whereNotIn('id', $newPermissions)
                    ->update(['permission_group_id' => null]);

                // Attach new permissions to the group
                Permission::whereIn('id', $newPermissions)
                    ->whereNull('permission_group_id') // Ensure we don't duplicate assignments
                    ->update(['permission_group_id' => $permissionGroup->id]);
            } else {
                // Detach all permissions if the new permissions list is empty
                Permission::where('permission_group_id', $permissionGroup->id)
                    ->update(['permission_group_id' => null]);
            }

            // Commit the transaction
            DB::commit();

            return redirect()->back()->with('success', 'Permission group successfully updated');
        } catch (QueryException $queryException) {
            DB::rollBack();
            $logData = [
                'message' => $queryException->getMessage(),
                'file'    => $queryException->getFile(),
                'line'    => $queryException->getLine(),
                'trace'   => $queryException->getTrace(),
            ];
            Log::channel('permission_groups')->error('Database Query Exception', $logData);

            return redirect()->back()->withErrors(['message' => 'Database error: Something went wrong!']);
        } catch (Exception $e) {
            DB::rollBack();
            $logData = [
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
                'trace'   => $e->getTrace(),
            ];
            Log::channel('permission_groups')->error('Exception while updating permission group', $logData);

            return redirect()->back()->withErrors(['message' => $e->getMessage() ?: 'An error occurred while updating the permission group.']);
        }
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
