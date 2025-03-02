<?php

namespace App\Helpers;

use App\Enums\PermissionEnum;

class PermissionHelper
{
    /**
     * Get all permissions grouped by category with descriptions.
     */
    public static function getAllPermissions(): array
    {
        return [
            'Dashboard' => [
                ['key' => PermissionEnum::CAN_ACCESS_DAHSBOARD->value, 'description' => 'Access the team dashboard'],
                ['key' => PermissionEnum::VIEW_DASHBOARD->value, 'description' => 'View the dashboard'],
            ],
            'Users' => [
                ['key' => PermissionEnum::VIEW_USERS->value, 'description' => 'View the list of users'],
                ['key' => PermissionEnum::CREATE_USER->value, 'description' => 'Create new users'],
                ['key' => PermissionEnum::EDIT_USER->value, 'description' => 'Edit user details'],
                ['key' => PermissionEnum::DELETE_USER->value, 'description' => 'Delete users'],
                ['key' => PermissionEnum::VIEW_USER->value, 'description' => 'View user details'],
                ['key' => PermissionEnum::MANAGE_USER_ROLES->value, 'description' => 'Manage user roles'],
            ],
            'Teachers' => [
                ['key' => PermissionEnum::VIEW_TEACHERS->value, 'description' => 'View all teachers'],
                ['key' => PermissionEnum::CREATE_TEACHER->value, 'description' => 'Create a new teacher'],
                ['key' => PermissionEnum::EDIT_TEACHER->value, 'description' => 'Edit teacher details'],
                ['key' => PermissionEnum::DELETE_TEACHER->value, 'description' => 'Delete a teacher'],
                ['key' => PermissionEnum::VIEW_TEACHER->value, 'description' => 'View teacher details'],
                ['key' => PermissionEnum::VIEW_TEACHER_WORKLOAD->value, 'description' => 'View teacher workload'],
                ['key' => PermissionEnum::CHANGE_TEACHER_STATUS->value, 'description' => 'Change teacher status'],
            ],
            'Students' => [
                ['key' => PermissionEnum::VIEW_STUDENTS->value, 'description' => 'View all students'],
                ['key' => PermissionEnum::CREATE_STUDENT->value, 'description' => 'Create a new student'],
                ['key' => PermissionEnum::EDIT_STUDENT->value, 'description' => 'Edit student details'],
                ['key' => PermissionEnum::DELETE_STUDENT->value, 'description' => 'Delete a student'],
                ['key' => PermissionEnum::VIEW_STUDENT->value, 'description' => 'View student details'],
            ],
            'Institutions' => [
                ['key' => PermissionEnum::VIEW_INSTITUTIONS->value, 'description' => 'View all institutions'],
                ['key' => PermissionEnum::CREATE_INSTITUTION->value, 'description' => 'Create a new institution'],
                ['key' => PermissionEnum::EDIT_INSTITUTION->value, 'description' => 'Edit institution details'],
                ['key' => PermissionEnum::DELETE_INSTITUTION->value, 'description' => 'Delete an institution'],
                ['key' => PermissionEnum::VIEW_INSTITUTION->value, 'description' => 'View institution details'],
            ],
            'Departments' => [
                ['key' => PermissionEnum::VIEW_DEPARTMENTS->value, 'description' => 'View all departments'],
                ['key' => PermissionEnum::CREATE_DEPARTMENT->value, 'description' => 'Create a new department'],
                ['key' => PermissionEnum::EDIT_DEPARTMENT->value, 'description' => 'Edit department details'],
                ['key' => PermissionEnum::DELETE_DEPARTMENT->value, 'description' => 'Delete a department'],
                ['key' => PermissionEnum::VIEW_DEPARTMENT->value, 'description' => 'View department details'],
                ['key' => PermissionEnum::VIEW_TEACHERS_WORKLOAD->value, 'description' => 'View teachers workload'],
                ['key' => PermissionEnum::EXPORT_TEACHERS_WORKLOAD->value, 'description' => 'Export teachers workload'],
            ],
            'Timetables' => [
                ['key' => PermissionEnum::VIEW_TIMETABLES->value, 'description' => 'View all timetables'],
                ['key' => PermissionEnum::CREATE_TIMETABLE->value, 'description' => 'Create a new timetable'],
                ['key' => PermissionEnum::EDIT_TIMETABLE->value, 'description' => 'Edit a timetable'],
                ['key' => PermissionEnum::DELETE_TIMETABLE->value, 'description' => 'Delete a timetable'],
                ['key' => PermissionEnum::VIEW_TIMETABLE->value, 'description' => 'View timetable details'],
            ],
            'Allocations' => [
                ['key' => PermissionEnum::VIEW_ALLOCATIONS->value, 'description' => 'View all allocations'],
                ['key' => PermissionEnum::CREATE_ALLOCATION->value, 'description' => 'Create an allocation'],
                ['key' => PermissionEnum::EDIT_ALLOCATION->value, 'description' => 'Edit an allocation'],
                ['key' => PermissionEnum::DELETE_ALLOCATION->value, 'description' => 'Delete an allocation'],
                ['key' => PermissionEnum::VIEW_ALLOCATION->value, 'description' => 'View allocation details'],
            ],
            'Rooms' => [
                ['key' => PermissionEnum::VIEW_ROOMS->value, 'description' => 'View all rooms'],
                ['key' => PermissionEnum::CREATE_ROOM->value, 'description' => 'Create a new room'],
                ['key' => PermissionEnum::EDIT_ROOM->value, 'description' => 'Edit room details'],
                ['key' => PermissionEnum::DELETE_ROOM->value, 'description' => 'Delete a room'],
                ['key' => PermissionEnum::VIEW_ROOM->value, 'description' => 'View room details'],
            ],
            'Shifts' => [
                ['key' => PermissionEnum::VIEW_SHIFTS->value, 'description' => 'View all shifts'],
                ['key' => PermissionEnum::CREATE_SHIFT->value, 'description' => 'Create a new shift'],
                ['key' => PermissionEnum::EDIT_SHIFT->value, 'description' => 'Edit shift details'],
                ['key' => PermissionEnum::DELETE_SHIFT->value, 'description' => 'Delete a shift'],
                ['key' => PermissionEnum::VIEW_SHIFT->value, 'description' => 'View shift details'],
            ],
            'Slots' => [
                ['key' => PermissionEnum::VIEW_SLOTS->value, 'description' => 'View all slots'],
                ['key' => PermissionEnum::CREATE_SLOT->value, 'description' => 'Create a new slot'],
                ['key' => PermissionEnum::EDIT_SLOT->value, 'description' => 'Edit slot details'],
                ['key' => PermissionEnum::DELETE_SLOT->value, 'description' => 'Delete a slot'],
                ['key' => PermissionEnum::VIEW_SLOT->value, 'description' => 'View slot details'],
            ],
            'Programs' => [
                ['key' => PermissionEnum::VIEW_PROGRAMS->value, 'description' => 'View all programs'],
                ['key' => PermissionEnum::CREATE_PROGRAM->value, 'description' => 'Create a new program'],
                ['key' => PermissionEnum::EDIT_PROGRAM->value, 'description' => 'Edit program details'],
                ['key' => PermissionEnum::DELETE_PROGRAM->value, 'description' => 'Delete a program'],
                ['key' => PermissionEnum::VIEW_PROGRAM->value, 'description' => 'View program details'],
            ],
            'Courses' => [
                ['key' => PermissionEnum::VIEW_COURSES->value, 'description' => 'View all courses'],
                ['key' => PermissionEnum::CREATE_COURSE->value, 'description' => 'Create a new course'],
                ['key' => PermissionEnum::EDIT_COURSE->value, 'description' => 'Edit course details'],
                ['key' => PermissionEnum::DELETE_COURSE->value, 'description' => 'Delete a course'],
                ['key' => PermissionEnum::VIEW_COURSE->value, 'description' => 'View course details'],
                ['key' => PermissionEnum::COURSE_ATTACH_SEMESTER->value, 'description' => 'Attach semester to course'],
            ],
            'Semesters' => [
                ['key' => PermissionEnum::VIEW_SEMESTERS->value, 'description' => 'View all semesters'],
                ['key' => PermissionEnum::CREATE_SEMESTER->value, 'description' => 'Create a new semester'],
                ['key' => PermissionEnum::EDIT_SEMESTER->value, 'description' => 'Edit semester details'],
                ['key' => PermissionEnum::DELETE_SEMESTER->value, 'description' => 'Delete a semester'],
                ['key' => PermissionEnum::VIEW_SEMESTER->value, 'description' => 'View semester details'],
            ],
            'Days' => [
                ['key' => PermissionEnum::VIEW_DAYS->value, 'description' => 'View all days'],
                ['key' => PermissionEnum::CHANGE_DAY_STATUS->value, 'description' => 'Change day status'],
            ],
            'Sections' => [
                ['key' => PermissionEnum::VIEW_SECTIONS->value, 'description' => 'View all sections'],
                ['key' => PermissionEnum::CREATE_SECTION->value, 'description' => 'Create a new section'],
                ['key' => PermissionEnum::EDIT_SECTION->value, 'description' => 'Edit section details'],
                ['key' => PermissionEnum::DELETE_SECTION->value, 'description' => 'Delete a section'],
                ['key' => PermissionEnum::VIEW_SECTION->value, 'description' => 'View section details'],
            ],
            'Roles & Permissions' => [
                ['key' => PermissionEnum::VIEW_ROLES->value, 'description' => 'View roles'],
                ['key' => PermissionEnum::CREATE_ROLE->value, 'description' => 'Create roles'],
                ['key' => PermissionEnum::EDIT_ROLE->value, 'description' => 'Edit roles'],
                ['key' => PermissionEnum::DELETE_ROLE->value, 'description' => 'Delete roles'],
                ['key' => PermissionEnum::VIEW_ROLE->value, 'description' => 'View role details'],
                ['key' => PermissionEnum::VIEW_PERMISSIONS->value, 'description' => 'View permissions'],
                ['key' => PermissionEnum::CREATE_PERMISSION->value, 'description' => 'Create permissions'],
                ['key' => PermissionEnum::EDIT_PERMISSION->value, 'description' => 'Edit permissions'],
                ['key' => PermissionEnum::DELETE_PERMISSION->value, 'description' => 'Delete permissions'],
                ['key' => PermissionEnum::VIEW_PERMISSION->value, 'description' => 'View permission details'],
            ],
            'Imports & Exports' => [
                ['key' => PermissionEnum::VIEW_IMPORT->value, 'description' => 'View imports'],
                ['key' => PermissionEnum::IMPORT_DATA->value, 'description' => 'Import data'],
                ['key' => PermissionEnum::EXPORT_TEMPLATE->value, 'description' => 'Export templates'],
            ],
            'Permission Groups' => [
                ['key' => PermissionEnum::VIEW_PERMISSION_GROUPS->value, 'description' => 'View permission groups'],
                ['key' => PermissionEnum::CREATE_PERMISSION_GROUP->value, 'description' => 'Create permission groups'],
                ['key' => PermissionEnum::EDIT_PERMISSION_GROUP->value, 'description' => 'Edit permission groups'],
                ['key' => PermissionEnum::DELETE_PERMISSION_GROUP->value, 'description' => 'Delete permission groups'],
                ['key' => PermissionEnum::VIEW_PERMISSION_GROUP->value, 'description' => 'View permission group details'],
            ],
        ];
    }

    /**
     * Get all group names.
     */
    public static function getAllGroups(): array
    {
        return array_keys(self::getAllPermissions());
    }
}
