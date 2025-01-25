<?php

namespace App\Enums;

use ReflectionClass;

enum TeacherRankEnum: string
{
    case LECTURER            = 'Lecturer';
    case ASSISTANT_PROFESSOR = 'Assistant Professor';
    case ASSOCIATE_PROFESSOR = 'Associate Professor';
    case PROFESSOR           = 'Professor';

    public static function getLabel(string $rank): string
    {
        return match ($rank) {
            self::LECTURER->value            => 'Lecturer',
            self::ASSISTANT_PROFESSOR->value => 'Assistant Professor',
            self::ASSOCIATE_PROFESSOR->value => 'Associate Professor',
            self::PROFESSOR->value           => 'Professor',
            default                          => 'Teacher Rank',
        };
    }

    public static function toArray(): array
    {
        return (new ReflectionClass(self::class))->getConstants();
    }
}
