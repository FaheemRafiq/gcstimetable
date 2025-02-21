import { useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps, Shift, TimeStamp, TimeTable } from '@/types'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import TimeTableForm from './_components/TimeTableForm'

export default function EditTimeTable({
  auth,
  timetable,
  shifts,
}: PageProps<{ timetable: TimeTable; shifts: Shift[] }>) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: timetable.title,
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
      <Head title="Edit | Time Table" />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Edit Time Table</h1>
          <p className="text-muted-foreground mt-1">Edit the details of the time table</p>
        </div>

        <TimeTableForm timetable={timetable} shifts={shifts} />
      </div>
    </AuthenticatedLayout>
  )
}
