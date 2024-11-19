<?php

namespace Database\Seeders;

use App\RoleEnum;
use App\PermissionEnum;
use ReflectionEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin_role        = Role::create(['name' => RoleEnum::SUPER_ADMIN->value]);
        $institute_admin_role   = Role::create(['name' => RoleEnum::INSTITUTE_ADMIN->value]);
        $department_admin_role  = Role::create(['name' => RoleEnum::DEPARTMENT_ADMIN->value]);
        $student_role           = Role::create(['name' => RoleEnum::STUDENT->value]);
        $teacher_role           = Role::create(['name' => RoleEnum::TEACHER->value]);

        // Create Permissions for Modules

        $reflection     = new ReflectionEnum(PermissionEnum::class);
        $permissions    = $reflection->getCases();

        foreach ($permissions as $permission) {
            $key = $permission->getValue();

            if (isset($key->value)) {
                Permission::create(['name' => $key->value]);
            }
        }


        // Assign Permissions to Roles

        // Super Admin

        $superadmin_role->givePermissionTo(Permission::all()->pluck('name')->toArray());

        $institute_admin_role->givePermissionTo(Permission::whereNotLike('name', 'institute')->pluck('name')->toArray());

        $department_admin_role->givePermissionTo(Permission::whereLike('name', 'teacher')->orWhereLike('name', 'student')->pluck('name')->toArray());
    }
}
