import { router, useForm } from '@inertiajs/react'
import { Role, Permission } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import InputError from '@/Components/InputError'
import toast from 'react-hot-toast'
import { useAbilities } from '@/components/abilities-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PermissionCheckboxList } from '@/Components/PermissionList'
import { cn } from '@/lib/utils'

interface RoleFormProps {
  role?: Role
  permissions: Permission[]
  institutions?: { key: number; value: string }[]
}

function RoleForm({ role, permissions, institutions }: RoleFormProps) {
  const { isSuperAdmin } = useAbilities()
  const isEditForm = !!role

  const { data, setData, post, put, errors, processing, reset } = useForm({
    name: role?.name || '',
    guard_name: 'web',
    institution_id: role?.institution_id || null,
    permissions: role?.permissions?.map(p => p.id) || [],
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const routePath = isEditForm ? route('roles.update', role!.id) : route('roles.store')
    const method = isEditForm ? put : post

    method(routePath, {
      preserveState: true,
      onSuccess: () => {
        reset()
      },
      onError: error => {
        if (error.message) toast.error(error.message)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="w-full bg-white rounded-lg dark:bg-background">
        <CardHeader>
          <CardTitle>{isEditForm ? 'Edit Role' : 'Create Role'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={cn('col-span-2', {
                'col-span-2 md:col-span-1': isSuperAdmin(),
              })}
            >
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={data.name}
                placeholder="Enter role name"
                onChange={e => setData('name', e.target.value)}
              />
              <InputError message={errors.name} />
            </div>

            {isSuperAdmin() ? (
              <div className="col-span-2 md:col-span-1">
                <Label className="text-sm font-medium">Select Type</Label>
                <Select
                  value={data.institution_id?.toString() ?? 'null'}
                  onValueChange={value => setData('institution_id', Number(value))}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'null'}>All</SelectItem>

                    {institutions?.map(({ key, value }) => (
                      <SelectItem key={key} value={key.toString()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <div className="col-span-2">
              <Label className="text-sm font-medium">Assign Permissions</Label>
              <PermissionCheckboxList
                permissions={permissions}
                selectedPermissions={data.permissions}
                onToggle={ids => setData('permissions', ids)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => router.get(route('roles.index'))}>
            Cancel
          </Button>
          <Button type="submit" disabled={processing}>
            {isEditForm ? 'Update' : 'Save'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default RoleForm
