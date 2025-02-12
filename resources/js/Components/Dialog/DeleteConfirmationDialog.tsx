import React, { ReactNode } from 'react'
import Modal from '@/Components/AnimatedModal'
import { Button } from '@/components/ui/button'

interface DeleteConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onDelete: () => void
  title?: ReactNode | string // Customizable dialog title
  message?: ReactNode | string // Customizable dialog message
  processing?: boolean // Disable buttons while processing
  confirmButtonLabel?: string // Custom label for confirm button
  cancelButtonLabel?: string // Custom label for cancel button
}

function DeleteConfirmationDialog({
  open,
  onClose,
  onDelete,
  title = 'Are you sure?',
  message = 'Once deleted, this action cannot be undone. Please confirm before proceeding.',
  processing = false,
  confirmButtonLabel = 'Delete',
  cancelButtonLabel = 'Cancel',
}: DeleteConfirmationDialogProps) {
  return (
    <Modal show={open} onClose={onClose}>
      <form
        onSubmit={e => {
          e.preventDefault()
          onDelete()
        }}
        className="p-6"
      >
        <h2 className="text-lg font-medium text-foreground">{title}</h2>

        {typeof message === 'string' ? (
          <p className="mt-1 text-sm text-foreground/80">{message}</p>
        ) : (
          <div className="mt-1 text-sm text-foreground/80">{message}</div>
        )}

        <div className="mt-6 flex justify-end">
          {/* Cancel Button */}
          <Button variant="outline" onClick={onClose} disabled={processing} type="button">
            {cancelButtonLabel}
          </Button>

          {/* Confirm Button */}
          <Button variant="destructive" className="ms-3" type="submit" disabled={processing}>
            {confirmButtonLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default DeleteConfirmationDialog
