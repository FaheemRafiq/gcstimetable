<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $faker = \Faker\Factory::create('en_US'); // create a French faker

        return [
            'name' => $faker->name,
            'personnel_number' => $faker->unique()->randomNumber(5), // Generates a unique random personnel number
            'email' => $faker->unique()->safeEmail,
            'cnic' => $faker->unique()->regexify('[0-9]{5}-[0-9]{7}-[0-9]{1}'),
            'phone_number' => $faker->unique()->phoneNumber,
            'bank_iban' => $faker->unique()->iban('PK'), // Generates a unique IBAN for Pakistan
            'isMale' => $faker->boolean, // Randomly set to true or false
            'date_of_birth' => $faker->date,
            'date_of_joining_in_this_college' => $faker->date,
            'date_of_joining_govt_service' => $faker->date,
            'date_of_joining_current_rank' => $faker->date,
            'father_name' => $faker->name,
            'seniority_number' => $faker->unique()->numberBetween(1, 1000),
            'qualification' => $faker->randomElement(['MSc', 'BS(Hons)', 'MPhil', 'PhD']),
            'highest_degree_awarding_institute' => $faker->word,
            'highest_degree_awarding_country' => $faker->word,
            'highest_degree_awarding_year' => $faker->year,
            'degree_title' => $faker->word,
            'rank' => $faker->randomElement(['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor']),
            'position' => $faker->randomElement(['HOD', 'Regular', 'Vice Principal', 'Principal', null]),
            'department_id' => function () {
                return \App\Models\Department::inRandomOrder()->first()->id; // Assuming you have a Department model and factory
            },
            'isvisiting' => $faker->boolean,
            'is_active' => $faker->randomElement(['active', 'inactive']),
        ];
    }
}
