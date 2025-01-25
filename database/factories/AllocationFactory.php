<?php

namespace Database\Factories;

use App\Models\Day;
use App\Models\Room;
use App\Models\Slot;
use App\Models\Course;
use App\Models\Section;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Allocation>
 */
class AllocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = $this->faker;

        $faker->seed(1234);

        $num = $faker->unique()->numberBetween(1, 1000);

        return [

            // foreign key to course
            'course_id' => Course::all()->random()->id,
            // foreign key to teacher
            'teacher_id' => Teacher::all()->random()->id,
            // foreign key to room
            'room_id' => Room::all()->random()->id,
            // foreign key to day
            'day_id' => Day::all()->random()->id,
            // foreign key to slot
            'slot_id' => Slot::all()->random()->id,
            // foreign key to slot
            'section_id' => Section::all()->random()->id,
        ];
    }
}
