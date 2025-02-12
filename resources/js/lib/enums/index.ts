import { PermissionEnum } from './PermissionEnum'
import { RoleEnum } from './RoleEnum'
import { User } from '@/types'

function can(user: User, permission: PermissionEnum): boolean {
  return user?.permissions?.findIndex(item => item.name === permission) !== -1
}

function hasRole(user: User, role: RoleEnum): boolean {
  return user?.roles?.findIndex(item => item.name === role) !== -1
}

export { PermissionEnum, RoleEnum, can, hasRole }
