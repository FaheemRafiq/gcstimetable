import React from 'react'
import { useAbilities } from '@/components/abilities-provider'
import { RoleEnum } from '@/lib/enums'

interface AdminWrapperProps {
  children: React.ReactNode
}

export const SuperAdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
  const { isSuperAdmin } = useAbilities()

  if (!isSuperAdmin()) {
    return null
  }

  return <>{children}</>
}

export const InstitutionAdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
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

export const RolesWrapper: React.FC<RolesWrapperPropsWithRoles> = ({
  roles,
  operator,
  children,
}) => {
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

export default AdminWrapper
