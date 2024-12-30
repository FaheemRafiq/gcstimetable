<?php

// for Restful API
use App\Enums\RoleEnum;
use App\Models\Course;
use Illuminate\Support\Facades\Route;
use Faker\Factory as Faker;


Route::get('/testing', function () {

    $faker = Faker::create();

    dd($faker->randomElement(array_keys(Course::TYPES)));
});