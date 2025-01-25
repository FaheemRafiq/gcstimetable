<?php

namespace Database\Factories;

use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $program = Program::inRandomOrder()->whereHas('semesters')->with(['semesters' => fn ($q) => $q->inRandomOrder()->first(), 'institution'])->first();

        return [
            'name'           => fake()->name(),
            'email'          => fake()->unique()->safeEmail(),
            'mobile'         => fake()->phoneNumber(),
            'program_id'     => $program->id                      ?? null,
            'semester_id'    => $program->semesters?->first()->id ?? null,
            'institution_id' => $program->institution->id,
        ];
    }
}
