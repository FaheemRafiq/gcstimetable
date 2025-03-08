import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  UserIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { type User } from '@/types'
import { Link, router } from '@inertiajs/react'
import { UserMenuContent } from './user-menu-content'
import { UserInfo } from './user-info'

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar()

  function handleLogout() {
    router.post(
      route('logout'),
      {},
      {
        onSuccess: () => {
          localStorage.clear()
        },
      }
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.profilePhotoUrl} alt={user.name} />
                <AvatarFallback className="rounded-lg uppercase text-muted-foreground dark:border dark:border-muted-foreground">
                  {user.label.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div> */}
              <UserInfo
                user={user}
                showEmail={true}
                className="rounded-lg"
                fallbackClassName="rounded-lg uppercase text-muted-foreground dark:border dark:border-muted-foreground"
              />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-sidebar text-sidebar-foreground"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <UserMenuContent user={user} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
