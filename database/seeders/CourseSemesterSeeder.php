<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Semester;
use Illuminate\Database\Seeder;

class CourseSemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $semesters = Semester::all();
        $courses   = Course::all();

        $semesters->each(function ($semester) use ($courses) {
            // Take 5-6 random courses
            $randomCourses = $courses->random(rand(5, 6));

            // Create an array of course IDs to attach
            $courseIds = $randomCourses->pluck('id')->toArray();

            // Bulk attach courses to semester
            $semester->courses()->attach($courseIds);
        });
    }
}
