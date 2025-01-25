<?php

namespace Database\Seeders;

use App\Models\Room;
// import faker
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $institution_id = 1;

        for ($i = 1; $i <= 200; $i++) {
            Room::create([
                'name'     => 'R-'.$i,
                'code'     => 'R-'.$i,
                'capacity' => 50,
                // type would be random
                'type' => $faker->randomElement(['INTER', 'BS', 'BOTH']),

                'isavailable'    => true,
                'institution_id' => $institution_id,
            ]);
        }

        $institution_id = 2;

        // create room with same pattern upto 200
        for ($i = 1; $i <= 200; $i++) {
            Room::create([
                'name'     => 'R-'.$i,
                'code'     => 'R-'.$i,
                'capacity' => 50,
                // type would be random
                'type' => $faker->randomElement(['INTER', 'BS', 'BOTH']),

                'isavailable'    => true,
                'institution_id' => $institution_id,
            ]);
        }
    }
}
