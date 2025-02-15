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
import { toast } from 'react-toastify';
import { Room } from '@/types/database'
import DeleteConfirmationDialog from '@/Components/Dialog/DeleteConfirmationDialog'
import { RoomForm } from './RoomForm'

export function Actions({ row }: { row: Room }) {
  // Edit State
  const [openEdit, setOpenEdit] = useState(false)

  // Delete State
  const [openConfirm, setOpenConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = (row: Room) => {
    setDeleting(true)
    router.delete(route('rooms.destroy', row.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setOpenConfirm(false)
      },
      onError: error => {
        if (error.message) {
          toast.error(error.message)
        }
      },
      onFinish: () => {
        setDeleting(false)
      },
    })
  }

  function handleView(row: Room) {
    router.get(route('rooms.show', row.id))
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

      {/* Edit Room */}

      {openEdit && <RoomForm room={row} open={openEdit} onClose={() => setOpenEdit(false)} />}

      {/* Room Delete Confirmation */}
      <DeleteConfirmationDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onDelete={() => handleDelete(row)}
        title="Delete Room"
        message={`Are you sure you want to delete ${row.code}?`}
        processing={deleting}
      />
    </Fragment>
  )
}
