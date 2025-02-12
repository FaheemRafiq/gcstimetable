import { useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps, UserType } from '@/types'
import { DataTable } from '@/Components/Table/DataTable'
import columns from './_components/columns'
import { ResourcePaginator } from '@/types/data-table'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import UserFilters from './_components/UserFilters'

export default function Users({ auth, users }: PageProps<{ users: ResourcePaginator<UserType> }>) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Users',
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Users" />

      <div className="bg-card border border-border text-foreground sm:rounded-lg">
        <div className="p-6">
          <div className="mb-4">
            <UserFilters />
          </div>

          <DataTable
            data={users.data}
            columns={columns}
            inputProps={{
              searchFilter: false,
              // filterColumn: "email",
              pagination: false,
            }}
            pageLinks={users.meta.links}
            totalCount={users.meta.total}
            from={users.meta.from}
            to={users.meta.to}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
