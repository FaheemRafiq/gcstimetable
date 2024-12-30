<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Institution;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $faker          = Faker::create();
        $institutions   = Institution::all();

        foreach ($institutions as $institution) {
            $courses = collect(range(1, 100))->map(function () use ($faker) {
                $courseName = $faker->unique()->sentence(3);
                $courseCode = $this->generateCourseCode($courseName, $faker);

                return [
                    'code'          => $courseCode,
                    'name'          => $courseName,
                    'credit_hours'  => rand(1, 4),
                    'type'          => $faker->randomElement(array_keys(Course::TYPES)),
                    'is_default'    => (bool)rand(0, 1),
                    'display_code'  => $faker->unique()->regexify('[A-Z]{3}[0-9]{3}')
                ];
            });

            $institution->courses()->createMany($courses);
        }
    }

    private function generateCourseCode(string $name, $faker): string
    {
        $prefix = strtoupper(implode(array_map(
            fn($word) => substr($word, 0, 1),
            explode(' ', $name)
        )));
        
        return $prefix . '-' . $faker->unique()->regexify('[A-Z]{3}[0-9]{3}');
    }
}
