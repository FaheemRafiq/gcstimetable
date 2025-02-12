import { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'

// Types
import { PageProps } from '@/types'
import { Institution, Program } from '@/types/database'

// Components
import { DataTable } from '@/Components/Table/DataTable'
import columns from './_components/columns'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { Button } from '@/components/ui/button'
import { InstituionForm } from './_components/InstitutionForm'

export default function Rooms({ auth, institutions }: PageProps<{ institutions: Institution[] }>) {
  // state
  const [openCreate, setOpenCreate] = useState(false)

  // Constants
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Institutions',
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Institutions" />
      <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
        <div className="p-6">
          <DataTable
            data={institutions}
            columns={columns}
            inputProps={{
              searchFilter: true,
              filterColumn: 'name',
              pagination: true,
            }}
            create_button={
              <h2 className="flex justify-end">
                <Button size={'sm'} onClick={() => setOpenCreate(true)}>
                  Create Institution
                </Button>
              </h2>
            }
          />
        </div>
      </div>

      <InstituionForm open={openCreate} onClose={() => setOpenCreate(false)} />
    </AuthenticatedLayout>
  )
}
