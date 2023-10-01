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
        /* TODO:  Instead of an attribute   it is better to create shifts 
            and a program belongs to shift and a shift has many programs


*/

        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            // program name
            $table->string('name');
            // program code
            $table->string('code');
            // program duration
            $table->integer('duration')->default(4);
            // program type
            $table->enum('type', ['ADP', 'INTER', 'BS'])->default('BS');
            
            // belongs to some shift
            $table->foreignId('shift_id')->constrained()->onDelete('cascade');            

            // Offered by which department
            $table->foreignId('department_id')->constrained()->onDelete('cascade');

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
