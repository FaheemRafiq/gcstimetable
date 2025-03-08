import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useInitials } from '@/hooks/use-initials'
import { cn } from '@/lib/utils'
import { type User } from '@/types'

type UserInfo = {
  user: User
  showEmail?: boolean
  className?: string
  fallbackClassName?: string
}

export function UserInfo({
  user,
  showEmail = false,
  className = '',
  fallbackClassName = '',
}: UserInfo) {
  const getInitials = useInitials()

  return (
    <>
      <Avatar className={cn('h-8 w-8 overflow-hidden rounded-full', className)}>
        <AvatarImage src={user.profilePhotoUrl} alt={user.name} />
        <AvatarFallback className={cn('rounded-lg', fallbackClassName)}>
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        {showEmail && <span className="truncate text-xs">{user.email}</span>}
      </div>
    </>
  )
}
