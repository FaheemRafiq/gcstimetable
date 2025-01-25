<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $runique = 'R-'.$this->faker->unique()->numberBetween(1, 150);

        return [

            // name to be a random name such that R- is suffix of a random number
            'name' => $runique,

            // code should be the same Roomname
            'code' => $runique,

            // capacity to be a random number between 50 and 100
            'capacity' => $this->faker->numberBetween(50, 100),
            'type'     => $this->faker->randomElement(['intermediate', 'bs', 'both']),
            // all rooms are available
            'isavailable' => true,

        ];
    }
}
