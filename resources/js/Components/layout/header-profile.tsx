import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserMenuContent } from '@/components/user-menu-content'
import { useInitials } from '@/hooks/use-initials'
import { type PageProps } from '@/types'
import { Link, usePage } from '@inertiajs/react'

export function HeaderProfile() {
  const page = usePage<PageProps>()
  const { auth } = page.props
  const getInitials = useInitials()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-10 rounded-full p-1 ring-transparent focus-visible:outline-none focus-visible:ring-transparent"
        >
          <Avatar className="size-8 overflow-hidden rounded-full">
            <AvatarImage src={auth.user.profilePhotoUrl} alt={auth.user.name} />
            <AvatarFallback className="rounded-lg uppercase text-muted-foreground dark:border dark:border-muted-foreground">
              {getInitials(auth.user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <UserMenuContent user={auth.user} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
