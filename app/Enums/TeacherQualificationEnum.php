<?php

namespace App\Enums;

enum TeacherQualificationEnum: string
{
    case MSc = 'MSc';
    case BSHons = 'BS(Hons)';
    case MPhil = 'MPhil';
    case PhD = 'PhD';

    public static function toArray(): array
    {
        return (new \ReflectionClass(__CLASS__))->getConstants();
    }
}
