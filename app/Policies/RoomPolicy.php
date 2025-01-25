<?php

namespace App\Policies;

use App\Models\Room;
use App\Models\User;
use App\Enums\PermissionEnum;
use Illuminate\Auth\Access\Response;

class RoomPolicy
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
    public function view(User $user, Room $room): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->can(PermissionEnum::CREATE_ROOM->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Room $room): Response
    {
        return $user->can(PermissionEnum::EDIT_ROOM->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Room $room): Response
    {
        return $user->can(PermissionEnum::DELETE_ROOM->value)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Room $room): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Room $room): bool
    {
        //
    }
}
