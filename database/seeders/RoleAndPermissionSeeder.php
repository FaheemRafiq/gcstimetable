<?php

namespace Database\Seeders;

use App\PermissionEnum;
use App\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

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

        // Dashboard Module
        Permission::create(['name' => PermissionEnum::CAN_ACCESS_DAHSBOARD->value]);

        // User Module
        Permission::create(['name' => PermissionEnum::CREATE_USER->value]);
        Permission::create(['name' => PermissionEnum::EDIT_USER->value]);
        Permission::create(['name' => PermissionEnum::DELETE_USER->value]);
        Permission::create(['name' => PermissionEnum::VIEW_USER->value]);

        // Teacher Module
        Permission::create(['name' => PermissionEnum::CREATE_TEACHER->value]);
        Permission::create(['name' => PermissionEnum::EDIT_TEACHER->value]);
        Permission::create(['name' => PermissionEnum::DELETE_TEACHER->value]);
        Permission::create(['name' => PermissionEnum::VIEW_TEACHER->value]);

        // Student Module
        Permission::create(['name' => PermissionEnum::CREATE_STUDENT->value]);
        Permission::create(['name' => PermissionEnum::EDIT_STUDENT->value]);
        Permission::create(['name' => PermissionEnum::DELETE_STUDENT->value]);
        Permission::create(['name' => PermissionEnum::VIEW_STUDENT->value]);

        // Institute Module
        Permission::create(['name' => PermissionEnum::CREATE_INSTITUTE->value]);
        Permission::create(['name' => PermissionEnum::EDIT_INSTITUTE->value]);
        Permission::create(['name' => PermissionEnum::DELETE_INSTITUTE->value]);
        Permission::create(['name' => PermissionEnum::VIEW_INSTITUTE->value]);

        // Department Module
        Permission::create(['name' => PermissionEnum::CREATE_DEPARTMENT->value]);
        Permission::create(['name' => PermissionEnum::EDIT_DEPARTMENT->value]);
        Permission::create(['name' => PermissionEnum::DELETE_DEPARTMENT->value]);
        Permission::create(['name' => PermissionEnum::VIEW_DEPARTMENT->value]);

        // TimeTable Module
        Permission::create(['name' => PermissionEnum::CREATE_TIMETABLE->value]);
        Permission::create(['name' => PermissionEnum::EDIT_TIMETABLE->value]);
        Permission::create(['name' => PermissionEnum::DELETE_TIMETABLE->value]);
        Permission::create(['name' => PermissionEnum::VIEW_TIMETABLE->value]);

        // Allocation Module
        Permission::create(['name' => PermissionEnum::CREATE_ALLOCATION->value]);
        Permission::create(['name' => PermissionEnum::EDIT_ALLOCATION->value]);
        Permission::create(['name' => PermissionEnum::DELETE_ALLOCATION->value]);
        Permission::create(['name' => PermissionEnum::VIEW_ALLOCATION->value]);

        // Room Module
        Permission::create(['name' => PermissionEnum::CREATE_ROOM->value]);
        Permission::create(['name' => PermissionEnum::EDIT_ROOM->value]);
        Permission::create(['name' => PermissionEnum::DELETE_ROOM->value]);
        Permission::create(['name' => PermissionEnum::VIEW_ROOM->value]);

        // Shift Module
        Permission::create(['name' => PermissionEnum::CREATE_SHIFT->value]);
        Permission::create(['name' => PermissionEnum::EDIT_SHIFT->value]);
        Permission::create(['name' => PermissionEnum::DELETE_SHIFT->value]);
        Permission::create(['name' => PermissionEnum::VIEW_SHIFT->value]);
        


        // Assign Permissions to Roles

        // Super Admin

        $superadmin_role->givePermissionTo(Permission::all()->pluck('name')->toArray());

        $institute_admin_role->givePermissionTo(Permission::whereNotLike('name', 'institute')->pluck('name')->toArray());

        $department_admin_role->givePermissionTo(Permission::whereLike('name', 'teacher')->orWhereLike('name', 'student')->pluck('name')->toArray());
    }
}
