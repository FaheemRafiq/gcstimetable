import React, { Fragment, useEffect } from 'react'
import { FormSheet } from '@/Components/FormSheet'
import { useForm } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/Components/InputError'
import { Permission, Role, Shift } from '@/types'

interface FormProps {
  name: string
  [key: string]: any
}

interface PermissionFormProps {
  permission?: Permission
  open?: boolean | undefined
  onClose?: () => void
}

export const PermissionForm: React.FC<PermissionFormProps> = ({
  permission,
  open: openProp = undefined,
  onClose,
}) => {
  // Constants
  const isEditForm = permission !== undefined

  // State
  const [open, setOpen] = React.useState(false)

  const { data, post, put, errors, processing, reset, setData, setError } = useForm<FormProps>({
    name: '',
  })

  useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp)
    }
  }, [openProp])

  useEffect(() => {
    if (isEditForm && permission) {
      setData('name', permission.name)
    }
  }, [permission])

  // Clear errors when data changes
  useEffect(() => {
    if (errors && data) {
      Object.keys(errors).forEach(key => {
        if (key === 'duration') {
          return
        }

        if (errors[key as keyof FormProps] && data[key as keyof FormProps]) {
          setError(key as keyof FormProps, '')
        }
      })
    }
  }, [data])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fullRoute = isEditForm
      ? route('permissions.update', permission.id)
      : route('permissions.store')
    const method = isEditForm ? put : post

    method(fullRoute, {
      preserveState: true,
      onSuccess: () => {
        reset()
        setOpen(false)
        onClose?.()
      },
      onError: error => {
        if (error.message) {
          toast.error(error.message)
        }
      },
    })
  }

  function handleOpen(value: boolean) {
    setOpen(value)

    if (value === false) {
      onClose?.()
    }
  }

  return (
    <Fragment>
      {openProp === undefined && (
        <Button onClick={() => setOpen(true)} size="sm">
          {isEditForm ? 'Edit' : 'Create'} Permission
        </Button>
      )}

      <FormSheet
        open={open}
        setOpen={handleOpen}
        title={isEditForm ? `Edit Permission: ${permission?.name}` : 'Create Permission'}
        description={`Fill the required fields to ${
          isEditForm ? 'update the permission.' : 'create a new permission.'
        }`}
        footerActions={
          <Button
            disabled={processing}
            size="sm"
            type="submit"
            form="PermissionForm" // Attach button to form
          >
            Save
          </Button>
        }
      >
        <form id="PermissionForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              placeholder="Enter permission name"
              onChange={e => setData('name', e.target.value)}
            />
            <InputError message={errors.name} />
          </div>
        </form>
      </FormSheet>
    </Fragment>
  )
}
