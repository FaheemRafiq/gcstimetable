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
        // Retrieve all courses and semesters
        $semesters = Semester::all();
        $courses   = Course::all();

        $semesters->each(function ($semester) use ($courses) {
            // Ensure we get a fresh collection for random selection
            $randomCourses = $courses->shuffle()->take(rand(5, 6));

            // Attach the selected random courses to the semester
            $semester->courses()->syncWithoutDetaching($randomCourses->pluck('id'));
        });
    }
}
