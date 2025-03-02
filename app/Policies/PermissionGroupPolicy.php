<?php

namespace App\Policies;

use App\Models\User;
use App\Enums\PermissionEnum;
use App\Models\PermissionGroup;
use Illuminate\Auth\Access\Response;

class PermissionGroupPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): Response
    {
        return $user->can(PermissionEnum::VIEW_PERMISSION_GROUPS)
            ? Response::allow()
            : Response::deny(config('providers.permission.view_any.error'));
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PermissionGroup $permissionGroup): Response
    {
        return $user->can(PermissionEnum::VIEW_PERMISSION_GROUP)
            ? Response::allow()
            : Response::deny(config('providers.permission.view.error'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->can(PermissionEnum::CREATE_PERMISSION_GROUP)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PermissionGroup $permissionGroup): Response
    {
        return $user->can(PermissionEnum::EDIT_PERMISSION_GROUP)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PermissionGroup $permissionGroup): Response
    {
        return $user->can(PermissionEnum::DELETE_PERMISSION_GROUP)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }
}
