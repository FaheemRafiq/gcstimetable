<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use Rector\Set\ValueObject\SetList;
use Rector\DeadCode\Rector\Class_\RemoveUnusedClassesRector;
use Rector\CodingStyle\Rector\ClassConst\VarConstantCommentRector;
use Rector\CodeQuality\Rector\Class_\CompleteDynamicPropertiesRector;
use Rector\DeadCode\Rector\Property\RemoveUnusedPrivatePropertyRector;
use Rector\DeadCode\Rector\ClassMethod\RemoveUnusedPrivateMethodRector;
use Rector\TypeDeclaration\Rector\ClassMethod\AddArrayParamDocTypeRector;
use Rector\CodingStyle\Rector\ClassMethod\NewlineBeforeNewAssignSetRector;
use Rector\DeadCode\Rector\ClassMethod\RemoveUnusedPromotedPropertyRector;
use Rector\TypeDeclaration\Rector\FunctionLike\ParamTypeDeclarationRector;
use Rector\TypeDeclaration\Rector\Property\TypedPropertyFromAssignsRector;
use Rector\TypeDeclaration\Rector\ClassMethod\AddReturnTypeDeclarationRector;
use Rector\TypeDeclaration\Rector\ClassMethod\AddVoidReturnTypeWhereNoReturnRector;

return static function (RectorConfig $rectorConfig): void {
    // Define the directories for Rector to scan and refactor
    $rectorConfig->paths([
        __DIR__.'/app',    // Application code
        __DIR__.'/tests',  // Unit/Integration tests
    ]);

    // Exclude specific directories or files (if necessary)
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
        VarConstantCommentRector::class,
        RemoveUnusedPromotedPropertyRector::class,
        RemoveUnusedClassesRector::class,
        RemoveUnusedPrivateMethodRector::class,
        RemoveUnusedPrivatePropertyRector::class,
        ParamTypeDeclarationRector::class,
        TypedPropertyFromAssignsRector::class,
        AddArrayParamDocTypeRector::class,
        AddReturnTypeDeclarationRector::class,
    ]);

    // Include predefined sets of Rector rules for broader refactoring
    $rectorConfig->sets([
        SetList::CODE_QUALITY,     // Improve code quality
        SetList::DEAD_CODE,        // Remove unused code
        SetList::TYPE_DECLARATION, // Add type declarations where possible
        SetList::CODING_STYLE,     // Enforce coding standards
    ]);
};
