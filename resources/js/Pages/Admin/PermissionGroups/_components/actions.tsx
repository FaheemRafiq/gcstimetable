import { useState } from 'react'
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
import { PermissionGroup, Program, Room } from '@/types/database'
import DeleteConfirmationDialog from '@/Components/Dialog/DeleteConfirmationDialog'
import { PermissionGroupForm } from './PermissionGroupForm'

export function Actions({ row }: { row: PermissionGroup }) {
  // Edit state
  const [openEdit, setOpenEdit] = useState(false)

  // Delete state
  const [openDelete, setOpenDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = (row: PermissionGroup) => {
    setDeleting(true)
    router.delete(route('permission-groups.destroy', row.id), {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => {
        setDeleting(false)
      },
      onSuccess: () => {
        setOpenDelete(false)
      },
    })
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
            <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenEdit(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenDelete(true)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Program */}

      {openEdit && (
        <PermissionGroupForm open={openEdit} onClose={() => setOpenEdit(false)} group={row} />
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={() => handleDelete(row)}
        title="Delete Permission Group"
        message={<p>Are you sure you want to delete this {row.name} group?</p>}
        processing={deleting}
      />
    </Fragment>
  )
}
