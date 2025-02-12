import React, { useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router, Link } from '@inertiajs/react'
import { PageProps, TimeStamp } from '@/types'
import { ArrowUpRight, CirclePlus, Plus } from 'lucide-react'
import Tooltip from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'

type TimeTable = {
  id: number
  title: string
  description: string
  time_ago: string
} & TimeStamp

export default function TimeTables({ auth, timeTables }: PageProps & { timeTables: TimeTable[] }) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Time Tables',
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Time Tables" />

      <div className="bg-card border border-border text-foreground sm:rounded-lg">
        <div className="p-6 flex justify-end cursor-pointer">
          <Tooltip title="Add New Table">
            <Link href={route('timetables.create')}>
              <Button size={'sm'}>Create Table</Button>
            </Link>
          </Tooltip>
        </div>
        <div className="pb-10">
          {timeTables.length > 0 ? (
            timeTables.map(timetable => (
              <div key={timetable.id} className="px-6 py-3">
                <div className="bg-white dark:bg-background relative flex flex-col md:flex-row items-center border border-border shadow-md p-4 rounded-md">
                  <div>
                    <div className="flex items-center">
                      <h2
                        onClick={() => router.get(route('timetables.edit', timetable.id))}
                        className="text-lg font-semibold text-card-foreground dark:text-gray-200 cursor-pointer hover:underline"
                      >
                        {timetable.title}
                      </h2>
                      <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {timetable.time_ago}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {timetable.description}
                    </p>
                  </div>
                  <Link
                    href={route('timetables.add.allocations', timetable.id)}
                    className="p-2 ml-auto"
                  >
                    <Tooltip title="Add Allocations">
                      <Button size={'sm'}>Allocations</Button>
                    </Tooltip>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">No time tables found.</p>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
