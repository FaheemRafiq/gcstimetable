import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps, Shift, UserType } from '@/types'
import { DataTable } from '@/Components/Table/DataTable'
import columns from './_components/columns'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { useEffect } from 'react'
import { ShiftForm } from './_components/ShiftForm'

export default function Rooms({ auth, shifts }: PageProps<{ shifts: Shift[] }>) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Shifts',
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Shifts" />
      <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
        <div className="p-6">
          <DataTable
            data={shifts}
            columns={columns}
            inputProps={{
              searchFilter: true,
              filterColumn: 'name',
              pagination: true,
            }}
            create_button={
              <div className="flex justify-end">
                <ShiftForm />
              </div>
            }
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
