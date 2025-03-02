<?php

use App\Models\Program;
use App\Models\Shift;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {

            $table->id();
            $table->string('name');
            // shifts of institution
            $table->foreignIdFor(\App\Models\Institution::class)->constrained()->cascadeOnDelete();
            $table->enum('type', [array_keys(Shift::TYPES)])->nullable();
            $table->is_active();
            // program type
            $table->enum('program_type', [array_keys(Program::TYPES)])->default('BS');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
