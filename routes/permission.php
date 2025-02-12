<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;

Route::prefix('admin')->middleware('auth')->group(function () {
    // Roles and Permissions Management
    Route::resource('roles', RoleController::class)->only(RoleController::ONLY);
    Route::resource('permissions', PermissionController::class)->only(PermissionController::ONLY);
});
