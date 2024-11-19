<?php

namespace App\Policies;

use App\Models\Slot;
use App\Models\User;
use App\PermissionEnum;
use Illuminate\Auth\Access\Response;

class SlotPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Slot $slot): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->can(PermissionEnum::CREATE_SLOT->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Slot $slot): Response
    {
        return $user->can(PermissionEnum::EDIT_SLOT->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Slot $slot): Response
    {
        return $user->can(PermissionEnum::DELETE_SLOT->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Slot $slot): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Slot $slot): bool
    {
        //
    }
}
