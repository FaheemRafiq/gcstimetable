import React, { useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router, Link } from '@inertiajs/react'
import { PageProps, TimeStamp, TimeTable } from '@/types'
import { ArrowUpRight, Calendar, Clock, Users, Plus, ChevronRight } from 'lucide-react'
import Tooltip from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type NewTimeTable = TimeTable & {
  time_ago: string
} & TimeStamp

export default function TimeTables({
  auth,
  timeTables,
}: PageProps & { timeTables: NewTimeTable[] }) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Time Tables',
    })
  }, [setBreadcrumb])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Time Tables" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-muted-foreground mt-1">Manage and organize your scheduling tables</p>
          </div>
          <Link href={route('timetables.create')}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Table
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {timeTables.length > 0 ? (
            timeTables.map(timetable => (
              <Card
                key={timetable.id}
                className="group hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2
                          onClick={() => router.get(route('timetables.edit', timetable.id))}
                          className="text-xl font-semibold hover:text-primary cursor-pointer"
                        >
                          {timetable.title}
                        </h2>
                        <Badge variant="secondary" className="text-xs">
                          {timetable.shift?.name || 'No Shift'}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-4">{timetable.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(timetable.start_date)} - {formatDate(timetable.end_date)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{timetable.time_ago}</span>
                        </div>

                        {timetable.allocations && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{timetable.allocations.length} Allocations</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Tooltip title="Edit Table">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.get(route('timetables.edit', timetable.id))}
                        >
                          Edit
                        </Button>
                      </Tooltip>

                      <Tooltip title="Manage Allocations">
                        <Link href={route('timetables.add.allocations', timetable.id)}>
                          <Button className="flex items-center gap-2">
                            Allocations
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="py-12">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Time Tables</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first time table
                </p>
                <Link href={route('timetables.create')}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Time Table
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
