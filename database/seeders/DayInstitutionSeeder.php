<?php

namespace Database\Seeders;

use App\Models\Day;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DayInstitutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $days = Day::all();

        $insitution_id = 1;

        // Create records for days using the array
        foreach ($days as $dayData) {
            $newData['institution_id'] = $insitution_id;
            $newData['day_id']         = $dayData->id;

            DB::table('day_institution')->insert($newData);
        }

        $insitution_id = 2;

        // Create records for days using the array
        foreach ($days as $dayData) {
            $newData['institution_id'] = $insitution_id;
            $newData['day_id']         = $dayData->id;
            // $newData['is_active']      = 'active';

            DB::table('day_institution')->insert($newData);
        }
    }
}
