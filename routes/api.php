<?php

// for Restful API
use App\Enums\RoleEnum;
use Illuminate\Support\Facades\Route;


Route::get('/testing', function () {
    $students = $students = \App\Models\Student::all();

    // update created_at of each student randomly

    foreach ($students as $student) {
        $student->update([
            'created_at' => now()->subDays(rand(1, 30))
        ]);
    }

    return $students;
});