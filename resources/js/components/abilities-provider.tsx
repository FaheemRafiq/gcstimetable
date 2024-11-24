import { User } from "@/types";
import React, { createContext, useContext, ReactNode } from "react";
import { can, hasRole as isRole, RoleEnum, PermissionEnum } from "@/lib/enum";

interface AbilitiesContextProps {
    isSuperAdmin: () => boolean;
    isInstitutionAdmin: () => boolean;
    hasRole: (role: RoleEnum) => boolean;
    hasPermission: (permission: string) => boolean;
}

const AbilitiesContext = createContext<AbilitiesContextProps | undefined>(
    undefined
);

export const AbilitiesProvider: React.FC<{
    user: User;
    children: ReactNode;
}> = ({ user, children }) => {
    // Roles
    const isSuperAdmin = () => isRole(user, RoleEnum.SUPER_ADMIN);
    const isInstitutionAdmin = () => isRole(user, RoleEnum.INSTITUTION_ADMIN);
    const hasRole = (role: RoleEnum) => isRole(user, role);

    // Permissions
    const hasPermission = (permission: string) =>
        can(user, permission as PermissionEnum);

    return (
        <AbilitiesContext.Provider
            value={{ isSuperAdmin, isInstitutionAdmin, hasRole, hasPermission }}
        >
            {children}
        </AbilitiesContext.Provider>
    );
};

export const useAbilities = () => {
    const context = useContext(AbilitiesContext);
    if (!context) {
        throw new Error(
            "useAbilities must be used within an AbilitiesProvider"
        );
    }
    return context;
};
