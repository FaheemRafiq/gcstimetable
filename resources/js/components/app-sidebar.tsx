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

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { User } from '@/types'
import ApplicationLogo from '@/Components/ApplicationLogo'
import { useAbilities } from './abilities-provider'
import { PermissionEnum } from '@/lib/enums'
import { Link } from '@inertiajs/react'
import { PermissionWrapper } from '@/Components/AdminWrapper'

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

export const SecondaryNavData: any = [
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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User
}
export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { isSuperAdmin, hasPermission } = useAbilities()

  const checkActivity = React.useCallback((item: NavItem) => {
    const NewItem = {
      ...item,
      isActive: route().current(item.route),
    }

    if (NewItem?.collaped !== undefined) {
      NewItem.collaped = NewItem.navItems?.some(subItem => route().current(subItem.route))
    }

    if (NewItem.navItems) {
      NewItem.navItems = NewItem.navItems.map(checkActivity)
    }

    return NewItem
  }, [])

  const filterItems = React.useCallback((items: NavItem[]) => {
    const filteredItems = items
      .map(item => checkActivity(item))
      .filter(item => {
        if (isSuperAdmin()) {
          return true
        }

        if (hasPermission(item.permission)) {
          return true
        }

        if (item.navItems) {
          item.navItems = filterItems(item.navItems)
        }

        return false
      })
    return filteredItems
  }, [])

  const NavigationData = React.useMemo(() => {
    return NavData.map(section => ({
      ...section,
      items: filterItems(section.items),
    })).filter(section => section.items.length > 0)
  }, [isSuperAdmin, checkActivity])

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <ApplicationLogo />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.label ?? 'Time Table'}</span>
                  <span className="truncate text-xs">{user.institution?.name ?? 'Enterprise'}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="sidebar-scrollbar">
        {NavigationData.map(section => (
          <NavMain key={section.label} label={section.label} items={section.items} />
        ))}
        {/* <NavSecondary items={SecondaryNavData} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <PermissionWrapper permission={PermissionEnum.VIEW_IMPORT}>
          <SidebarMenu className="mt-auto">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={'Import'}
                asChild
                size="default"
                className="group relative flex items-center justify-start rounded-lg ring-1 bg-transparent shadow-md transition duration-300 ease-in-out hover:shadow-primary"
              >
                <Link href={route('import.index')} preserveScroll={true}>
                  <Import />
                  <span>Import</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </PermissionWrapper>

        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
