import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

export type Position = 'top' | 'bottom' | 'left' | 'right'

interface FormSheetProps {
  open: boolean
  setOpen: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode // The form or any content passed as children
  footerActions?: React.ReactNode // Optional footer actions
  position?: Position
}

export function FormSheet({
  open,
  setOpen,
  title,
  description,
  children,
  footerActions,
  position = 'right',
}: FormSheetProps) {
  const isMobile = useIsMobile()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side={isMobile ? 'bottom' : position}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="py-4">{children}</div>
        <SheetFooter>
          <SheetClose asChild>
            <Button size={'sm'} variant={'ghost'}>
              Close
            </Button>
          </SheetClose>
          {footerActions}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
