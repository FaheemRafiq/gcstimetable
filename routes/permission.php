<?php

use App\Enums\RoleEnum;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\PermissionController;

$roleMiddleware = 'role:'.RoleEnum::SUPER_ADMIN->value;

Route::prefix('admin')->middleware(['auth', $roleMiddleware])->group(function () {
    // Roles and Permissions Management
    Route::resource('roles', RoleController::class)->only(RoleController::ONLY);
    Route::resource('permissions', PermissionController::class)->only(PermissionController::ONLY);

    // Assign and Revoke Roles to/from Users
    Route::post('users/{user}/assign-role', [UserRoleController::class, 'assignRole'])->name('users.assign-role');
    Route::post('users/{user}/revoke-role', [UserRoleController::class, 'revokeRole'])->name('users.revoke-role');

    // Assign and Revoke Permissions to/from Roles
    Route::post('roles/{role}/assign-permission', [RoleController::class, 'assignPermission'])->name('roles.assign-permission');
    Route::post('roles/{role}/revoke-permission', [RoleController::class, 'revokePermission'])->name('roles.revoke-permission');
});
