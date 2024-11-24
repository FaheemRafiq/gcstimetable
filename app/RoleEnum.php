<?php

namespace App;

enum RoleEnum: string
{
    case SUPER_ADMIN        = 'super admin';
    case INSTITUTION_ADMIN  = 'institution admin';
    case DEPARTMENT_ADMIN   = 'department admin';
    case STUDENT            = 'student';
    case TEACHER            = 'teacher';

    public static function getLabel(string $role): string
    {
        return match ($role) {
            self::SUPER_ADMIN->value => 'Super Admin',
            self::INSTITUTION_ADMIN->value => 'Institution Admin',
            self::DEPARTMENT_ADMIN->value => 'Department Admin',
            self::STUDENT->value => 'Student',
            self::TEACHER->value => 'Teacher',
            default => 'User Role',
        };
    }

    public static function toArray(): array
    {
        return (new \ReflectionClass(self::class))->getConstants();
    }
}
