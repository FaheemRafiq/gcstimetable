import ApplicationLogo from '@/Components/ApplicationLogo'
import { ModeToggle } from '@/components/mode-toggle'
import { Link } from '@inertiajs/react'
import { PropsWithChildren } from 'react'

export default function Guest({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen flex items-center bg-background transition-all">
      {/* Mode Toggle - Positioned at top right corner */}
      <div className="absolute top-3 right-3">
        <ModeToggle variant={'outline'} size={'lg'} className="w-10 h-10" />
      </div>

      {/* Content area - Takes full width on small screens, half on large screens */}
      <div className="mx-auto lg:w-1/2 flex flex-col items-center justify-center h-full w-full px-4 ">
        <Link href="/">
          <ApplicationLogo className="h-16 w-auto" iconSize={10} />
        </Link>
        <div className="w-full sm:max-w-xl mt-6 px-6 py-4 border border-border bg-card text-card-foreground shadow-md overflow-hidden sm:rounded-lg">
          {children}
        </div>
      </div>
    </div>
  )
}
