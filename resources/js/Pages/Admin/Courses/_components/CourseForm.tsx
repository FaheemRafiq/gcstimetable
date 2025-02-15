import React, { useEffect } from 'react'
import { FormSheet } from '@/Components/FormSheet'
import { useForm, usePage } from '@inertiajs/react'
import { toast } from 'react-toastify';
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
import { ClassType, Course, Institution, Semester } from '@/types/database'
import { fetchWrapper } from '@/lib/fetchWrapper'
import { AutoCompleteSelect } from '@/components/combobox'
import { useAbilities } from '@/components/abilities-provider'

interface CourseFormProps {
  course?: Course
  open?: boolean | undefined
  onClose?: () => void
}

interface PageState {
  institutions: Institution[]
  types: { [key: string]: string }
  isFeteched: boolean
}

export const CourseForm: React.FC<CourseFormProps> = ({
  course,
  open: openProp = undefined,
  onClose,
}) => {
  const { isSuperAdmin } = useAbilities()

  // Constants
  const isEditForm = !!course

  // State
  const [open, setOpen] = React.useState(openProp ?? false)
  const [pageState, setPageState] = React.useState<PageState>({
    institutions: [],
    types: {},
    isFeteched: false,
  })

  const { data, post, put, errors, processing, reset, setData } = useForm<
    Omit<Course, 'id' | 'created_at' | 'updated_at'>
  >({
    name: course?.name ?? '',
    code: course?.code ?? '',
    credit_hours: course?.credit_hours ?? 0,
    display_code: course?.display_code ?? '',
    institution_id: course?.institution_id ?? 0,
    type: course?.type ?? 'CLASS',
    is_default: course?.is_default ?? 0,
  })

  useEffect(() => {
    if (open && !pageState.isFeteched) {
      handleFetchState()
    }
  }, [open])

  useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp)
    }
  }, [openProp])

  function handleFetchState() {
    fetchWrapper({
      url: route('courses.create'),
      method: 'GET',
    })
      .then(response => {
        setPageState({
          ...response,
          isFetched: true,
        })
      })
      .catch(error => {
        console.error('handleCreate -> error', error)
      })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fullRoute = isEditForm ? route('courses.update', course.id) : route('courses.store')
    const method = isEditForm ? put : post

    method(fullRoute, {
      preserveState: true,
      onSuccess: () => {
        reset()
        setOpen(false)
        onClose?.()
      },
      onError: error => {
        toast.error(error.message || 'An error occurred.')
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
    <React.Fragment>
      {/* Conditionally render button if `openProp` is not provided */}
      {openProp === undefined && (
        <Button onClick={() => setOpen(true)} size="sm">
          {isEditForm ? 'Edit Course' : 'Create Course'}
        </Button>
      )}

      <FormSheet
        open={open}
        setOpen={handleOpen}
        title={isEditForm ? `Edit Course: ${course?.name}` : 'Create Course'}
        description={`Fill the required fields to ${
          isEditForm ? 'update the course.' : 'create a new course.'
        }`}
        footerActions={
          <Button
            disabled={processing}
            size="sm"
            type="submit"
            form="courseForm" // Attach the button to the form
          >
            Save
          </Button>
        }
      >
        <form id="courseForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              placeholder="Enter course name"
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
              placeholder="Enter course code"
              onChange={e => setData('code', e.target.value)}
            />
            <InputError message={errors.code} />
          </div>

          {/* Credit Hours Field */}
          <div>
            <Label htmlFor="credit_hours">Credit Hours</Label>
            <Input
              id="credit_hours"
              type="number"
              value={data.credit_hours}
              placeholder="Enter credit hours"
              onChange={e => setData('credit_hours', parseInt(e.target.value, 10) || 0)}
            />
            <InputError message={errors.credit_hours} />
          </div>

          {/* Display Code Field */}
          <div>
            <Label htmlFor="display_code">Display Code</Label>
            <Input
              id="display_code"
              value={data.display_code}
              placeholder="Enter display code"
              onChange={e => setData('display_code', e.target.value)}
            />
            <InputError message={errors.display_code} />
          </div>

          {/* Semester Field */}
          {isSuperAdmin() && (
            <div>
              <Label htmlFor="institution_id">Institution</Label>
              <AutoCompleteSelect
                label="Select Institution"
                value={data.institution_id?.toString() ?? ''}
                setValue={(value: string) => {
                  setData('institution_id', Number(value) ?? null)
                }}
                values={
                  pageState.institutions?.map(value => {
                    return {
                      value: value.id.toString(),
                      label: value.name,
                    }
                  }) ?? []
                }
                isError={Boolean(errors.institution_id)}
              />
              <InputError message={errors.institution_id} />
            </div>
          )}

          {/* Type Field */}
          <div>
            <Label htmlFor="is_default">Type</Label>
            <Select
              onValueChange={value => setData('type', value as ClassType)}
              value={data.type?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(pageState.types).length > 0 &&
                  Object.keys(pageState.types).map(key => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <InputError message={errors.is_default} />
          </div>

          {/* Is Default Field */}
          <div>
            <Label htmlFor="is_default">Is Default</Label>
            <Select
              onValueChange={value => setData('is_default', parseInt(value, 10))}
              value={data.is_default?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Default</SelectItem>
                <SelectItem value="0">Not Default</SelectItem>
              </SelectContent>
            </Select>
            <InputError message={errors.is_default} />
          </div>
        </form>
      </FormSheet>
    </React.Fragment>
  )
}
