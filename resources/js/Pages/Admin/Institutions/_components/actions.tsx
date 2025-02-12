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
import { router } from '@inertiajs/react'
import { Institution } from '@/types/database'
import DeleteConfirmationDialog from '@/Components/Dialog/DeleteConfirmationDialog'
import { InstituionForm } from './InstitutionForm'

export function Actions({ row }: { row: Institution }) {
  // Edit state
  const [openEdit, setOpenEdit] = useState(false)

  // Delete state
  const [openDelete, setOpenDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = (row: Institution) => {
    setDeleting(true)
    router.delete(route('institutions.destroy', row.id), {
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

  function handleView(row: Institution) {
    router.get(route('institutions.show', row.id))
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
            <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenDelete(true)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Program */}

      {openEdit && (
        <InstituionForm open={openEdit} onClose={() => setOpenEdit(false)} institution={row} />
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={() => handleDelete(row)}
        title="Delete Institution"
        message="Are you sure you want to delete this institution?"
        processing={deleting}
      />
    </Fragment>
  )
}
