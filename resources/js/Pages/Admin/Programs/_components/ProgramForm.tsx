import React, { Fragment, useEffect } from 'react'
import { FormSheet } from '@/Components/FormSheet'
import { useForm } from '@inertiajs/react'
import { toast } from 'react-toastify'
import { Department, Program, Room } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import InputError from '@/Components/InputError'
import { Shift } from '@/types'
import { fetchWrapper } from '@/lib/fetchWrapper'
import { AutoCompleteSelect } from '@/components/combobox'
import MultipleSelector from '@/components/ui/multi-select'

interface FormProps {
  name: string
  code: string
  duration: number
  type: string
  department_id: number | null
  shifts: { value: number; label: string }[]
  [key: string]: any
}

interface RoomFormProps {
  program?: Program
  open?: boolean | undefined
  onClose?: () => void
}

type ProgramTypes = {
  [key: string]: string
}

interface PageStateProps {
  shifts: Shift[]
  departments: Department[]
  types: ProgramTypes
  isFetched: boolean
}

export const ProgramForm: React.FC<RoomFormProps> = ({
  program,
  open: openProp = undefined,
  onClose,
}) => {
  // Constants
  const isEditForm = program !== undefined

  // State
  const [open, setOpen] = React.useState(false)
  const [pageStates, setPageStates] = React.useState<PageStateProps>({
    shifts: [],
    departments: [],
    types: {},
    isFetched: false,
  })

  const { data, post, put, errors, processing, reset, setData, setError } = useForm<FormProps>({
    name: '',
    code: '',
    duration: 1,
    type: '',
    department_id: null,
    shifts: [],
  })

  const filteredShifts = React.useMemo(() => {
    return pageStates.shifts?.filter(shift => shift.program_type === data.type)
  }, [data.type, pageStates.shifts])

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
    if (isEditForm && program) {
      setData(data => ({
        ...data,
        name: program.name,
        code: program.code,
        duration: program.duration,
        type: program.type,
        department_id: program.department_id,
        shifts: program.shifts?.map(shift => ({ value: shift.id, label: shift.name })) ?? [],
      }))
    }
  }, [program])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fullRoute = isEditForm ? route('programs.update', program.id) : route('programs.store')
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
      url: route('programs.create'),
      method: 'GET',
    })
      .then(response => {
        setPageStates({
          ...response,
          types: response.program_types,
          isFetched: true,
        })
      })
      .catch(error => {
        console.error('handleCreate -> error', error)
      })
  }

  function handleDurationChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target

    if (parseInt(value) < 0) {
      setData('duration', 0)
      return
    }

    setData('duration', parseInt(value))
  }

  return (
    <Fragment>
      {openProp === undefined && (
        <Button onClick={() => setOpen(true)} size="sm">
          {isEditForm ? 'Edit' : 'Create'} Program
        </Button>
      )}

      <FormSheet
        open={open}
        setOpen={handleOpen}
        title={isEditForm ? `Edit Program: ${program?.name}` : 'Create Program'}
        description={`Fill the required fields to ${
          isEditForm ? 'update the program.' : 'create a new program.'
        }`}
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

          {/* Code Field */}
          <div>
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={data.code}
              placeholder="Enter program code"
              onChange={e => setData('code', e.target.value)}
            />
            <InputError message={errors.code} />
          </div>

          {/* Capacity Field */}
          <div>
            <Label htmlFor="capacity">Duration (Year)</Label>
            <Input
              id="capacity"
              type="number"
              value={data.duration}
              placeholder="Enter program duration"
              onChange={handleDurationChange}
            />
            <InputError message={errors.duration} />
          </div>

          {/* Type Field */}
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={data.type} onValueChange={value => setData('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {pageStates.types &&
                  Object.keys(pageStates.types).map(type => (
                    <SelectItem value={type} key={type}>
                      {pageStates.types[type]}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <InputError message={errors.type} />
          </div>

          {/* Shift Field */}
          <div>
            <Label htmlFor="shifts">Shifts</Label>
            <MultipleSelector
              value={
                data.shifts?.map(shift => ({
                  value: shift.value.toString(),
                  label: shift.label,
                })) ?? []
              }
              className="w-full z-50"
              placeholder="Select Shifts"
              onChange={value =>
                setData(
                  'shifts',
                  value.map(shift => {
                    return { value: Number(shift.value), label: shift.label }
                  })
                )
              }
              options={filteredShifts?.map(shift => {
                return { value: String(shift.id), label: shift.name }
              })}
              disabled={filteredShifts?.length === 0}
            />
            <InputError message={errors.shifts} />
          </div>

          {/* Department Field */}
          <div>
            <Label htmlFor="department_id">Department</Label>
            <AutoCompleteSelect
              label="Select Department"
              value={data.department_id?.toString() ?? ''}
              setValue={(value: string) => {
                setData('department_id', Number(value) ?? null)
              }}
              values={
                pageStates.departments?.map(value => {
                  return {
                    value: value.id.toString(),
                    label: value.code + ' - ' + value.name,
                  }
                }) ?? []
              }
              isError={Boolean(errors.department_id)}
            />
            <InputError message={errors.department_id} />
          </div>
        </form>
      </FormSheet>
    </Fragment>
  )
}
