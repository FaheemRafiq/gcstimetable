import React, { ReactNode } from 'react'
import Modal from '@/Components/AnimatedModal'
import { Button } from '@/components/ui/button'

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: ReactNode | string
  message?: ReactNode | string
  processing?: boolean
  confirmButtonLabel?: string
  cancelButtonLabel?: string
  confirmButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' // More flexibility for confirm button
}

function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Please confirm before proceeding.',
  processing = false,
  confirmButtonLabel = 'Confirm',
  cancelButtonLabel = 'Cancel',
  confirmButtonVariant = 'default', // Default is a normal button, can be overridden
}: ConfirmationDialogProps) {
  return (
    <Modal show={open} onClose={onClose}>
      <form
        onSubmit={e => {
          e.preventDefault()
          onConfirm()
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

          {/* Confirm Button with dynamic variant */}
          <Button
            variant={confirmButtonVariant}
            className="ms-3"
            type="submit"
            disabled={processing}
          >
            {confirmButtonLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ConfirmationDialog
