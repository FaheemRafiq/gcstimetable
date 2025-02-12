import React from 'react'
import { router } from '@inertiajs/react'
import toast from 'react-hot-toast'
import DeleteConfirmationDialog from '@/Components/Dialog/DeleteConfirmationDialog'

interface DeleteAllocationDialogProps {
  open: boolean
  onClose: () => void
  allocation_id: number
}

function DeleteAllocationDialog({ open, onClose, allocation_id }: DeleteAllocationDialogProps) {
  const [processing, setProcessing] = React.useState(false)

  function deleteAllocation() {
    setProcessing(true)

    router.delete(route('allocations.destroy', allocation_id), {
      preserveScroll: true,
      onSuccess: () => {
        onClose()
      },
      onError: error => {
        if (error.message) {
          toast.error(error.message)
        }
      },
      onFinish: () => {
        setProcessing(false)
      },
    })
  }

  return (
    <DeleteConfirmationDialog
      open={open}
      onClose={onClose}
      onDelete={deleteAllocation}
      title="Delete Allocation?"
      message="Once an allocation is deleted, it cannot be recovered. Are you sure you want to delete this allocation?"
      confirmButtonLabel="Delete Allocation"
      cancelButtonLabel="Cancel"
      processing={processing}
    />
  )
}

export default DeleteAllocationDialog
