<?php

namespace App\Enums;

enum PermissionEnum: string
{
    // Access Team dashboard
    case CAN_ACCESS_DAHSBOARD = 'dashboard access';

    case VIEW_DASHBOARD = 'view dashboard';

    case VIEW_USERS        = 'view users';
    case CREATE_USER       = 'create user';
    case EDIT_USER         = 'edit user';
    case DELETE_USER       = 'delete user';
    case VIEW_USER         = 'view user';
    case MANAGE_USER_ROLES = 'manage user roles';

    case VIEW_TEACHERS         = 'view teachers';
    case CREATE_TEACHER        = 'create teacher';
    case EDIT_TEACHER          = 'edit teacher';
    case DELETE_TEACHER        = 'delete teacher';
    case VIEW_TEACHER          = 'view teacher';
    case VIEW_TEACHER_WORKLOAD = 'view teacher workload';
    case CHANGE_TEACHER_STATUS = 'change teacher status';

    case VIEW_STUDENTS  = 'view students';
    case CREATE_STUDENT = 'create student';
    case EDIT_STUDENT   = 'edit student';
    case DELETE_STUDENT = 'delete student';
    case VIEW_STUDENT   = 'view student';

    case VIEW_INSTITUTIONS  = 'view institutions';
    case CREATE_INSTITUTION = 'create institution';
    case EDIT_INSTITUTION   = 'edit institution';
    case DELETE_INSTITUTION = 'delete institution';
    case VIEW_INSTITUTION   = 'view institution';

    case VIEW_DEPARTMENTS         = 'view departments';
    case CREATE_DEPARTMENT        = 'create department';
    case EDIT_DEPARTMENT          = 'edit department';
    case DELETE_DEPARTMENT        = 'delete department';
    case VIEW_DEPARTMENT          = 'view department';
    case VIEW_TEACHERS_WORKLOAD   = 'view teachers workload';
    case EXPORT_TEACHERS_WORKLOAD = 'export teachers workload';

    case VIEW_TIMETABLES  = 'view timetables';
    case CREATE_TIMETABLE = 'create timetable';
    case EDIT_TIMETABLE   = 'edit timetable';
    case DELETE_TIMETABLE = 'delete timetable';
    case VIEW_TIMETABLE   = 'view timetable';

    case VIEW_ALLOCATIONS  = 'view allocations';
    case CREATE_ALLOCATION = 'create allocation';
    case EDIT_ALLOCATION   = 'edit allocation';
    case DELETE_ALLOCATION = 'delete allocation';
    case VIEW_ALLOCATION   = 'view allocation';

    case VIEW_ROOMS   = 'view rooms';
    case CREATE_ROOM  = 'create room';
    case EDIT_ROOM    = 'edit room';
    case DELETE_ROOM  = 'delete room';
    case VIEW_ROOM    = 'view room';

    case VIEW_SHIFTS  = 'view shifts';
    case CREATE_SHIFT = 'create shift';
    case EDIT_SHIFT   = 'edit shift';
    case DELETE_SHIFT = 'delete shift';
    case VIEW_SHIFT   = 'view shift';

    case VIEW_SLOTS  = 'view slots';
    case CREATE_SLOT = 'create slot';
    case EDIT_SLOT   = 'edit slot';
    case DELETE_SLOT = 'delete slot';
    case VIEW_SLOT   = 'view slot';

    case VIEW_PROGRAMS  = 'view programs';
    case CREATE_PROGRAM = 'create program';
    case EDIT_PROGRAM   = 'edit program';
    case DELETE_PROGRAM = 'delete program';
    case VIEW_PROGRAM   = 'view program';

    case VIEW_COURSES           = 'view courses';
    case CREATE_COURSE          = 'create course';
    case EDIT_COURSE            = 'edit course';
    case DELETE_COURSE          = 'delete course';
    case VIEW_COURSE            = 'view course';
    case COURSE_ATTACH_SEMESTER = 'course attach semester';

    case VIEW_SEMESTERS  = 'view semesters';
    case CREATE_SEMESTER = 'create semester';
    case EDIT_SEMESTER   = 'edit semester';
    case DELETE_SEMESTER = 'delete semester';
    case VIEW_SEMESTER   = 'view semester';

    case VIEW_DAYS          = 'view days';
    case CHANGE_DAY_STATUS  = 'change day status';

    case VIEW_SECTIONS  = 'view sections';
    case CREATE_SECTION = 'create section';
    case EDIT_SECTION   = 'edit section';
    case DELETE_SECTION = 'delete section';
    case VIEW_SECTION   = 'view section';

    case VIEW_ROLES  = 'view roles';
    case CREATE_ROLE = 'create role';
    case EDIT_ROLE   = 'edit role';
    case DELETE_ROLE = 'delete role';
    case VIEW_ROLE   = 'view role';

    case VIEW_PERMISSIONS  = 'view permissions';
    case CREATE_PERMISSION = 'create permission';
    case EDIT_PERMISSION   = 'edit permission';
    case DELETE_PERMISSION = 'delete permission';
    case VIEW_PERMISSION   = 'view permission';

    case VIEW_IMPORT        = 'view import';
    case IMPORT_DATA        = 'import data';
    case EXPORT_TEMPLATE    = 'export template';

    case VIEW_PERMISSION_GROUPS  = 'view permission groups';
    case VIEW_PERMISSION_GROUP   = 'view permission group';
    case CREATE_PERMISSION_GROUP = 'create permission group';
    case EDIT_PERMISSION_GROUP   = 'edit permission group';
    case DELETE_PERMISSION_GROUP = 'delete permission group';
}
