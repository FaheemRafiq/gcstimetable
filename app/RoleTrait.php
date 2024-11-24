<?php

namespace App;

trait RoleTrait
{
    public function isInstitutionAdmin(): bool
    {
        return $this->hasRole(RoleEnum::INSTITUTION_ADMIN->value);
    }

    public function isDepartmentAdmin(): bool
    {
        return $this->hasRole(RoleEnum::DEPARTMENT_ADMIN->value);
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole(RoleEnum::SUPER_ADMIN->value);
    }

    public function isTeacher(): bool
    {
        return $this->hasRole(RoleEnum::TEACHER->value);
    }

    public function isStudent(): bool
    {
        return $this->hasRole(RoleEnum::STUDENT->value);
    }
}
