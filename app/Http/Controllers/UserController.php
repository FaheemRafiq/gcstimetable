<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use App\Enums\RoleEnum;
use App\Models\Department;
use App\Models\Institution;
use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Database\QueryException;

class UserController extends Controller
{
    public const ONLY = ['index', 'edit', 'update', 'destroy'];

    /**
     * Show the list of users.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        if (Gate::denies('viewAny', User::class)) {
            abort(403);
        }

        $admin      = Auth::user();
        $search     = $request->query('s');
        $verified   = $request->query('verified', 1);
        $unverified = $request->query('unverified', 1);
        $start_date = $request->query('start_date', null);
        $end_date   = $request->query('end_date', null);

        $users = User::query()
            ->select('id', 'name', 'email', 'email_verified_at', 'created_at')
            ->when($admin->isInstitutionAdmin(), function ($query) use ($admin): void {
                $query->whereInstitution($admin->institution_id);
            })
            ->when($admin->isDepartmentAdmin(), function ($query) use ($admin): void {
                $query->whereDepartment($admin->department_id);
            })
            ->when($search, function ($query) use ($search): void {
                $query->where(function ($wQuery) use ($search) {
                    $wQuery->where('name', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%");
                });
            })
            ->when($verified == 'false', function ($query) {
                $query->whereNull('email_verified_at');
            })
            ->when($unverified == 'false', function ($query) {
                $query->whereNotNull('email_verified_at');
            })
            ->when($start_date, function ($query) use ($start_date) {
                $query->where('created_at', '>=', $start_date);
            })
            ->when($end_date, function ($query) use ($end_date) {
                $query->where('created_at', '<=', $end_date);
            })
            ->with('roles.permissions')
            ->paginate($request->input('per_page', config('providers.pagination.per_page')));

        return Inertia::render('Admin/Users/index', [
            'users' => UserResource::collection($users)->withQuery($request->query()),
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @return \Inertia\Response
     */
    public function edit(User $user)
    {
        $admin               = Auth::user();
        $response            = Gate::inspect('update', $user);
        $departmentBuilder   = Department::query();
        $insstitutionBuilder = Institution::query();
        $roleBuilder         = Role::query();

        if ($response->allowed()) {
            if ($admin->isInstitutionAdmin()) {
                $departmentBuilder->where('institution_id', $admin->institution_id);
                $insstitutionBuilder->where('id', $admin->institution_id);
                $roleBuilder->institutionRoles($admin->institution_id);
            }

            $user->load('roles.permissions');

            return Inertia::render('Admin/Users/edit', [
                'user'         => new UserResource($user),
                'roles'        => $roleBuilder->get(['id', 'name', 'institution_id']),
                'departments'  => $departmentBuilder->get(['id', 'name']),
                'institutions' => $admin->isSuperAdmin() ? $insstitutionBuilder->get(['id', 'name']) : [],
            ]);
        }

        return back()->with('error', $response->message());
    }

