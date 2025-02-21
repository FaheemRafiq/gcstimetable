<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Teacher;
use App\Enums\PermissionEnum;
use Illuminate\Auth\Access\Response;

class TeacherPolicy
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
    public function view(User $user, Teacher $teacher): Response
    {
        return $user->can(PermissionEnum::VIEW_TEACHER->value) || $user->id === $teacher->user_id
            ? Response::allow()
            : Response::deny(config('providers.permission.view.error'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->can(PermissionEnum::CREATE_TEACHER->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Teacher $teacher): Response
    {
        return $user->can(PermissionEnum::EDIT_TEACHER->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Teacher $teacher): Response
    {
        return $user->can(PermissionEnum::DELETE_TEACHER->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    public function view_workload(User $user, Teacher $teacher): Response
    {
        return $user->can(PermissionEnum::VIEW_TEACHER_WORKLOAD->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.view.error'));
    }

    public function change_status(User $user, Teacher $teacher): Response
    {
        return $user->can(PermissionEnum::CHANGE_TEACHER_STATUS->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }
}
