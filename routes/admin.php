<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\DayController;
use App\Http\Controllers\Admin\RoomController;
use App\Http\Controllers\Admin\SlotController;
use App\Http\Controllers\Admin\ShiftController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\ImportController;
use App\Http\Controllers\Admin\ProgramController;
use App\Http\Controllers\Admin\SectionController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\SemesterController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\TimeTableController;
use App\Http\Middleware\RoleOrPermissionMiddleware;
use App\Http\Controllers\Admin\AllocationController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\InstitutionController;

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
    ->group(function (): void {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Users 🧑‍🤝‍🧑
        Route::resource('users', UserController::class)->only(UserController::ONLY);

        // Students 🧑‍🎓
        Route::resource('students', StudentController::class)->only(StudentController::ONLY);

        // Teachers 🧑‍🏫
        Route::resource('teachers', TeacherController::class)->only(TeacherController::ONLY);
        Route::get('/teachers/{teacher}/workload', [TeacherController::class, 'showWorkload'])->name('teachers.workload');

        // Time Table Resource 📆
        Route::resource('timetables', TimeTableController::class)->only(TimeTableController::ONLY);
        Route::get('/timetables/{timetable}/add/allocations', [TimeTableController::class, 'addAllocations'])->name('timetables.add.allocations');
        Route::patch('/teachers/{teacher}/change-status', [TeacherController::class, 'changeStatus'])->name('teachers.change.status');

        // Allocations 🔹
        Route::resource('allocations', AllocationController::class)->only(AllocationController::ONLY);
        Route::post('allocations/bulk/store', [AllocationController::class, 'bulkStore'])->name('allocations.bulk.store');
        Route::delete('allocations/bulk/destroy', [AllocationController::class, 'bulkDestroy'])->name('allocations.bulk.destroy');

        // Institutions 🏢
        Route::resource('institutions', InstitutionController::class)->only(InstitutionController::ONLY);

        // Departments 🏢
        Route::resource('departments', DepartmentController::class)->only(DepartmentController::ONLY);
        Route::get('/departments/{department}/workload', [DepartmentController::class, 'showTeacherWorkload'])->name('departments.teacher-workload');

        // Rooms 🏫
        Route::resource('rooms', RoomController::class)->only(RoomController::ONLY);

        // Shifts ⏲️
        Route::resource('shifts', ShiftController::class)->only(ShiftController::ONLY);

        // Programs 📚
        Route::resource('programs', ProgramController::class)->only(ProgramController::ONLY);

        // Semesters 📅
        Route::resource('semesters', SemesterController::class)->only(SemesterController::ONLY);
        Route::prefix('semesters')->group(function (): void {
            Route::get('attach/{semester}', [SemesterController::class, 'attachCourse'])->name('semester.attach.courses');
            Route::post('attach/{semester}', [SemesterController::class, 'attach'])->name('semester.attach');
        });

        // Sections 📂
        Route::resource('sections', SectionController::class)->only(SectionController::ONLY);

        // slots 🎰
        Route::resource('slots', SlotController::class)->only(SlotController::ONLY);

        // Courses 📖
        Route::resource('courses', CourseController::class)->only(CourseController::ONLY);
        Route::prefix('courses')->group(function (): void {
            Route::get('attach/{course}', [CourseController::class, 'attachSemester'])->name('courses.attach.semester');
            Route::post('attach/{course}', [CourseController::class, 'attach'])->name('courses.attach');
        });

        // Days 📆
        Route::get('days', [DayController::class, 'index'])->name('days.index');
        Route::patch('days/{day}', [DayController::class, 'change_status'])->name('days.change.status');

        Route::get('import', [ImportController::class, 'index'])->name('import.index');
        Route::post('import', [ImportController::class, 'store'])->name('import.store');
        Route::get('export/template', [ImportController::class, 'exportTemplate'])->name('export.template');
    });
