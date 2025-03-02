import { useEffect, useState } from 'react'
import { Head } from '@inertiajs/react'

// Types
import { PageProps } from '@/types'
import { PermissionGroup, Program } from '@/types/database'

// Components
import { DataTable } from '@/Components/Table/DataTable'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { Button } from '@/components/ui/button'
import { PermissionGroupForm } from './_components/PermissionGroupForm'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Actions } from './_components/actions'

const columns: ColumnDef<PermissionGroup>[] = [
  {
    accessorKey: 'index',
    header: '#',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ row }) => {
      const permissions = row.original.permissions
      return (
        <div className="space-x-1">
          {permissions?.map(permission => (
            <Badge variant={'secondary'} className="capitalize">
              {permission.name}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ row }) => {
      return <Actions row={row.original} />
    },
  },
]

export default function Index({ auth, groups }: PageProps<{ groups: PermissionGroup[] }>) {
  // state
  const [openCreate, setOpenCreate] = useState(false)

  // Constants
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Permission Groups',
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Permission Groups" />
      <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
        <div className="p-6">
          <DataTable
            data={groups}
            columns={columns}
            inputProps={{
              searchFilter: true,
              filterColumn: 'name',
              pagination: true,
            }}
            create_button={
              <h2 className="flex justify-end">
                <Button size={'sm'} onClick={() => setOpenCreate(true)}>
                  Create Group
                </Button>
              </h2>
            }
          />
        </div>
      </div>

      <PermissionGroupForm open={openCreate} onClose={() => setOpenCreate(false)} />
    </AuthenticatedLayout>
  )
}
