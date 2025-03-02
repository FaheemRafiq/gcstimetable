<?php

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
        Schema::create('departments', static function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // unique code for each department  is department code
            $table->string('code');
            
            // belongs to some institution
            $table->foreignIdFor(\App\Models\Institution::class)->constrained()->cascadeOnDelete();

            // Define a unique constraint for 'code' and 'institution_id' combination
            $table->unique(['code', 'institution_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
