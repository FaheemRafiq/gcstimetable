import { PropsWithChildren, useEffect } from 'react'
import { PageProps, User } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import Header from '@/Components/layout/Header'
import { usePage } from '@inertiajs/react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { cn } from '@/lib/utils'
import { AbilitiesProvider } from '@/components/abilities-provider'
import { toast } from 'react-toastify'

export default function Authenticated({ user, children }: PropsWithChildren<{ user: User }>) {
  const { flash } = usePage<PageProps>().props

  useEffect(() => {
    if (flash?.error) {
      toast.error(flash?.error)
    } else if (flash?.success) {
      toast.success(flash?.success)
    }
  }, [flash])

  return (
    <AbilitiesProvider user={user}>
      <SidebarProvider className="h-screen">
        <AppSidebar user={user} />
        <SidebarInset className="overflow-hidden">
          <Header SidebarTrigger={SidebarTrigger} />
          <div className={cn('flex flex-1 flex-col p-4 pt-0 overflow-y-auto')} scroll-region="true">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AbilitiesProvider>
  )
}
