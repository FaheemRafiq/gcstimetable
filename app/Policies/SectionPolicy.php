<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Section;
use App\PermissionEnum;
use Illuminate\Auth\Access\Response;

class SectionPolicy
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
    public function view(User $user, Section $section): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->can(PermissionEnum::CREATE_SECTION->value)
        ? Response::allow()
        : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Section $section): Response
    {
        return $user->can(PermissionEnum::EDIT_SECTION->value)
        ? Response::allow()
        : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Section $section): Response
    {
        return $user->can(PermissionEnum::DELETE_SECTION->value)
        ? Response::allow()
        : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Section $section): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Section $section): bool
    {
        //
    }
}
