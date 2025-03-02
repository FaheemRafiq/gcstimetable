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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');

            $table->string('code');

            $table->integer('capacity');
            // create a column so it could be either Intermediate , BS or both   enum
            $table->enum('type', ['INTER', 'BS', 'BOTH']);
            // is_available
            $table->boolean('is_available');

            // belongs to some institution
            $table->foreignIdFor(\App\Models\Institution::class)->constrained()->cascadeOnDelete();

            $table->unique(['code', 'institution_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
