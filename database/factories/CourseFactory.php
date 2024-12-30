<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'name' => $this->faker->words(3, true),
            'code' => $this->faker->unique()->regexify('[A-Z]{3}[0-9]{3}'),
            'display_code' => $this->faker->unique()->regexify('[A-Z]{3}[0-9]{3}'),
            'credit_hours' => $this->faker->numberBetween(1, 3),
            'semester_id' => $this->faker->numberBetween(1, 10),
        ];
    }
}
