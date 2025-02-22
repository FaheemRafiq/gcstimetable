import { useState } from 'react'
import { EllipsisVertical, Eye, Pencil, TentTree, Trash, User as UserIcon, Workflow } from 'lucide-react'
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
import { Department, Institution } from '@/types/database'
import DeleteConfirmationDialog from '@/Components/Dialog/DeleteConfirmationDialog'
import { DepartmentForm } from './DepartmentForm'

export function Actions({ row }: { row: Department }) {
  // Edit state
  const [openEdit, setOpenEdit] = useState(false)

  // Delete state
  const [openDelete, setOpenDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = (row: Department) => {
    setDeleting(true)
    router.delete(route('departments.destroy', row.id), {
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

  function handleView(row: Department) {
    router.get(route('departments.show', row.id))
  }

  function handleTeachersWorkload(row: Department) {
    router.get(route('departments.teacher-workload', row.id))
  }

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Operations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleView(row)}>
              <Eye className="mr-2 h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleTeachersWorkload(row)}
            >
              <Workflow className="mr-2 h-4 w-4" />
              <span>Teachers Workload</span>
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
        <DepartmentForm open={openEdit} onClose={() => setOpenEdit(false)} department={row} />
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={() => handleDelete(row)}
        title="Delete Department"
        message={`Are you sure you want to delete ${row.name} department?`}
        processing={deleting}
      />
    </Fragment>
  )
}
