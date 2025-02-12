<?php

namespace App\Policies;

use App\Models\User;
use App\Enums\PermissionEnum;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionEnum::VIEW_USERS);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        return $user->can(PermissionEnum::VIEW_USER->value) || $user->id === $model->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): Response
    {
        return $user->can(PermissionEnum::EDIT_USER->value) || $user->id === $model->id
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): Response
    {
        return ($user->can(PermissionEnum::DELETE_USER->value) || $user->id === $model->id)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function manage_roles(User $user): Response
    {
        return $user->can(PermissionEnum::MANAGE_USER_ROLES)
            ? Response::allow()
            : Response::deny('You do not have permission to manage user roles.');
    }
}
