<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin_role         = Role::create(['name' => RoleEnum::SUPER_ADMIN->value]);
        $institution_admin_role  = Role::create(['name' => RoleEnum::INSTITUTION_ADMIN->value]);
        $department_admin_role   = Role::create(['name' => RoleEnum::DEPARTMENT_ADMIN->value]);
        // $student_role          = Role::create(['name' => RoleEnum::STUDENT->value]);
        // $teacher_role          = Role::create(['name' => RoleEnum::TEACHER->value]);

        $superadmin_role->givePermissionTo(Permission::all()->pluck('name')->toArray());

        $institution_admin_role->givePermissionTo(Permission::whereNotLike('name', '%institution%')->whereNotLike('name', '%permission%')->pluck('name')->toArray());

        $department_admin_role->givePermissionTo(Permission::whereNotLike('name', '%institution%')->whereNotLike('name', '%department%')->whereNotLike('name', '%role%')->whereNotLike('name', '%permission%')->pluck('name')->toArray());
    }
}
