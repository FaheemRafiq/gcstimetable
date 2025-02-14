import { useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps, Shift } from '@/types'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import TimeTableForm from './_components/TimeTableForm'

export default function CreateTimeTable({ auth, shifts }: PageProps<{ shifts: Shift[] }>) {

  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Create Time Table',
      backItems: [
        {
          title: 'Time Tables',
          url: route('timetables.index'),
        },
      ],
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Create Time Table" />
      
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Create Time Table</h1>
          <p className="text-muted-foreground mt-1">
            Create a new time table for scheduling and organization
          </p>
        </div>

        <TimeTableForm
          shifts={shifts}
        />

      </div>
    </AuthenticatedLayout>
  )
}