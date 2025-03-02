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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // unique code for each teacher  is personnel number
            $table->string('personnel_number')->unique();
            // teacher email
            $table->string('email')->unique()->nullable();

            // teacher cnic
            $table->string('cnic')->unique()->nullable();
            // teacher phone number
            $table->string('phone_number')->unique()->nullable();
            // teacher bank IBAN
            $table->string('bank_iban')->unique()->nullable();
            // teacher gender  is_male  by default true
            $table->boolean('is_male')->default(true);
            // teacher date of birth
            $table->date('date_of_birth')->nullable();
            // teacher date of joining in this college
            $table->date('date_of_joining_in_this_college')->nullable();
            // teacher date of joining in Govt Service
            $table->date('date_of_joining_govt_service')->nullable();
            // teacher date of joining in current Rank
            $table->date('date_of_joining_current_rank')->nullable();
            // Teacher Father Name
            $table->string('father_name')->nullable();
            // Teacher Seniority Number
            $table->integer('seniority_number')->default(0);
            // Teacher Qualification  enum type  MSc , MPhil , PhD and by default MPhil
            $table->enum('qualification', ['MSc', 'BS(Hons)', 'MPhil', 'PhD'])->default('MPhil');
            // Teacher Highest Degree Awarding Institute with should by default nullable
            $table->string('highest_degree_awarding_institute')->nullable();
            // Teacher Highest Degree Awarding Country with should by default nullable
            $table->string('highest_degree_awarding_country')->nullable();
            // Highest Degree Awarding Year with should by default nullable
            $table->integer('highest_degree_awarding_year')->nullable();
            // Teacher Degree Title with should by default nullable
            $table->string('degree_title')->nullable();

            // teacher could either be Lecturer , Assistant Professor , Associate Professor or Professor
            $table->enum('rank', ['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor'])->default('Lecturer');

            // Teacher can be HOD , Vice Principal or a Principal
            $table->enum('position', ['HOD', 'Regular', 'Vice Principal', 'Principal'])->nullable()->default('Regular');

            // teacher belongs to some department
            $table->foreignIdFor(\App\Models\Department::class)->constrained();
            // is_visiting
            $table->boolean('is_visiting')->default(false);

            // isActive
            $table->is_active();

            $table->foreignIdFor(\App\Models\User::class)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
