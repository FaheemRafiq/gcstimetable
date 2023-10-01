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
        Schema::create('slots', function (Blueprint $table) {
            $table->id();
           
            $table->string('code');
            // slot name
            $table->string('name');
            // slot starting time 
            $table->time('start_time');
            // slot ending time
            $table->time('end_time');

            // isPractical is by default false
            $table->boolean('is_practical')->default(false);

            // belongs to some shift
            $table->foreignId('shift_id')->constrained()->onDelete('cascade');

            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slots');
    }
};
