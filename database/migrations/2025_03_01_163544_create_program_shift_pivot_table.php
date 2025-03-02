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
        Schema::create('program_shift', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Program::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(\App\Models\Shift::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_shift');
    }
};
