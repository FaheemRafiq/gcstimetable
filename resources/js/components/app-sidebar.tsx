import * as React from 'react'
import { Import } from 'lucide-react'
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
import { type User } from '@/types'
import ApplicationLogo from '@/Components/ApplicationLogo'
import { PermissionEnum } from '@/lib/enums'
import { Link } from '@inertiajs/react'
import { PermissionWrapper } from '@/Components/AdminWrapper'
import { useSidebarMenuItems } from '@/hooks/use-side-bar-menu-items'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User
}
export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const NavigationData = useSidebarMenuItems()

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
