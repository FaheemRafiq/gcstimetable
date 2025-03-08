import * as React from 'react'
import {
  type LucideIcon,
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  HomeIcon,
  UsersIcon,
  UserIcon,
  CalendarIcon,
  Building,
  CalendarDays,
  LayoutDashboardIcon,
  GraduationCap,
  Hourglass,
  Book,
  Landmark,
  Hotel,
  ShieldCheckIcon,
  KeyIcon,
  ListTree,
  CalendarDaysIcon,
  ArrowDownUp,
  Import,
  GroupIcon,
} from 'lucide-react'
import { useAbilities } from '@/components/abilities-provider'
import { PermissionEnum } from '@/lib/enums'

// Define types
export type Icon = LucideIcon

export type NavItem = {
  title: string
  url: string
  route: string
  icon: Icon
  isActive: boolean
  collaped?: boolean
  disabled?: boolean
  permission: PermissionEnum
  navItems?: NavItem[]
}

export interface NavSection {
  label: string
  items: NavItem[]
}

export type NavDataType = NavSection[]

// Base navigation data
export const NavData: NavDataType = [
  {
    label: 'Management',
    items: [
      {
        title: 'Dashboard',
        route: 'dashboard',
        url: route('dashboard'),
        icon: LayoutDashboardIcon,
        isActive: route().current('dashboard'),
        permission: PermissionEnum.VIEW_DASHBOARD,
      },
      {
        title: 'Allocations',
        route: 'allocations',
        url: route('allocations.index'),
        icon: ListTree,
        isActive: route().current('allocations.index'),
        permission: PermissionEnum.VIEW_ALLOCATIONS,
      },
      {
        title: 'Users',
        route: 'users.index',
        url: route('users.index'),
        icon: UsersIcon,
        isActive: route().current('users.index'),
        permission: PermissionEnum.VIEW_USERS,
      },
      {
        title: 'Teachers',
        route: 'teachers.index',
        url: route('teachers.index'),
        icon: UserIcon,
        isActive: route().current('teachers.index'),
        permission: PermissionEnum.VIEW_TEACHERS,
      },
      {
        title: 'Students',
        route: 'students.index',
        url: route('students.index'),
        icon: GraduationCap,
        isActive: route().current('students.index'),
        permission: PermissionEnum.VIEW_STUDENTS,
      },
    ],
  },
  {
    label: 'Academics',
    items: [
      {
        title: 'Programs',
        route: 'programs.index',
        url: route('programs.index'),
        icon: BookOpen,
        isActive: route().current('programs.index'),
        permission: PermissionEnum.VIEW_PROGRAMS,
      },
      {
        title: 'Semesters',
        route: 'semesters.index',
        url: route('semesters.index'),
        icon: Command,
        isActive: route().current('semesters.index'),
        permission: PermissionEnum.VIEW_SEMESTERS,
      },
      {
        title: 'Courses',
        route: 'courses.index',
        url: route('courses.index'),
        icon: Book,
        isActive: route().current('courses.index'),
        permission: PermissionEnum.VIEW_COURSES,
      },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      {
        title: 'Institutions',
        route: 'institutions.index',
        url: route('institutions.index'),
        isActive: route().current('institutions.index'),
        icon: Landmark,
        permission: PermissionEnum.VIEW_INSTITUTIONS,
      },
      {
        title: 'Departments',
        route: 'departments.index',
        url: route('departments.index'),
        isActive: route().current('departments.index'),
        icon: Hotel,
        permission: PermissionEnum.VIEW_DEPARTMENTS,
      },
      {
        title: 'Rooms',
        route: 'rooms.index',
        url: route('rooms.index'),
        isActive: route().current('rooms.index'),
        icon: Building,
        permission: PermissionEnum.VIEW_ROOMS,
      },
      {
        title: 'Time Tables',
        route: 'timetables.index',
        url: route('timetables.index'),
        isActive: route().current('timetables.index'),
        icon: CalendarDays,
        permission: PermissionEnum.VIEW_TIMETABLES,
      },
      {
        title: 'Shifts',
        route: 'shifts.index',
        url: route('shifts.index'),
        isActive: route().current('shifts.index'),
        icon: Hourglass,
        permission: PermissionEnum.VIEW_SHIFTS,
      },
      {
        title: 'Days',
        route: 'days.index',
        url: route('days.index'),
        isActive: route().current('days.index'),
        icon: CalendarDaysIcon,
        permission: PermissionEnum.VIEW_DAYS,
      },
    ],
  },
  {
    label: 'Access Control',
    items: [
      {
        title: 'Roles',
        route: 'roles.index',
        url: route('roles.index'),
        icon: ShieldCheckIcon,
        isActive: route().current('roles.index'),
        permission: PermissionEnum.VIEW_ROLES,
      },
      {
        title: 'Permissions',
        route: 'permissions.index',
        url: route('permissions.index'),
        icon: KeyIcon,
        isActive: route().current('permissions.index'),
        permission: PermissionEnum.VIEW_PERMISSIONS,
      },
      {
        title: 'Permission Groups',
        route: 'permission-groups.index',
        url: route('permission-groups.index'),
        icon: GroupIcon,
        isActive: route().current('permission-groups.index'),
        permission: PermissionEnum.VIEW_PERMISSION_GROUPS,
      },
    ],
  },
]

// Secondary navigation data (optional)
export const SecondaryNavData: { title: string; url: string; icon: Icon }[] = [
  {
    title: 'Support',
    url: '#',
    icon: LifeBuoy,
  },
  {
    title: 'Feedback',
    url: '#',
    icon: Send,
  },
]

export function useSidebarMenuItems(): NavDataType {
  const { isSuperAdmin, hasPermission } = useAbilities()

  const checkActivity = React.useCallback((item: NavItem): NavItem => {
    const newItem: NavItem = {
      ...item,
      isActive: route().current(item.route),
    }

    if (newItem.collaped !== undefined && newItem.navItems) {
      newItem.collaped = newItem.navItems.some(subItem => route().current(subItem.route))
    }

    if (newItem.navItems) {
      newItem.navItems = newItem.navItems.map(checkActivity)
    }

    return newItem
  }, [])

  const filterItems = React.useCallback(
    (items: NavItem[]): NavItem[] => {
      return items
        .map(item => checkActivity(item))
        .filter(item => {
          if (isSuperAdmin()) {
            return true // Super admins see all items
          }

          if (hasPermission(item.permission)) {
            return true // Show if user has permission
          }

          if (item.navItems) {
            item.navItems = filterItems(item.navItems) // Recursively filter sub-items
            return item.navItems.length > 0 // Keep item if it has visible sub-items
          }

          return false
        })
    },
    [isSuperAdmin, hasPermission, checkActivity]
  )

  const navigationData = React.useMemo(() => {
    return NavData.map(section => ({
      ...section,
      items: filterItems(section.items),
    })).filter(section => section.items.length > 0) // Remove empty sections
  }, [filterItems])

  return navigationData
}
