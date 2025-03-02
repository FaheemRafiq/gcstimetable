<?php

use App\Models\Institution;
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

            $table->foreignIdFor(Institution::class)->constrained()->cascadeOnDelete();

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
