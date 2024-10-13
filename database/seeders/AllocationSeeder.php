<?php

namespace Database\Seeders;

use App\Models\Allocation;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class AllocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Allocation::truncate();

        // create allocation for course_id = 1
        try {
            $allocation = new Allocation;
            $allocation->id = 1;
            $allocation->course_id = 1;
            $allocation->teacher_id = 1;
            $allocation->room_id = 1;
            $allocation->day_id = 1;
            $allocation->slot_id = 1;
            $allocation->section_id = 1;
            $allocation->time_table_id = 1;
            $allocation->save();
        } catch (Exception $e) {
            Log::info('Error creating allocation: '.$e->getMessage().' '.$e->getLine());
        }

        try {
            $allocation = new Allocation;
            $allocation->id = 2;
            $allocation->course_id = 1;
            $allocation->teacher_id = 1;
            $allocation->room_id = 1;
            $allocation->day_id = 2;
            $allocation->slot_id = 1;
            $allocation->section_id = 1;
            $allocation->time_table_id = 1;
            $allocation->save();
        } catch (Exception $e) {
            Log::info('Error creating allocation: '.$e->getMessage().' '.$e->getLine());
        }
    }
}
