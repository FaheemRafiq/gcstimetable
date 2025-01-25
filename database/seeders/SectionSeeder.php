<?php

namespace Database\Seeders;

use App\Models\Semester;
use Illuminate\Database\Seeder;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // create one section against every Semester
        $semesters = Semester::all();

        foreach ($semesters as $semester) {
            $semester->sections()->create([
                'name' => 'A',
            ]);
        }

        // for BBA and BSCS  Semesters 1 to 3  create two Sections and name them G1 and G2

        $semesters = Semester::where(function ($query) {
            $query->where('name', 'like', '%BBA%')
                ->orWhere('name', 'like', '%BSCS%');
        })->whereIn('number', [1, 2, 3])->get();

        foreach ($semesters as $semester) {
            // Check if the semester is in Semesters 1 to 3
            $semester->sections()->create([
                'name' => 'G1',
            ]);
            $semester->sections()->create([
                'name' => 'G2',
            ]);
        }
    }
}
