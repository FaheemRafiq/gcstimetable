<?php

// for Restful API
use App\Models\Course;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Route;

Route::get('/testing', function (): void {
    $faker = Faker::create();

    dd($faker->randomElement(array_keys(Course::TYPES)));
});
