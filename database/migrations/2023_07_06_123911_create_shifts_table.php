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
        Schema::create('shifts', function (Blueprint $table) {

            $table->id();
            $table->string('name');
            // shifts of institution
            $table->foreignIdFor(Institution::class)->constrained()->cascadeOnDelete();
            $table->enum('type', ['Morning', 'Afternoon' ,'Evening'])->nullable();
            $table->is_active();
            // program type
            $table->enum('program_type', ['ADP', 'INTER', 'BS'])->default('BS');

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
