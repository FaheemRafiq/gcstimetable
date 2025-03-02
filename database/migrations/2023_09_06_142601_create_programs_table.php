<?php

use App\Models\Program;
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
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            // program name
            $table->string('name');
            // program code
            $table->string('code');
            // program duration
            $table->integer('duration')->default(4);
            // program type
            $table->enum('type', [array_keys(Program::TYPES)])->default('BS');

            // Offered by which department
            $table->foreignIdFor(\App\Models\Department::class)->constrained()->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
