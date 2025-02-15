import React, { Fragment, useEffect } from 'react'
import { FormSheet } from '@/Components/FormSheet'
import { useForm } from '@inertiajs/react'
import { toast } from 'react-toastify';
import { Department, Institution } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/Components/InputError'
import { fetchWrapper } from '@/lib/fetchWrapper'
import { useAbilities } from '@/components/abilities-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Update FormProps interface
interface FormProps {
  name: string
  code: string
  institution_id: number
}

// Update RoomFormProps to use Department
interface DepartmentFormProps {
  department?: Department
  open: boolean
  onClose: () => void
}

interface PageProps {
  institutions: Institution[]
  isFetched: boolean
}

// Rename component to DepartmentForm and update props
export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  open: openProp,
  onClose,
}) => {
  const { isSuperAdmin } = useAbilities()

  // Update isEditForm check
  const isEditForm = department !== undefined

  const [pageProps, setPageProps] = React.useState<PageProps>({
    institutions: [],
    isFetched: false,
  })

  const { data, post, put, errors, processing, reset, setData, setError } = useForm<FormProps>({
    name: '',
    code: '',
    institution_id: 0,
  })

  useEffect(() => {
    if (!openProp && pageProps.isFetched === false && isSuperAdmin()) {
      fetchInstitutions()
    }
  }, [openProp])

  // Update useEffect for editing
  useEffect(() => {
    if (isEditForm && department) {
      setData(data => ({
        ...data,
        name: department.name,
        code: department.code,
        institution_id: department.institution_id,
      }))
    }
  }, [department])

  // Update route names in handleSubmit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fullRoute = isEditForm
      ? route('departments.update', department.id)
      : route('departments.store')
    const method = isEditForm ? put : post

    method(fullRoute, {
      preserveState: true,
      onSuccess: () => {
        reset()
        onClose?.()
      },
      onError: error => {
        if (error.message) {
          toast.error(error.message)
        }
      },
    })
  }

  function fetchInstitutions() {
    fetchWrapper({
      url: route('departments.create'),
      method: 'GET',
    })
      .then(response => {
        setPageProps({
          ...response,
          isFetched: true,
        })

        if (response.institutions && response.institutions.length > 0) {
          setData('institution_id', response.institutions[0].id)
        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  return (
    <Fragment>
      <FormSheet
        open={openProp}
        setOpen={onClose}
        title={isEditForm ? `Edit Department: ${department?.name}` : 'Create Department'}
        description={`Fill the required fields to ${isEditForm ? 'update the department.' : 'create a new department.'}`}
        footerActions={
          <Button disabled={processing} size="sm" type="submit" form="departmentForm">
            Save
          </Button>
        }
      >
        <form id="departmentForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              placeholder="Enter department name"
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
              placeholder="Enter department code"
              onChange={e => setData('code', e.target.value)}
            />
            <InputError message={errors.code} />
          </div>

          {/* Institution Field */}
          {isSuperAdmin() && (
            <div>
              <Label htmlFor="institution_id">Institution</Label>
              <Select
                value={data.institution_id?.toString()}
                onValueChange={value => setData('institution_id', Number(value))}
              >
                <SelectTrigger className="dark:bg-gray-900 dark:border dark:border-gray-700">
                  <SelectValue placeholder="Select an institution" />
                </SelectTrigger>
                <SelectContent>
                  {pageProps.institutions.map(institution => (
                    <SelectItem key={institution.id} value={institution.id.toString()}>
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.institution_id} />
            </div>
          )}
        </form>
      </FormSheet>
    </Fragment>
  )
}
