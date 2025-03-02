<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations. 👌
     */
    public function up(): void
    {
        Schema::create('allocations', function (Blueprint $table) {
            $table->id();

            // foreign key to course 📚
            $table->foreignIdFor(\App\Models\Course::class)->nullable()->constrained()->cascadeOnDelete();
            // foreign key to teacher 👨‍🏫
            $table->foreignIdFor(\App\Models\Teacher::class)->nullable()->constrained()->nullOnDelete();
            // foreign key to room 🏢
            $table->foreignIdFor(\App\Models\Room::class)->nullable()->constrained()->nullOnDelete();
            // foreign key to day 📅
            $table->foreignIdFor(\App\Models\Day::class)->constrained()->cascadeOnDelete();
            // foreign key to slot ⏰
            $table->foreignIdFor(\App\Models\Slot::class)->constrained()->cascadeOnDelete();
            // foreign key to section 🧑‍🎓
            $table->foreignIdFor(\App\Models\Section::class)->nullable()->constrained()->cascadeOnDelete();
            // foreign key to timetables ⏲️
            $table->foreignIdFor(\App\Models\TimeTable::class)->constrained()->cascadeOnDelete();

            // Allocation Name
            $table->string('name')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allocations');
    }
};
