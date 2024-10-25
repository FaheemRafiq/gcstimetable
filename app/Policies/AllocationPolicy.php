<?php

namespace App\Policies;

use App\Models\Allocation;
use App\Models\User;
use App\PermissionEnum;
use Illuminate\Auth\Access\Response;

class AllocationPolicy
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
    public function view(User $user, Allocation $allocation): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->can(PermissionEnum::CREATE_ALLOCATION->value)
                ? Response::allow() :
                Response::deny(config('providers.permission_error_msg'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Allocation $allocation): Response
    {
        return $user->can(PermissionEnum::EDIT_ALLOCATION->value)
            ? Response::allow() :
            Response::deny(config('providers.permission_error_msg'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Allocation $allocation): bool
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Allocation $allocation): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Allocation $allocation): bool
    {
        //
    }
}
