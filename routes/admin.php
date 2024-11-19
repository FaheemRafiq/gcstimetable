<?php

use App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Middleware\RoleOrPermissionMiddleware;

/*
    |----------------Resource Controllers----------------|
    Route::resource('photos', Controller::class);

    Verb	        URI	                    Action	Route Name
    GET	            /photos	                index	photos.index
    GET	            /photos/create	        create	photos.create
    POST	        /photos	                store	photos.store
    GET	            /photos/{photo}	        show	photos.show
    GET	            /photos/{photo}/edit	edit	photos.edit
    PUT/PATCH	    /photos/{photo}	        update	photos.update
    DELETE	        /photos/{photo}	        destroy	photos.destroy
*/

// Admin Routes 🔒
Route::prefix('admin')
    ->middleware(['auth', 'verified', RoleOrPermissionMiddleware::class])
    ->group(function () {

        Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

        // Users 🧑‍🤝‍🧑
        Route::resource('users', UserController::class);

        // Students 🧑‍🎓
        Route::resource('students', Admin\StudentController::class);

        // Teachers 🧑‍🏫
        Route::resource('teachers', Admin\TeacherController::class);

        // Time Table Resource 📆
        Route::resource('timetables', Admin\TimeTableController::class);
        Route::get('/timetables/{timetable}/add/allocations', [Admin\TimeTableController::class, 'addAllocations'])->name('timetables.add.allocations');

        // Allocations 🔹
        Route::resource('allocations', Admin\AllocationController::class);

        // Rooms 🏫
        Route::resource('rooms', Admin\RoomController::class);

        // Shifts ⏲️
        Route::resource('shifts', Admin\ShiftController::class)->only(Admin\ShiftController::ONLY);

        // Programs 📚
        Route::resource('programs', Admin\ProgramController::class);

        // Semesters 📅
        Route::resource('semesters', Admin\SemesterController::class);

        // Sections 📂
        Route::resource('sections', Admin\SectionController::class);

        // slots 🎰
        Route::resource('slots', Admin\SlotController::class)->only(Admin\SlotController::ONLY);
    });
