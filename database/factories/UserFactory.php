<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->name();

        return [
            'name'              => $name,
            'email'             => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => 'asdf1234', // password
            // 'two_factor_secret' => null,
            // 'two_factor_recovery_codes' => null,
            'remember_token'     => Str::random(10),
            'profile_photo_path' => generateAvatar($name),

        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (User $user) {
            if ($user->roles()->exists() || ! is_null($user->institution_id) || $user->email === 'sadmin@gmail.com') {
                return;
            }

            $user->institution_id = rand(1, 2);

            $user->save();
        });
    }
}
