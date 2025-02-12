import React, { useEffect } from 'react'
import { EllipsisVertical, Eye, Link, Pencil, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { router } from '@inertiajs/react'
import { Semester } from '@/types/database'
import DeleteConfirmationDialog from '@/Components/Dialog/DeleteConfirmationDialog'
import { SemesterForm } from '@/Components/Semesters/SemesterForm'
import { SemesterAttachForm } from '@/Components/Semesters'

export function Actions({ row }: { row: Semester }) {
  // Edit State
  const [openEdit, setOpenEdit] = React.useState(false)

  // Delete Action State
  const [openConfirm, setOpenConfirm] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  // Attach Courses
  const [openAttach, setOpenAttach] = React.useState(false)

  const handleDelete = (row: Semester) => {
    setDeleting(true)
    router.delete(route('semesters.destroy', row.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setOpenConfirm(false)
      },
      onFinish: () => {
        setDeleting(false)
      },
    })
  }

  function handleView() {
    router.get(route('semesters.show', row.id))
  }

  function handleCloseEdit() {
    setOpenEdit(false)

    setTimeout(() => {
      document.body.style.removeProperty('pointer-events')
    }, 1000)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Operations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleView()}>
              <Eye className="mr-2 h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenEdit(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenAttach(true)}>
              <Link className="mr-2 h-4 w-4" />
              <span>Attach Courses</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenConfirm(true)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Sheet */}
      {openEdit && <SemesterForm open={openEdit} onClose={handleCloseEdit} semester={row} />}

      {/* Attach Courses */}
      {openAttach && (
        <SemesterAttachForm open={openAttach} onClose={() => setOpenAttach(false)} semester={row} />
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onDelete={() => handleDelete(row)}
        processing={deleting}
        title="Delete Semester?"
        message={`Once ${row.name} is deleted, it cannot be recovered. Are you sure you want to delete this semester?`}
      />
    </>
  )
}
