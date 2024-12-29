<?php

namespace App\Enums;

enum TeacherPositionEnum: string
{
    case HOD = 'HOD';
    case REGULAR = 'Regular';
    case VICE_PRINCIPAL = 'Vice Principal';
    case PRINCIPAL = 'Principal';

    public static function getLabel(string $position): string
    {
        return match ($position) {
            self::HOD->value => 'HOD',
            self::REGULAR->value => 'Regular',
            self::VICE_PRINCIPAL->value => 'Vice Principal',
            self::PRINCIPAL->value => 'Principal',
            default => 'Teacher Position',
        };
    }

    public static function toArray(): array
    {
        return (new \ReflectionClass(self::class))->getConstants();
    }
}
