import React from 'react'
import { useAbilities } from '@/components/abilities-provider'
import { PermissionEnum, RoleEnum } from '@/lib/enums'

interface AdminWrapperProps {
  children: React.ReactNode
}

const SuperAdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
  const { isSuperAdmin } = useAbilities()

  if (!isSuperAdmin()) {
    return null
  }

  return <>{children}</>
}

const InstitutionAdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
  const { isInstitutionAdmin } = useAbilities()

  if (!isInstitutionAdmin()) {
    return null
  }

  return <>{children}</>
}

interface RolesWrapperPropsWithRoles extends AdminWrapperProps {
  roles: RoleEnum[]
  operator?: 'and' | 'or'
}

const RolesWrapper: React.FC<RolesWrapperPropsWithRoles> = ({ roles, operator, children }) => {
  const { hasRole } = useAbilities()

  if (operator === 'and') {
    return roles.every(role => hasRole(role)) ? <>{children}</> : null
  } else {
    return roles.some(role => hasRole(role)) ? <>{children}</> : null
  }
}

interface AdminWrapperPropsWithRole extends AdminWrapperProps {
  role: RoleEnum
}

const AdminWrapper: React.FC<AdminWrapperPropsWithRole> = ({ role, children }) => {
  const { hasRole } = useAbilities()

  if (!hasRole(role)) {
    return null
  }

  return <>{children}</>
}

interface PermissionWrapperProps {
  permission: PermissionEnum
  children: React.ReactNode
}

const PermissionWrapper: React.FC<PermissionWrapperProps> = ({ permission, children }) => {
  const { hasPermission } = useAbilities()

  if (!hasPermission(permission)) {
    return null
  }

  return <>{children}</>
}

export { SuperAdminWrapper, InstitutionAdminWrapper, RolesWrapper, AdminWrapper, PermissionWrapper }

export default AdminWrapper
