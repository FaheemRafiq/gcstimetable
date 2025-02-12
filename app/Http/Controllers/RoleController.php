<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use App\Enums\RoleEnum;
use App\Models\Permission;
use App\Models\Institution;
use App\Http\Requests\RoleRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\QueryException;
use Illuminate\Contracts\Auth\Authenticatable;

class RoleController extends Controller
{
    public const ONLY = ['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'];

    public function __construct()
    {
        $this->middleware('role:'.RoleEnum::SUPER_ADMIN->value.'|'.RoleEnum::INSTITUTION_ADMIN->value);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Gate::denies('viewAny', Role::class)) {
            abort(403);
        }

        $user         = Auth::user();
        $queryBuilder = Role::query();

        if ($user->isInstitutionAdmin()) {
            $queryBuilder->institutionRoles($user->institution_id);
        }

        $roles = $queryBuilder
            ->withCount('permissions')
            ->get();

        return Inertia::render('Admin/Roles/index', compact('roles'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (Gate::denies('create', Role::class)) {
            abort(403);
        }

        $user         = Auth::user();
        $permissions  = $this->getPermissions();
        $institutions = [];

        if ($user->isSuperAdmin()) {
            $institutions = Institution::select(['id as key', 'name as value'])->get();
        }

        return Inertia::render('Admin/Roles/rolePage', compact('permissions', 'institutions'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        $request->validated();

        $attributes = $request->except('permissions');
        $response   = Gate::inspect('create', Role::class);
        $message    = '';
        try {
            if ($response->allowed()) {
                $role = Role::create($attributes);

                $role->permissions()->sync($request->input('permissions'));

                return redirect(route('roles.index'))->with('success', 'Role created successfully');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('roles')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        if (Gate::denies('view', $role)) {
            abort(403);
        }

        $role->load('permissions', 'institution:id,name');
        $permissions  = $this->getPermissions();

        return Inertia::render('Admin/Roles/show', compact('role', 'permissions'));
    }

    public function edit(Role $role)
    {
        $user             = Auth::user();
        $redirectResponse = $this->validateUser($user, $role);

        if ($redirectResponse) {
            return $redirectResponse;
        }

        $role->load('permissions');
        $permissions  = $this->getPermissions();
        $institutions = [];

        if ($user->isSuperAdmin()) {
            $institutions = Institution::select(['id as key', 'name as value'])->get();
        }

        return Inertia::render('Admin/Roles/rolePage', compact('role', 'permissions', 'institutions'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, Role $role)
    {
        $user             = Auth::user();
        $redirectResponse = $this->validateUser($user, $role);

        if ($redirectResponse) {
            return $redirectResponse;
        }

        $request->validated();

        $attributes = $request->except('permissions');
        $response   = Gate::inspect('update', $role);
        $message    = '';
        try {
            if ($response->allowed()) {
                $role->update($attributes);

                $role->permissions()->sync($request->input('permissions'));

                return redirect(route('roles.index'))->with('success', 'Role updated successfully');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('roles')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $user = Auth::user();

        $redirectResponse = $this->validateUser($user, $role, 'delete');

        if ($redirectResponse) {
            return $redirectResponse;
        }

        $response = Gate::inspect('delete', $role);
        $message  = '';
        try {
            if ($response->allowed()) {
                $role->delete();

                return back()->with('success', 'Role deleted successfully');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('roles')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Validate user permissions for the given role.
     *
     * @param  string  $scope  (default: 'update')
     * @return \Illuminate\Http\RedirectResponse|null
     */
    protected function validateUser(User|Authenticatable $user, Role $role, string $scope = 'update')
    {
        $message = "You do not have permission to $scope this role.";

        // Check if the user is authorized for the given scope (e.g., 'update', 'delete')
        if (Gate::denies($scope, $role)) {
            return back()->with('error', $message);
        }

        // If the user is not a Super Admin, ensure they only modify roles within their institution
        if (! $user->isSuperAdmin() && ($role->institution_id !== $user->institution_id || is_null($role->institution_id))) {
            return back()->with('error', $message);
        }

        // Return null if validation passes (so the calling function continues execution)
        return null;
    }

    public function getPermissions()
    {
        $user         = Auth::user();
        $queryBuilder = Permission::query();

        if (! $user->isSuperAdmin()) {
            $queryBuilder->whereNotLike('name', '%institute%')->whereNotLike('name', '%permission%');
        }

        return $queryBuilder->get();
    }
}