    /**
     * Update the specified user's information.
     *
     * @param  UserRequest  $request  The request containing user data.
     * @param  User  $user  The user to be updated.
     * @return \Illuminate\Http\RedirectResponse Redirects with a success message if the update is allowed, otherwise with an error message.
     */
    public function update(UserRequest $request, User $user)
    {
        $admin      = Auth::user();
        $response   = Gate::inspect('update', [User::class, $user]);
        $attributes = $request->validated();
        $message    = '';

        try {
            if ($response->allowed()) {
                if ($request->has('roles') && $request->filled('roles') && ! $admin->isDepartmentAdmin()) {
                    $redirectResponse = $this->syncRoles($request, $user);

                    if ($redirectResponse instanceof RedirectResponse) {
                        return $redirectResponse;
                    }
                }

                $user->update($attributes);

                return back()->with('success', 'User updated successfully.');
            } else {
                $message = $response->message();
            }
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('users')->error('QueryException', $logData);

            $message = 'Database error 👉 Something went wrong!';
        }

        return back()->withErrors(['message' => $message]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(User $user)
    {
        if (! $user) {
            return back()->with('error', 'User not found.');
        }

        $response = Gate::inspect('delete', [User::class, $user]);

        if ($response->allowed()) {
            if (! $user->isStudent() && ! $user->isTeacher()) {
                return back()->with('error', sprintf("User, %s can't be deleted.", $user->name));
            }

            if ($user->roles->count() > 0) {
                $user->roles()->detach();
            }

            $user->delete();

            return back()->with('success', 'User deleted successfully.');
        }

        return back()->withErrors(['message' => $response->message()]);
    }

    /**
     * Assign role to user
     *
     *
     * @return \Illuminate\Http\RedirectResponse|bool
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    private function syncRoles(Request $request, User $user)
    {
        $admin    = Auth::user();
        $response = Gate::inspect('manage_roles', User::class);

        if (! $response->allowed()) {
            return back()->withErrors(['message' => $response->message()]);
        }

        $request->validate([
            'roles'   => 'array|required',
            'roles.*' => 'exists:roles,id',
        ]);

        try {
            $roles = Role::whereIn('id', $request->roles)->get();

            // Define required role conditions
            $requiredRoles = [
                RoleEnum::INSTITUTION_ADMIN->value,
                RoleEnum::DEPARTMENT_ADMIN->value,
            ];

            $roleNamesMessage = 'One role (Institution Admin or Department Admin) must be assigned to assign other roles.';

            if ($admin->isSuperAdmin()) {
                $requiredRoles[]  = RoleEnum::SUPER_ADMIN->value;
                $roleNamesMessage = 'One role (Super Admin, Institution Admin, or Department Admin) must be assigned to assign other roles.';
            }

            if (! $roles->pluck('name')->intersect($requiredRoles)->count()) {
                return back()->withErrors(['message' => $roleNamesMessage]);
            }

            // Handle Institution Admin role assignments
            if ($roles->contains('name', RoleEnum::INSTITUTION_ADMIN->value)) {
                if (is_null($user->institution_id) && $admin->isInstitutionAdmin()) {
                    $user->institution_id = $admin->institution_id;
                } elseif ($admin->isSuperAdmin()) {
                    $request->validate(['institution_id' => 'required|exists:institutions,id'], [
                        'institution_id.required' => 'Please select an institution for Institution Admin.',
                    ]);

                    if ($user->institution_id !== $request->institution_id) {
                        $user->institution_id = $request->institution_id;
                    }
                }

                if ($user->department_id !== null) {
                    $user->department_id = null;
                }
            }

            // Handle Department Admin role assignments
            if ($roles->contains('name', RoleEnum::DEPARTMENT_ADMIN->value)) {
                if ($admin->isInstitutionAdmin()) {
                    if ($user->institution_id !== $admin->institution_id) {
                        $user->institution_id = $admin->institution_id;
                    }
                } elseif ($admin->isSuperAdmin()) {
                    $request->validate([
                        'institution_id' => 'required|exists:institutions,id',
                        'department_id'  => 'required|exists:departments,id',
                    ], [
                        'institution_id.required' => 'Please select an institution for Institution Admin.',
                        'department_id.required'  => 'Please select a department for Department Admin.',
                    ]);

                    if ($user->institution_id !== $request->institution_id) {
                        $user->institution_id = $request->institution_id;
                    }
                }

                if ($user->department_id !== $request->department_id) {
                    $user->department_id = $request->department_id;
                }
            }

            $roles = Role::whereIn('id', $request->roles)
                ->where(function ($query) use ($user) {
                    $query->whereNull('institution_id')
                        ->orWhere('institution_id', $user->institution_id);
                })
                ->get();

            if (count($request->roles) > $roles->count()) {
                return back()->withErrors(['message' => 'Only global or user team roles can be assigned to this user.']);
            }

            $user->save();

            if ($roles->count() > 0) {
                if ($admin->isSuperAdmin()) {
                    setPermissionsTeamId($user->institution_id);
                }

                $user->roles()->detach();

                foreach ($roles as $role) {
                    setPermissionsTeamId($role->institution_id);

                    $user->assignRole($role);
                }

                setPermissionsTeamId($admin->institution_id);
            }

            return true;
        } catch (QueryException $queryException) {
            $logData = ['message' => $queryException->getMessage(), 'file' => $queryException->getFile(), 'line' => $queryException->getLine()];
            Log::channel('users')->error('QueryException', $logData);
        }

        return back()->withErrors(['message' => 'Database error 👉 Something went wrong!']);
    }
}
