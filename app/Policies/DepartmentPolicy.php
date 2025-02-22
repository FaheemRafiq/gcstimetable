<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Department;
use App\Enums\PermissionEnum;
use Illuminate\Auth\Access\Response;

class DepartmentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Department $department): Response
    {
        return $user->can(PermissionEnum::VIEW_DEPARTMENT->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.view.error'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->can(PermissionEnum::CREATE_DEPARTMENT->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Department $department): Response
    {
        return $user->can(PermissionEnum::EDIT_DEPARTMENT->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Department $department): Response
    {
        return $user->can(PermissionEnum::DELETE_DEPARTMENT->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can view the workload of teachers in the department.
     */
    public function view_teachers_workload(User $user, Department $department): Response
    {
        return $user->can(PermissionEnum::VIEW_TEACHERS_WORKLOAD->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.view.error'));
    }
}
