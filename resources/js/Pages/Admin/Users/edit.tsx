import { useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps, Role, UserType } from '@/types'
import { DataTable } from '@/Components/Table/DataTable'
import columns from './_components/columns'
import { ResourcePaginator } from '@/types/data-table'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import UserFilters from './_components/UserFilters'
import { Department, Institution } from '@/types/database'
import UserForm from './_components/UserForm'

export default function Users({
  auth,
  user,
  roles,
  departments,
  institutions,
}: PageProps<{
  user: UserType
  roles: Role[]
  departments: Department[]
  institutions: Institution[]
}>) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: `Edit ${user.name}`,
      backItems: [{ title: 'Users', url: route('users.index') }],
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit User" />

      <div className="bg-card border border-border text-foreground sm:rounded-lg">
        <div className="p-6">
          <UserForm
            user={user}
            roles={roles}
            departments={departments}
            institutions={institutions}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
