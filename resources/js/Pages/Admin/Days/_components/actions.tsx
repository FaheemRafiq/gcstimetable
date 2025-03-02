import React, { useState } from 'react'
import { EllipsisVertical, Check, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Fragment } from 'react/jsx-runtime'
import { router } from '@inertiajs/react'
import { Day } from '@/types/database'

export function Actions({ row }: { row: Day }) {
  const [processing, setProcessing] = useState(false)

  const handleStatusChange = (isActive: boolean) => {
    setProcessing(true)

    router.patch(
      route('days.change.status', row.id),
      { is_active: isActive ? 'active' : 'inactive', institution_id: row.pivot.institution_id },
      {
        preserveScroll: true,
        onFinish: () => setProcessing(false),
      }
    )
  }

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Status Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {row.pivot.is_active === 'active' ? (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleStatusChange(false)}
                disabled={processing}
              >
                <X className="mr-2 h-4 w-4 text-red-500" />
                <span>Deactivate</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleStatusChange(true)}
                disabled={processing}
              >
                <Check className="mr-2 h-4 w-4 text-green-500" />
                <span>Activate</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  )
}
