import { cn } from '@/lib/utils'
import { Command } from 'lucide-react'

interface ApplicationLogoProps {
  className?: string
  iconSize?: number
}

export default function ApplicationLogo({ className, iconSize = 4 }: ApplicationLogoProps) {
  return (
    <div
      className={cn(
        'flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground',
        className
      )}
    >
      <Command className={`size-${iconSize}`} />
    </div>
  )
}
