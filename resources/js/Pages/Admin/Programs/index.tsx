import { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'

// Types
import { PageProps } from '@/types'
import { Program } from '@/types/database'

// Components
import { DataTable } from '@/Components/Table/DataTable'
import columns from './_components/columns'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { Button } from '@/components/ui/button'
import { ProgramForm } from './_components/ProgramForm'

export default function Rooms({ auth, programs }: PageProps<{ programs: Program[] }>) {
  // state
  const [openCreate, setOpenCreate] = useState(false)

  // Constants
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Programs',
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Programs" />
      <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
        <div className="p-6">
          <DataTable
            data={programs}
            columns={columns}
            inputProps={{
              searchFilter: true,
              filterColumn: 'name',
              pagination: true,
            }}
            create_button={
              <h2 className="flex justify-end">
                <Button size={'sm'} onClick={() => setOpenCreate(true)}>
                  Create Program
                </Button>
              </h2>
            }
          />
        </div>
      </div>

      <ProgramForm open={openCreate} onClose={() => setOpenCreate(false)} />
    </AuthenticatedLayout>
  )
}
