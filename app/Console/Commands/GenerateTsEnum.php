<?php

namespace App\Console\Commands;

use ReflectionEnum;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GenerateTsEnum extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:ts-enum 
        {enumClass : The fully qualified PHP enum class name} 
        {--output=resources/js/lib/enums : Output directory for TypeScript enums} 
        {--force : Force overwrite existing enum file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate or sync a TypeScript enum from a PHP enum class';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        try {
            // Validate enum class
            $enumClass = $this->argument('enumClass');

            if (! class_exists($enumClass)) {
                $this->error("Enum class '$enumClass' not found.");

                return Command::FAILURE;
            }

            // Reflect on the enum
            $reflection = new ReflectionEnum($enumClass);
            $enumName   = $reflection->getShortName();

            // Prepare output directory
            $outputDir = base_path($this->option('output'));

            if (! is_dir($outputDir)) {
                File::makeDirectory($outputDir, 0755, true);
            }

            // Prepare output path
            $outputPath = "$outputDir/{$enumName}.ts";

            // Generate TypeScript enum content
            $tsEnum = $this->generateTypeScriptEnum($reflection);

            // Check if file exists and compare content
            $shouldWrite = $this->shouldWriteFile($outputPath, $tsEnum);

            // Write or skip based on changes
            if ($shouldWrite) {
                File::put($outputPath, $tsEnum);
                $this->info("TypeScript enum generated/updated at: $outputPath");
            } else {
                $this->info("No changes detected for $enumName. Skipping file update.");
            }

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error generating TypeScript enum: '.$e->getMessage());

            return Command::FAILURE;
        }
    }

    /**
     * Generate TypeScript enum content from PHP enum reflection.
     */
    protected function generateTypeScriptEnum(ReflectionEnum $reflection): string
    {
        $enumName = $reflection->getShortName();
        $tsEnum   = "// Auto-generated TypeScript enum\n";
        $tsEnum .= "export enum $enumName {\n";

        foreach ($reflection->getCases() as $case) {
            // Handle different enum value types
            $value          = $case->getValue();
            $formattedValue = is_string($value)
                ? "\"$value\""
                : (is_numeric($value)
                    ? $value
                    : json_encode($value));

            $tsEnum .= "    {$case->getName()} = $formattedValue,\n";
        }

        $tsEnum .= "}\n";

        return $tsEnum;
    }

    /**
     * Determine if the file should be written based on content comparison.
     */
    protected function shouldWriteFile(string $outputPath, string $newContent): bool
    {
        // Force write if --force option is used
        if ($this->option('force')) {
            return true;
        }

        // File doesn't exist, write it
        if (! File::exists($outputPath)) {
            return true;
        }

        // Compare existing content with new content
        $existingContent = File::get($outputPath);

        return trim($existingContent) !== trim($newContent);
    }
}
