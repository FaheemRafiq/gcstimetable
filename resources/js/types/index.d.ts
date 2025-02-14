import { Config } from 'ziggy-js'
import { Allocation, Institution, Slot } from './database'

export type IsActive = 'active' | 'inactive'

interface Role {
  id: number
  guard_name: string
  institution_id: number | null
  name: string

  permissions?: Permission[]
  permissions_count?: number
}

interface Permission {
  id: number
  name: string

  roles_count?: number
}

export interface User {
  id: number
  name: string
  email: string
  verifiedAt: string
  profilePhotoUrl: string
  label: string
  roles: Role[]
  permissions: Permission[]
  email_verified_at?: string
  department_id: number | null

  // relations
  institution?: Institution
}

export type UserType = User & {
  createdAt: string
  verifiedAt: string
}

export interface Student {
  id: number
  name: string
  email: string
  mobile: string
}

export interface Statistics {
  users: number
  students: number
  teachers: number
}

export type TimeStamp = {
  createdAt: string
  updatedAt: string
}

export type Shift = {
  id: number
  name: string
  type: 'Morning' | 'Afternoon' | 'Evening'
  is_active: IsActive
  program_type: string
  slots?: Slot[]
}

export type TimeTable = {
  id: number
  title: string
  description: string
  start_date: string
  end_date: string
  shift_id: number
  shift?: Shift
  allocations?: Allocation[]
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: User
  }
  ziggy: Config & { location: string }
  flash: {
    success: string
    error: string
  }
}
