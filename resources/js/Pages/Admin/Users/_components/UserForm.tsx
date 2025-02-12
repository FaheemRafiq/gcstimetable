import * as React from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { EmailInput } from '@/components/inputs/email-input'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import { AutoCompleteSelect } from '@/components/combobox'
import { Department, Institution } from '@/types/database'
import toast from 'react-hot-toast'
import { Role, User, UserType } from '@/types'
import AdminWrapper, { RolesWrapper } from '@/Components/AdminWrapper'
import { RoleEnum } from '@/lib/enums'
import MultipleSelector from '@/components/ui/multi-select'
import { useAbilities } from '@/components/abilities-provider'

interface UserFormProps {
  user?: UserType
  roles: Role[]
  departments: Department[]
  institutions: Institution[]
}

interface ValueAndLable {
  value: string
  label: string
}

interface UserFormInterface {
  name: string
  email: string
  department_id: number | null
  institution_id: number | null
  roles: ValueAndLable[]
}

export function UserForm({ user, roles, departments, institutions }: UserFormProps) {
  console.log('UserForm => roles', roles)

  const isEditing = Boolean(user)
  const nameSection = React.useRef<HTMLInputElement>(null)
  const { isSuperAdmin, isInstitutionAdmin } = useAbilities()
  const [enableDepartmentSelector, setEnableDepartmentSelector] = React.useState(false)
  const [enableInstitutionSelector, setEnableInstitutionSelector] = React.useState(false)

  const { data, setData, errors, post, put, processing, setError, transform } =
    useForm<UserFormInterface>({
      name: user?.name ?? '',
      email: user?.email ?? '',
      department_id: user?.institution?.id ?? null,
      institution_id: user?.department_id ?? null,
      roles: [],
    })

  React.useEffect(() => {
    if (user && user?.roles.length > 0) {
      let values = user.roles.map(role => {
        return {
          value: role.id.toString(),
          label: role.name,
        }
      })
      handleRoleChange(values)
    }
  }, [user])

  const DepartmentValues = React.useMemo(() => {
    return departments.map(department => {
      return {
        value: department.id.toString(),
        label: department.name,
      }
    })
  }, [departments])

  const InstitutionValues = React.useMemo(() => {
    return institutions.map(institution => {
      return {
        value: institution.id.toString(),
        label: institution.name,
      }
    })
  }, [institutions])

  function isOnlyOneRoleBeSelected(values: ValueAndLable[]) {
    if (
      values.filter(
        v =>
          v.label == RoleEnum.DEPARTMENT_ADMIN ||
          v.label == RoleEnum.INSTITUTION_ADMIN ||
          v.label == RoleEnum.SUPER_ADMIN
      ).length > 1
    ) {
      if (isInstitutionAdmin()) {
        toast.error('You can only select one role either institution admin or department admin')
      } else if (isSuperAdmin()) {
        toast.error(
          'You can only select one role either institution admin or department admin or super admin'
        )
      }

      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const method = isEditing ? put : post
    const url = isEditing ? route('users.update', user?.id) : route('users.store')

    if (isOnlyOneRoleBeSelected(data.roles) == false) return

    transform((data: UserFormInterface) => {
      return {
        ...data,
        roles: data.roles.map(role => role.value),
      }
    })

    method(url, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => router.get(route('users.index')),
      onError: error => {
        if (error.message) {
          toast.error(error.message)
        }
      },
      onFinish: () => {
        if (nameSection.current && (errors.name || errors.email)) {
          nameSection.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      },
    })
  }

  function handleRoleChange(value: ValueAndLable[]) {
    if (isOnlyOneRoleBeSelected(value)) {
      setData('roles', value)

      if (isSuperAdmin()) {
        if (value.findIndex(v => v.label === RoleEnum.INSTITUTION_ADMIN) !== -1) {
          setEnableInstitutionSelector(true)
        } else {
          setEnableInstitutionSelector(false)
        }

        if (value.findIndex(v => v.label === RoleEnum.DEPARTMENT_ADMIN) !== -1) {
          setEnableDepartmentSelector(true)
        } else {
          setEnableDepartmentSelector(false)
        }
      } else if (isInstitutionAdmin()) {
        if (value.findIndex(v => v.label === RoleEnum.DEPARTMENT_ADMIN) !== -1) {
          setEnableDepartmentSelector(true)
        } else {
          setEnableDepartmentSelector(false)
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full bg-white rounded-lg dark:bg-background">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit User' : 'Create User'}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div key="name">
                <InputLabel htmlFor="name" value="Name" aria-required />
                <Input
                  autoFocus
                  className="w-full"
                  placeholder="Enter Name"
                  id="name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  required
                />
                <InputError message={errors.name} />
              </div>
              <div key="email">
                <InputLabel htmlFor="email" value="Email" aria-required />
                <EmailInput
                  className="w-full"
                  id="email"
                  placeholder="example@gmail.com"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  required
                />
                <InputError message={errors.email} />
              </div>
            </div>
          </div>

          <RolesWrapper roles={[RoleEnum.SUPER_ADMIN, RoleEnum.INSTITUTION_ADMIN]} operator="or">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Roles section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div key="roles">
                  <InputLabel htmlFor="roles" value="Roles" />
                  <MultipleSelector
                    value={data.roles?.map(role => {
                      return { value: String(role.value), label: role.label }
                    })}
                    className="w-full z-50"
                    onChange={value => handleRoleChange(value)}
                    options={roles?.map(role => {
                      return { value: String(role.id), label: role.name }
                    })}
                  />
                  <InputError message={errors.department_id} />
                </div>
                {enableDepartmentSelector && (
                  <div key="department_id">
                    <InputLabel htmlFor="department_id" value="Department" />
                    <AutoCompleteSelect
                      label="Select Department"
                      value={data.department_id?.toString() ?? null}
                      setValue={(value: string) => {
                        setData('department_id', Number(value) ?? null)
                      }}
                      values={DepartmentValues}
                      isError={Boolean(errors.department_id)}
                    />
                    <InputError message={errors.department_id} />
                  </div>
                )}
              </div>
              {enableInstitutionSelector && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div key="institution_id">
                    <InputLabel htmlFor="institution_id" value="Institution" />
                    <AutoCompleteSelect
                      label="Select Institution"
                      value={data.institution_id?.toString() ?? null}
                      setValue={(value: string) => {
                        setData('institution_id', Number(value) ?? null)
                      }}
                      values={InstitutionValues}
                      isError={Boolean(errors.institution_id)}
                    />
                    <InputError message={errors.institution_id} />
                  </div>
                </div>
              )}
            </div>
          </RolesWrapper>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => router.get(route('users.index'))}>
            Cancel
          </Button>
          <Button type="submit" disabled={processing}>
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default UserForm
