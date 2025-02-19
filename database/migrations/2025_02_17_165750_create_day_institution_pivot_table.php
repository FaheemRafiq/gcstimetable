<?php

use App\Models\Day;
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
        Schema::create('day_institution', function (Blueprint $table) {
            $table->foreignIdFor(Institution::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Day::class)->constrained()->cascadeOnDelete();
            $table->is_active();

            $table->unique(['institution_id', 'day_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('day_institution');
    }
};
