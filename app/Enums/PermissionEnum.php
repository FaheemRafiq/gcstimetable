<?php

namespace App\Enums;

enum PermissionEnum: string
{
    case CAN_ACCESS_DAHSBOARD = 'dashboard access';

    case CREATE_USER = 'create user';
    case EDIT_USER   = 'edit user';
    case DELETE_USER = 'delete user';
    case VIEW_USER   = 'view user';

    case CREATE_TEACHER = 'create teacher';
    case EDIT_TEACHER   = 'edit teacher';
    case DELETE_TEACHER = 'delete teacher';
    case VIEW_TEACHER   = 'view teacher';

    case CREATE_STUDENT = 'create student';
    case EDIT_STUDENT   = 'edit student';
    case DELETE_STUDENT = 'delete student';
    case VIEW_STUDENT   = 'view student';

    case CREATE_INSTITUTE = 'create institute';
    case EDIT_INSTITUTE   = 'edit institute';
    case DELETE_INSTITUTE = 'delete institute';
    case VIEW_INSTITUTE   = 'view institute';

    case CREATE_DEPARTMENT = 'create department';
    case EDIT_DEPARTMENT   = 'edit department';
    case DELETE_DEPARTMENT = 'delete department';
    case VIEW_DEPARTMENT   = 'view department';

    case CREATE_TIMETABLE = 'create timetable';
    case EDIT_TIMETABLE   = 'edit timetable';
    case DELETE_TIMETABLE = 'delete timetable';
    case VIEW_TIMETABLE   = 'view timetable';

    case CREATE_ALLOCATION = 'create allocation';
    case EDIT_ALLOCATION   = 'edit allocation';
    case DELETE_ALLOCATION = 'delete allocation';
    case VIEW_ALLOCATION   = 'view allocation';

    case CREATE_ROOM = 'create room';
    case EDIT_ROOM   = 'edit room';
    case DELETE_ROOM = 'delete room';
    case VIEW_ROOM   = 'view room';

    case CREATE_SHIFT = 'create shift';
    case EDIT_SHIFT   = 'edit shift';
    case DELETE_SHIFT = 'delete shift';
    case VIEW_SHIFT   = 'view shift';

    case CREATE_SLOT = 'create slot';
    case EDIT_SLOT   = 'edit slot';
    case DELETE_SLOT = 'delete slot';
    case VIEW_SLOT   = 'view slot';

    case CREATE_PROGRAM = 'create program';
    case EDIT_PROGRAM   = 'edit program';
    case DELETE_PROGRAM = 'delete program';
    case VIEW_PROGRAM   = 'view program';

    case CREATE_COURSE          = 'create course';
    case EDIT_COURSE            = 'edit course';
    case DELETE_COURSE          = 'delete course';
    case VIEW_COURSE            = 'view course';
    case COURSE_ATTACH_SEMESTER = 'course attach semester';

    case CREATE_SEMESTER = 'create semester';
    case EDIT_SEMESTER   = 'edit semester';
    case DELETE_SEMESTER = 'delete semester';
    case VIEW_SEMESTER   = 'view semester';

    case CREATE_DAY = 'create day';
    case EDIT_DAY   = 'edit day';
    case DELETE_DAY = 'delete day';
    case VIEW_DAY   = 'view day';

    case CREATE_SECTION = 'create section';
    case EDIT_SECTION   = 'edit section';
    case DELETE_SECTION = 'delete section';
    case VIEW_SECTION   = 'view section';
}
