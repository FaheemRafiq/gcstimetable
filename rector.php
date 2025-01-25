<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use Rector\Set\ValueObject\SetList;
use Rector\CodeQuality\Rector\Class_\CompleteDynamicPropertiesRector;
use Rector\DeadCode\Rector\Property\RemoveUnusedPrivatePropertyRector;
use Rector\DeadCode\Rector\ClassMethod\RemoveUnusedPrivateMethodRector;
use Rector\CodingStyle\Rector\ClassMethod\NewlineBeforeNewAssignSetRector;
use Rector\DeadCode\Rector\ClassMethod\RemoveUnusedPromotedPropertyRector;
use Rector\TypeDeclaration\Rector\Property\TypedPropertyFromAssignsRector;
use Rector\TypeDeclaration\Rector\ClassMethod\AddReturnTypeDeclarationRector;
use Rector\TypeDeclaration\Rector\ClassMethod\AddVoidReturnTypeWhereNoReturnRector;

return static function (RectorConfig $rectorConfig): void {
    // Define paths to refactor
    $rectorConfig->paths([
        __DIR__.'/app',
        __DIR__.'/routes',
        __DIR__.'/tests',
    ]);

    // Exclude specific paths or files from refactoring
    $rectorConfig->skip([
        __DIR__.'/vendor', // Skip vendor directory
        __DIR__.'/storage', // Skip storage directory
        // Add other exclusions as needed
    ]);

    // Apply specific rules
    $rectorConfig->rules([
        AddVoidReturnTypeWhereNoReturnRector::class,
        CompleteDynamicPropertiesRector::class,
        NewlineBeforeNewAssignSetRector::class,
        RemoveUnusedPromotedPropertyRector::class,
        RemoveUnusedPrivateMethodRector::class,
        RemoveUnusedPrivatePropertyRector::class,
        TypedPropertyFromAssignsRector::class,
        AddReturnTypeDeclarationRector::class,
    ]);

    // Include predefined sets of rules
    $rectorConfig->sets([
        SetList::CODE_QUALITY,     // Improve code quality
        SetList::DEAD_CODE,        // Remove unused code
        SetList::TYPE_DECLARATION, // Add type declarations where possible
        SetList::CODING_STYLE,     // Enforce coding standards
    ]);

    // Custom settings (based on your example)
    $rectorConfig->phpVersion(80300); // PHP 7.4 minimum compatibility (adjust as needed)
    $rectorConfig->importNames(true); // Use import statements for classes, functions, and constants
};
