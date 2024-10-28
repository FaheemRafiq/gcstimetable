<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class TruncateDBTables extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:truncate {--model=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Truncate all tables of Database.';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        if(app()->environment() !== 'local'){
            throw new \Exception('Command only available in Local environment.');
        }

        $this->truncateAllTables();
    }

    public function truncateAllTables()
    {
        Schema::disableForeignKeyConstraints();

        $modelName      = $this->option('model');
        $modelClass     = sprintf("App\\Models\\%s", $modelName);
        $modelInstance  = null;
        
        if($modelName){
            if (class_exists($modelClass)) {
                $modelInstance = resolve($modelClass);
            } else {
                $this->fail("Model {$modelName} does not exist.");
            }
        }
        $singleTable    = $modelInstance?->getTable();

        $tables = DB::select('SHOW TABLES');
        $tableKey = 'Tables_in_' . env('DB_DATABASE');

        foreach ($tables as $table) {
            $tableName = $table->$tableKey;

            if ($singleTable && $singleTable !== $tableName) {
                continue;
            }

            DB::table($tableName)->truncate();
        }

        Schema::enableForeignKeyConstraints();

        $this->info($singleTable ? "Table {$singleTable} truncated successfully." : 'All tables truncated successfully.');
    }
}
