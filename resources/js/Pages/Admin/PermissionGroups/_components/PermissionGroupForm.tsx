import React, { Fragment, useEffect } from 'react'
import { FormSheet } from '@/Components/FormSheet'
import { useForm } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { PermissionGroup } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/Components/InputError'
import { Permission, Shift } from '@/types'
import { fetchWrapper } from '@/lib/fetchWrapper'
import MultipleSelector from '@/components/ui/multi-select'

interface FormProps {
  name: string
  permissions: { value: number; label: string }[]
  [key: string]: any
}

interface RoomFormProps {
  group?: PermissionGroup
  open?: boolean | undefined
  onClose?: () => void
}

interface PageStateProps {
  permissions: Permission[]
  isFetched: boolean
}

export const PermissionGroupForm: React.FC<RoomFormProps> = ({
  group,
  open: openProp = undefined,
  onClose,
}) => {
  // Constants
  const isEditForm = group !== undefined

  // State
  const [open, setOpen] = React.useState(false)
  const [pageStates, setPageStates] = React.useState<PageStateProps>({
    permissions: [],
    isFetched: false,
  })

  const { data, post, put, errors, processing, reset, setData, setError } = useForm<FormProps>({
    name: '',
    permissions: [],
  })

  useEffect(() => {
    if (open === true && pageStates.isFetched === false) {
      handleFetchState()
    }
  }, [open])

  useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp)
    }
  }, [openProp])

  useEffect(() => {
    if (isEditForm && group) {
      setData(data => ({
        ...data,
        name: group.name,
        permissions:
          group.permissions?.map(permission => ({
            value: permission.id,
            label: permission.name,
          })) ?? [],
      }))
    }
  }, [group])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fullRoute = isEditForm
      ? route('permission-groups.update', group.id)
      : route('permission-groups.store')
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

  function handleFetchState() {
    fetchWrapper({
      url: route('permission-groups.create'),
      method: 'GET',
    })
      .then(response => {
        setPageStates({
          ...response,
          isFetched: true,
        })
      })
      .catch(error => {
        console.error('handleCreate -> error', error)
      })
  }

  return (
    <Fragment>
      {openProp === undefined && (
        <Button onClick={() => setOpen(true)} size="sm">
          {isEditForm ? 'Edit' : 'Create'} Group
        </Button>
      )}

      <FormSheet
        open={open}
        setOpen={handleOpen}
        title={isEditForm ? `Edit Group: ${group?.name}` : 'Create New Group'}
        description={`Fill the required fields to ${
          isEditForm ? 'update the group.' : 'create a new group.'
        }`}
        footerActions={
          <Button
            disabled={processing}
            size="sm"
            type="submit"
            form="permissionGroupForm" // Attach button to form
          >
            Save
          </Button>
        }
      >
        <form id="permissionGroupForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              placeholder="Enter group name"
              onChange={e => setData('name', e.target.value)}
            />
            <InputError message={errors.name} />
          </div>

          {/* Shift Field */}
          <div>
            <Label htmlFor="permissions">Permissions</Label>
            <MultipleSelector
              value={
                data.permissions?.map(permission => ({
                  value: permission.value.toString(),
                  label: permission.label,
                })) ?? []
              }
              className="w-full z-50"
              placeholder="Select Permissions"
              onChange={value =>
                setData(
                  'permissions',
                  value.map(permission => {
                    return { value: Number(permission.value), label: permission.label }
                  })
                )
              }
              options={pageStates.permissions?.map(permission => {
                return { value: String(permission.id), label: permission.name }
              })}
              disabled={pageStates.permissions?.length === 0}
            />
            <InputError message={errors.permissions} />
          </div>
        </form>
      </FormSheet>
    </Fragment>
  )
}
