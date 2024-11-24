import { Config } from "ziggy-js";
import { Allocation, Instituion, Slot } from "./database";

export type IsActive = "active" | "inactive";

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    verifiedAt: string;
    profilePhotoUrl: string;
    label: string;
    roles: Role[];
    permissions: Permission[];
    email_verified_at?: string;

    // relations
    institution?: Instituion;
}

export type UserType = User & {
    createdAt: string;
    verifiedAt: string;
};

export interface Student {
    id: number;
    name: string;
    email: string;
    mobile: string;
}

export interface Statistics {
    users: number;
    students: number;
    teachers: number;
}

export type TimeStamp = {
    createdAt: string;
    updatedAt: string;
};

export type Shift = {
    id: number;
    name: string;
    type: "Morning" | "Afternoon" | "Evening";
    is_active: IsActive;
    program_type: string;
    slots?: Slot[];
};

export type TimeTable = {
    id: number;
    title: string;
    description: string;
    shift_id: number;
    shift?: Shift;
    allocations?: Allocation[];
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    flash: {
        success: string;
        error: string;
    };
};
