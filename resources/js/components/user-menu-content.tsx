import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { UserInfo } from '@/components/user-info'
import { type User } from '@/types'
import { Link, router } from '@inertiajs/react'
import { LogOut, UserIcon } from 'lucide-react'

interface UserMenuContentProps {
  user: User
}

export function UserMenuContent({ user }: UserMenuContentProps) {
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
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link className="block w-full" href={route('profile.edit')} as="button" prefetch>
            <UserIcon size={16} className="mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      {/* <DropdownMenuSeparator /> */}
      <DropdownMenuItem onClick={handleLogout}>
        <LogOut size={16} className="mr-2" />
        Log out
      </DropdownMenuItem>
    </>
  )
}
