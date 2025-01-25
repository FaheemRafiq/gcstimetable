<?php

namespace App\Http\Middleware;

use Closure;
use App\Enums\RoleEnum;
use Illuminate\Http\Request;
use App\Enums\PermissionEnum;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleOrPermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request):Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Check if the user is SUPER_ADMIN or has the required permission
        if ($user->hasRole(RoleEnum::SUPER_ADMIN->value) ||
            (
                $user->can(PermissionEnum::CAN_ACCESS_DAHSBOARD->value) &&
                $user->hasRole([RoleEnum::INSTITUTION_ADMIN->value, RoleEnum::DEPARTMENT_ADMIN->value])
            )
        ) {
            return $next($request);
        }

        // If the user doesn't meet the condition, redirect or abort
        abort(403, 'Unauthorized access');
    }
}
