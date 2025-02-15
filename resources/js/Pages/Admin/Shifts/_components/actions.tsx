import React, { useState } from 'react'
import { EllipsisVertical, Eye, Pencil, Trash, User as UserIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Fragment } from 'react/jsx-runtime'
import { Link, router, useForm } from '@inertiajs/react'
import { toast } from 'react-toastify';
import { Shift } from '@/types'
import DeleteConfirmationDialog from '@/Components/Dialog/DeleteConfirmationDialog'
import { ShiftForm } from './ShiftForm'

export function Actions({ row }: { row: Shift }) {
  // Edit State
  const [openEdit, setOpenEdit] = useState(false)

  // Delete Action State
  const [openConfirm, setOpenConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = (row: Shift) => {
    setDeleting(true)
    router.delete(route('shifts.destroy', row.id), {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => {
        setDeleting(false)
      },
    })
  }

  function handleView(row: Shift) {
    router.get(route('shifts.show', row.id))
  }

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Operations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleView(row)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenEdit(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenConfirm(true)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Shift */}
      {openEdit && <ShiftForm shift={row} open={openEdit} onClose={() => setOpenEdit(false)} />}

      {/* Shift Delete Confirmation */}
      <DeleteConfirmationDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onDelete={() => handleDelete(row)}
        title="Delete Shift?"
        message="Once a shift is deleted, it cannot be recovered. Are you sure you want to delete this shift? This will also delete all associated records."
        confirmButtonLabel="Delete Shift"
        cancelButtonLabel="Cancel"
        processing={deleting}
      />
    </Fragment>
  )
}
