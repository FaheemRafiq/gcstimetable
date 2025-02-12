import { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'

// Types
import { PageProps, Role } from '@/types'

// Components
import { DataTable } from '@/Components/Table/DataTable'
import columns from './_components/columns'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { Button } from '@/components/ui/button'

export default function Rooms({ auth, roles }: PageProps<{ roles: Role[] }>) {
  // Constants
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Roles',
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Roles" />
      <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
        <div className="p-6">
          <DataTable
            data={roles}
            columns={columns}
            inputProps={{
              searchFilter: true,
              filterColumn: 'name',
              pagination: true,
            }}
            create_button={
              <h2 className="flex justify-end">
                <Button size={'sm'} onClick={() => router.visit(route('roles.create'))}>
                  Create Role
                </Button>
              </h2>
            }
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
