<?php

namespace App\Policies;

use App\Models\Shift;
use App\Models\User;
use App\Enums\PermissionEnum;
use Illuminate\Auth\Access\Response;

class ShiftPolicy
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
    public function view(User $user, Shift $shift): Response
    {
        return $user->can(PermissionEnum::VIEW_SHIFT->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.view.error'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->can(PermissionEnum::CREATE_SHIFT->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Shift $shift): Response
    {
        return $user->can(PermissionEnum::EDIT_SHIFT->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Shift $shift): Response
    {
        return $user->can(PermissionEnum::DELETE_SHIFT->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Shift $shift): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Shift $shift): bool
    {
        //
    }
}
