import React, { useState } from 'react'
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
import { Fragment } from 'react/jsx-runtime'
import { router } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { Course } from '@/types/database'
import DeleteConfirmationDialog from '@/Components/Dialog/DeleteConfirmationDialog'
import { CourseForm } from './CourseForm'
import { CourseAttachForm } from './CourseAttachForm'

export function Actions({ row }: { row: Course }) {
  // Edit State
  const [openEdit, setOpenEdit] = useState(false)

  // attach course to semester
  const [openAttach, setOpenAttach] = useState(false)

  // Delete Action State
  const [openConfirm, setOpenConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = (row: Course) => {
    setDeleting(true)
    router.delete(route('courses.destroy', row.id), {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => {
        setDeleting(false)
        setOpenConfirm(false)
      },
    })
  }

  function handleView(row: Course) {
    router.get(route('courses.show', row.id))
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
            <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenEdit(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenAttach(true)}>
              <Link className="mr-2 h-4 w-4" />
              <span>Attach to Semester</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenConfirm(true)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Course */}
      {openEdit && (
        <CourseForm key={row.id} course={row} open={openEdit} onClose={() => setOpenEdit(false)} />
      )}

      {openAttach && (
        <CourseAttachForm open={openAttach} onClose={() => setOpenAttach(false)} course={row} />
      )}

      {/* Course Delete Confirmation */}
      <DeleteConfirmationDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onDelete={() => handleDelete(row)}
        title="Delete Course?"
        message="Once a course is deleted, it cannot be recovered. Are you sure you want to delete this course? This will also delete all associated records."
        confirmButtonLabel="Delete Course"
        cancelButtonLabel="Cancel"
        processing={deleting}
      />
    </Fragment>
  )
}
