<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Course;
use App\Enums\PermissionEnum;
use Illuminate\Auth\Access\Response;

class CoursePolicy
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
    public function view(User $user, Course $course): Response
    {
        return $user->can(PermissionEnum::VIEW_COURSE, $course)
            ? Response::allow()
            : Response::deny(config('providers.permission.view.error'));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->can(PermissionEnum::CREATE_COURSE)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Course $course): Response
    {
        return $user->can(PermissionEnum::EDIT_COURSE, $course)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Course $course): Response
    {
        return $user->can(PermissionEnum::DELETE_COURSE, $course)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Course $course): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Course $course): bool
    {
        //
    }

    /**
     * Determine whether the user can attach semester to the course.
     */
    public function attach(User $user, Course $course): Response
    {
        return $user->can(PermissionEnum::COURSE_ATTACH_SEMESTER, $course)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }
}
