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
        $semesters = Semester::with('program.department')->get();
        $courses   = Course::all();

        $semesters->each(function ($semester) use ($courses) {
            // Ensure we get a fresh collection for random selection
            $randomCourses = $courses
                ->filter(function ($course) use ($semester) {
                    return $course->institution_id == $semester->program->department->institution_id;
                })
                ->shuffle()
                ->take(rand(5, 7));

            // Attach the selected random courses to the semester
            $semester->courses()->syncWithoutDetaching($randomCourses->pluck('id'));
        });
    }
}
