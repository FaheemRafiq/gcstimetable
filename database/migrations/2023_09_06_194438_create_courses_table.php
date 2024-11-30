<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        /* TODO: Course can be taught by different department
             so that only the relevant teachers are displayed against the course   and it will also help in getting the department related courses
            It will be a many to many relation
        */

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            // course name
            $table->string('name');

            // isDefault
            $table->boolean('is_default')->default(false);

            // course DisplayCode
            $table->string('display_code');

            $table->string('code');
            // course credit hours
            $table->integer('credit_hours')->default(3);
            // course type
            $table->enum('type', ['CLASS', 'LAB'])->default('CLASS');

            $table->foreignId('semester_id')->constrained('semesters')->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
