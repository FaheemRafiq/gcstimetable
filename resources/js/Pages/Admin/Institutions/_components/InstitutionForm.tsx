import React, { Fragment, useEffect } from 'react'
import { FormSheet } from '@/Components/FormSheet'
import { useForm } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { Institution } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/Components/InputError'

interface FormProps {
  name: string
  email: string
  address: string
  phone: string
  [key: string]: any
}

interface RoomFormProps {
  institution?: Institution
  open?: boolean | undefined
  onClose?: () => void
}

export const InstituionForm: React.FC<RoomFormProps> = ({
  institution,
  open: openProp = undefined,
  onClose,
}) => {
  // Constants
  const isEditForm = institution !== undefined

  // State
  const [open, setOpen] = React.useState(false)

  const { data, post, put, errors, processing, reset, setData, setError } = useForm<FormProps>({
    name: '',
    email: '',
    address: '',
    phone: '',
  })

  useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp)
    }
  }, [openProp])

  useEffect(() => {
    if (isEditForm && institution) {
      setData(data => ({
        ...data,
        name: institution.name,
        address: institution.address,
        phone: institution.phone,
        email: institution.email,
      }))
    }
  }, [institution])

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
      ? route('institutions.update', institution.id)
      : route('institutions.store')
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
          {isEditForm ? 'Edit' : 'Create'} Institution
        </Button>
      )}

      <FormSheet
        open={open}
        setOpen={handleOpen}
        title={isEditForm ? `Edit Institution: ${institution?.name}` : 'Create Institution'}
        description={`Fill the required fields to ${
          isEditForm ? 'update the institution.' : 'create a new institution.'
        }`}
        footerActions={
          <Button
            disabled={processing}
            size="sm"
            type="submit"
            form="institutionForm" // Attach button to form
          >
            Save
          </Button>
        }
      >
        <form id="institutionForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              placeholder="Enter program name"
              onChange={e => setData('name', e.target.value)}
            />
            <InputError message={errors.name} />
          </div>

          {/* email Field */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={data.email}
              placeholder="Enter email"
              onChange={e => setData('email', e.target.value)}
            />
            <InputError message={errors.email} />
          </div>

          {/* Address Field */}
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={data.address}
              placeholder="Enter address"
              onChange={e => setData('address', e.target.value)}
            />
            <InputError message={errors.address} />
          </div>

          {/* Phone Field */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone}
              placeholder="Enter phone"
              onChange={e => setData('phone', e.target.value)}
            />
            <InputError message={errors.phone} />
          </div>
        </form>
      </FormSheet>
    </Fragment>
  )
}
