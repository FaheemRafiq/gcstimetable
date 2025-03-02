<?php

namespace App\Policies;

use App\Models\Day;
use App\Models\User;
use App\Enums\PermissionEnum;
use Illuminate\Auth\Access\Response;

class DayPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): Response
    {
        return $user->can(PermissionEnum::VIEW_DAYS)
            ? Response::allow()
            : Response::deny(config('providers.permission.view_any.error'));
    }

    public function change_status(User $user, Day $day): Response
    {
        return $user->can(PermissionEnum::CHANGE_DAY_STATUS)
            ? Response::allow()
            : Response::deny(config('providers.permission.action.error'));
    }
}
