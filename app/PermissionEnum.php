<?php

namespace App;

enum PermissionEnum : string
{
    case CAN_ACCESS_DAHSBOARD = 'dashboard access';
    
    case CREATE_USER        = 'create user';
    case EDIT_USER          = 'edit user';
    case DELETE_USER        = 'delete user';
    case VIEW_USER          = 'view user';

    case CREATE_TEACHER     = 'create teacher';
    case EDIT_TEACHER       = 'edit teacher';
    case DELETE_TEACHER     = 'delete teacher';
    case VIEW_TEACHER       = 'view teacher';

    case CREATE_STUDENT     = 'create student';
    case EDIT_STUDENT       = 'edit student';
    case DELETE_STUDENT     = 'delete student';
    case VIEW_STUDENT       = 'view student';

    case CREATE_INSTITUTE   = 'create institute';
    case EDIT_INSTITUTE     = 'edit institute';
    case DELETE_INSTITUTE   = 'delete institute';
    case VIEW_INSTITUTE     = 'view institute';

    case CREATE_DEPARTMENT  = 'create department';
    case EDIT_DEPARTMENT    = 'edit department';
    case DELETE_DEPARTMENT  = 'delete department';
    case VIEW_DEPARTMENT    = 'view department';

    case CREATE_TIMETABLE   = 'create timetable';
    case EDIT_TIMETABLE     = 'edit timetable';
    case DELETE_TIMETABLE   = 'delete timetable';
    case VIEW_TIMETABLE     = 'view timetable';

    case CREATE_ALLOCATION  = 'create allocation';
    case EDIT_ALLOCATION    = 'edit allocation';
    case DELETE_ALLOCATION  = 'delete allocation';
    case VIEW_ALLOCATION    = 'view allocation';

    case CREATE_ROOM        = 'create room';
    case EDIT_ROOM          = 'edit room';
    case DELETE_ROOM        = 'delete room';
    case VIEW_ROOM          = 'view room';

    case CREATE_SHIFT       = 'create shift';
    case EDIT_SHIFT         = 'edit shift';
    case DELETE_SHIFT       = 'delete shift';
    case VIEW_SHIFT         = 'view shift';

    public static function toArray(): array
    {
        return [
            'CREATE_USER'       => self::CREATE_USER,
            'EDIT_USER'         => self::EDIT_USER,
            'DELETE_USER'       => self::DELETE_USER,
            'VIEW_USER'         => self::VIEW_USER,

            'CREATE_TEACHER'    => self::CREATE_TEACHER,
            'EDIT_TEACHER'      => self::EDIT_TEACHER,
            'DELETE_TEACHER'    => self::DELETE_TEACHER,
            'VIEW_TEACHER'      => self::VIEW_TEACHER,

            'CREATE_STUDENT'    => self::CREATE_STUDENT,
            'EDIT_STUDENT'      => self::EDIT_STUDENT,
            'DELETE_STUDENT'    => self::DELETE_STUDENT,
            'VIEW_STUDENT'      => self::VIEW_STUDENT,

            'CREATE_INSTITUTE'  => self::CREATE_INSTITUTE,
            'EDIT_INSTITUTE'    => self::EDIT_INSTITUTE,
            'DELETE_INSTITUTE'  => self::DELETE_INSTITUTE,
            'VIEW_INSTITUTE'    => self::VIEW_INSTITUTE,

            'CREATE_DEPARTMENT' => self::CREATE_DEPARTMENT,
            'EDIT_DEPARTMENT'   => self::EDIT_DEPARTMENT,
            'DELETE_DEPARTMENT' => self::DELETE_DEPARTMENT,
            'VIEW_DEPARTMENT'   => self::VIEW_DEPARTMENT,

            'CREATE_TIMETABLE'  => self::CREATE_TIMETABLE,
            'EDIT_TIMETABLE'    => self::EDIT_TIMETABLE,
            'DELETE_TIMETABLE'  => self::DELETE_TIMETABLE,
            'VIEW_TIMETABLE'    => self::VIEW_TIMETABLE,

            'CREATE_ALLOCATION' => self::CREATE_ALLOCATION,
            'EDIT_ALLOCATION'   => self::EDIT_ALLOCATION,
            'DELETE_ALLOCATION' => self::DELETE_ALLOCATION,
            'VIEW_ALLOCATION'   => self::VIEW_ALLOCATION,

            'CREATE_ROOM'       => self::CREATE_ROOM,
            'EDIT_ROOM'         => self::EDIT_ROOM,
            'DELETE_ROOM'       => self::DELETE_ROOM,
            'VIEW_ROOM'         => self::VIEW_ROOM,
        ];
    }
}