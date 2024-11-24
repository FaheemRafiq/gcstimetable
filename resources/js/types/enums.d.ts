export interface Roles {
    SUPER_ADMIN: string;
    INSTITUTION_ADMIN: string;
    DEPARTMENT_ADMIN: string;
    STUDENT: string;
    TEACHER: string;
}

export interface Permissions {
    CREATE_USER: string;
    EDIT_USER: string;
    DELETE_USER: string;
    VIEW_USER: string;
    CREATE_TEACHER: string;
    EDIT_TEACHER: string;
    DELETE_TEACHER: string;
    VIEW_TEACHER: string;
    CREATE_STUDENT: string;
    EDIT_STUDENT: string;
    DELETE_STUDENT: string;
    VIEW_STUDENT: string;
    CREATE_INSTITUTE: string;
    EDIT_INSTITUTE: string;
    DELETE_INSTITUTE: string;
    VIEW_INSTITUTE: string;
    CREATE_DEPARTMENT: string;
    EDIT_DEPARTMENT: string;
    DELETE_DEPARTMENT: string;
    VIEW_DEPARTMENT: string;
}

export interface RolesAndPermissions {
    roles: Roles;
    permissions: Permissions;
}

