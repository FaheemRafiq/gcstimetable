import React, { Fragment, useEffect } from 'react'
import { FormSheet } from '@/Components/FormSheet'
import { useForm } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { Section, Semester } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/Components/InputError'
import { fetchWrapper } from '@/lib/fetchWrapper'
import { AutoCompleteSelect } from '@/components/combobox'
import { IsActiveSwitch } from '@/Components/IsActive'
import { IsActive } from '@/types'

interface FormProps {
  name: string
  semester_id: number | null
  is_active: IsActive
  [key: string]: any
}

interface SectionFormProps {
  section?: Section
  open?: boolean | undefined
  onClose?: () => void
  semesterId?: number
}

export const SectionForm: React.FC<SectionFormProps> = ({
  section,
  open: openProp = undefined,
  onClose,
  semesterId,
}) => {
  // Constants
  const isEditForm = section !== undefined

  // State
  const [open, setOpen] = React.useState(openProp ?? false)

  const { data, post, put, errors, processing, reset, setData, setError } = useForm<FormProps>({
    name: '',
    semester_id: semesterId ?? null,
    is_active: 'active',
  })

  useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp)
    }
  }, [openProp])

  useEffect(() => {
    if (isEditForm && section) {
      setData(data => ({
        ...data,
        name: section.name,
        semester_id: section.semester_id,
        is_active: section.is_active,
      }))
    }
  }, [section])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fullRoute = isEditForm ? route('sections.update', section.id) : route('sections.store')
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
          {isEditForm ? 'Edit' : 'Create'} Section
        </Button>
      )}

      <FormSheet
        open={open}
        setOpen={handleOpen}
        title={isEditForm ? `Edit Section: ${section?.name}` : 'Create Section'}
        description={`Fill the required fields to ${
          isEditForm ? 'update the section.' : 'create a new section.'
        }`}
        footerActions={
          <Button
            disabled={processing}
            size="sm"
            type="submit"
            form="sectionForm" // Attach button to form
          >
            Save
          </Button>
        }
      >
        <form id="sectionForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              placeholder="Enter section name"
              onChange={e => setData('name', e.target.value)}
            />
            <InputError message={errors.name} />
          </div>

          {/* is Active */}
          <div>
            <IsActiveSwitch
              isActive={data.is_active}
              setIsActive={value => setData('is_active', value)}
              error={errors.is_active}
            />
          </div>
        </form>
      </FormSheet>
    </Fragment>
  )
}
