<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PermissionGroupController;

Route::prefix('admin')->middleware('auth')->group(function () {
    // Roles
    Route::resource('roles', RoleController::class)->only(RoleController::ONLY);

    // Permissions
    Route::resource('permissions', PermissionController::class)->only(PermissionController::ONLY);

    // Permission Groups
    Route::resource('permission-groups', PermissionGroupController::class)->only(PermissionGroupController::ONLY);
});
