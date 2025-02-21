import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { router } from '@inertiajs/react'
import { Teacher } from '@/types/database'
import { Fragment } from 'react/jsx-runtime'
import { useState } from 'react'
import DeleteConfirmationDialog from '@/Components/Dialog/DeleteConfirmationDialog'
import ConfirmationDialog from '@/Components/Dialog/ConfirmationDialog'

interface DataTableRowActionsProps {
  row: Teacher
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  
  // Delete state
  const [openDelete, setOpenDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Status change state
  const [openStatusChange, setOpenStatusChange] = useState(false)

  const handleDelete = (row: Teacher) => {
    setDeleting(true)
    router.delete(route('teachers.destroy', row.id), {
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

  function handleEdit(row: Teacher) {
    router.get(route('teachers.edit', row.id))
  }

  function handleWorkload(row: Teacher) {
    router.get(route('teachers.workload', row.id))
  }

  function handleToggleStatus(row: Teacher) {
    router.patch(route('teachers.change.status', row.id), {
      preserveScroll: true,
      preserveState: true
    })
  }

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onSelect={() => handleEdit(row)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleWorkload(row)}>View Workload</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setOpenDelete(true)}>
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setOpenStatusChange(true)}>
            {row.is_active === 'active' ? 'Deactivate' : 'Activate'}
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={() => handleDelete(row)}
        title="Delete Teacher?"
        message={
          <p>
            Are you sure you want to delete <strong>{row.name}</strong>?
          </p>
        }
        processing={deleting}
      />

      {/* Status Change Confirmation */}
      <ConfirmationDialog
        open={openStatusChange}
        onClose={() => setOpenStatusChange(false)}
        onConfirm={() => handleToggleStatus(row)}
        title={row.is_active === 'active' ? 'Deactivate Teacher?' : 'Activate Teacher?'}
        message={
          <p>
            Are you sure you want to {row.is_active === 'active' ? 'deactivate' : 'activate'}{' '}
            <strong>{row.name}</strong>?
          </p>
        }
      />
    </Fragment>
  )
}
