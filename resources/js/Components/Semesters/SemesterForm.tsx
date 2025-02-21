import React, { Fragment, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from '@inertiajs/react'
import InputError from '@/Components/InputError'
import { toast } from 'react-toastify'
import { Program, Semester, Slot } from '@/types/database'
import { Switch } from '@/components/ui/switch'
import { FormSheet } from '@/Components/FormSheet'
import { IsActive } from '@/types'
import { fetchWrapper } from '@/lib/fetchWrapper'
import { AutoCompleteSelect } from '@/components/combobox'
import { IsActiveSwitch } from '../IsActive'

interface FormProps {
  name: string
  number: number
  is_active: IsActive
  program_id: number | null
  [key: string]: any
}

interface PageProps {
  semester?: Semester | null
  programId?: number
  open?: boolean
  onClose?: () => void
}

interface PageStateProps {
  programs: Program[]
  isFetched: boolean
}

export const SemesterForm: React.FC<PageProps> = ({
  semester,
  programId,
  open: openProp,
  onClose,
}) => {
  const isEditForm = !!semester

  // Page States
  const [open, setOpen] = React.useState(false)
  const [pageStates, setPageStates] = React.useState<PageStateProps>({
    programs: [],
    isFetched: false,
  })

  useEffect(() => {
    if (open === true && pageStates.isFetched === false && programId === undefined) {
      ;(() => {
        fetchWrapper({
          url: route('semesters.create'),
        })
          .then(data => {
            setPageStates({
              ...data,
              isFetched: true,
            })
          })
          .catch(error => {})
      })()
    }
  }, [open])

  useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp)
    }
  }, [openProp])

  const { data, errors, processing, setData, post, reset, put } = useForm<FormProps>({
    name: semester?.name ?? '',
    number: semester?.number ?? 1,
    is_active: semester?.is_active ?? 'active',
    program_id: semester?.program_id ?? programId ?? null,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const method = isEditForm ? put : post
    const routeName = isEditForm ? 'semesters.update' : 'semesters.store'
    const routeParams = isEditForm && semester ? [semester.id] : []

    method(route(routeName, routeParams), {
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
      reset()
    }
  }

  return (
    <Fragment>
      {openProp === undefined && (
        <Button onClick={() => setOpen(true)} size="sm">
          {isEditForm ? 'Edit' : 'Create'} Semester
        </Button>
      )}
      <FormSheet
        open={open}
        setOpen={handleOpen}
        title={isEditForm ? 'Edit Semester : ' + semester.name : 'Create Semester'}
        description={`Fill the required fields to ${
          isEditForm ? 'edit' : 'create'
        } a Semester. Click save when you're done.`}
        footerActions={
          <Button
            disabled={processing}
            size="sm"
            type="submit"
            form="roomForm" // Attach button to form
          >
            Save
          </Button>
        }
      >
        <form id="roomForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Code Field */}
          <div>
            <Label htmlFor="code">
              Name
              <span className="ps-0.5 text-xs text-red-600">*</span>
            </Label>
            <Input
              id="code"
              type="text"
              value={data.name}
              placeholder="Enter name"
              onChange={e => setData('name', e.target.value)}
              required
            />
            <InputError message={errors.name} />
          </div>

          {/* Semester No. Field */}
          <div>
            <Label htmlFor="code">
              Semester No.
              <span className="ps-0.5 text-xs text-red-600">*</span>
            </Label>
            <Input
              id="code"
              type="number"
              min={1}
              max={10}
              value={data.number}
              placeholder="Enter semester number"
              onChange={e => setData('number', parseInt(e.target.value))}
              required
            />
            <InputError message={errors.number} />
          </div>

          {/* Program Field */}
          {pageStates.programs.length > 0 && (
            <div>
              <Label htmlFor="program_id">Program</Label>
              <AutoCompleteSelect
                label="Select Program"
                value={data.program_id?.toString() ?? ''}
                setValue={value => setData('program_id', parseInt(value))}
                values={pageStates.programs.map(program => ({
                  value: program.id.toString(),
                  label: program.name,
                }))}
              />
              <InputError message={errors.program_id} />
            </div>
          )}

          {/* Is Active Field */}
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
