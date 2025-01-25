<?php

namespace Database\Seeders;

use App\Models\TimeTable;
use Illuminate\Database\Seeder;

class TimeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timeTables = [
            [
                'id'          => 1,
                'title'       => '1st Year Morning Shift College Time Table 2024-2025',
                'description' => 'This time table is only for the college students.',
                'shift_id'    => 1,
                'created_at'  => '2024-10-13 13:18:38',
                'updated_at'  => '2024-10-15 18:41:43',
            ],
            [
                'id'          => 2,
                'title'       => 'BS College Time Table 2024-2025',
                'description' => 'This time table is only for BS Evening Students',
                'shift_id'    => 4,
                'created_at'  => '2024-10-16 02:03:07',
                'updated_at'  => '2024-10-16 02:04:01',
            ],
        ];

        foreach ($timeTables as $key => $table) {
            TimeTable::create($table);
        }
    }
}
