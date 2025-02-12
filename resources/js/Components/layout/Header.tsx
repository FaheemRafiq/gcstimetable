import { PropsWithChildren } from 'react'
import { Separator } from '@/components/ui/separator'
import { ModeToggle } from '@/components/mode-toggle'
import { CommandDialogDemo } from '@/components/command'
import { PageBreadcrums } from './page-breadcrum'
import Tooltip from '@/components/ui/tooltip'

export default function Header({ SidebarTrigger }: PropsWithChildren<{ SidebarTrigger: any }>) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4 w-full">
        <Tooltip title="CTRL+b">
          <SidebarTrigger className="-ml-1" />
        </Tooltip>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <PageBreadcrums />
        <div className="ml-auto">
          <CommandDialogDemo />
        </div>
        <ModeToggle />
      </div>
    </header>
  )
}
