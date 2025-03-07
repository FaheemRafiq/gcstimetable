<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Institution;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $institutions = [
            Institution::first(),
            Institution::latest()->first(),
        ];

        User::factory()
            ->count(50)
            ->for($institutions[rand(0, 1)])
            ->create();

        User::factory()
            ->count(50)
            ->for($institutions[rand(0, 1)])
            ->create();
    }
}
