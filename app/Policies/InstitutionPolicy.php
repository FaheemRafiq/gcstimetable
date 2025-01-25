<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Institution;
use App\Enums\PermissionEnum;
use Illuminate\Auth\Access\Response;

class InstitutionPolicy
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
    public function view(User $user, Institution $institution): Response
    {
        return $user->can(PermissionEnum::VIEW_INSTITUTE->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.view.error'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->can(PermissionEnum::CREATE_INSTITUTE->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Institution $institution): Response
    {
        return $user->can(PermissionEnum::EDIT_INSTITUTE->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Institution $institution): Response
    {
        return $user->can(PermissionEnum::DELETE_INSTITUTE->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Institution $institution): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Institution $institution): bool
    {
        //
    }
}
