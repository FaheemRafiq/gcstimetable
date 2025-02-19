import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps } from '@/types'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { useEffect } from 'react'
import { Allocation, Day, Teacher } from '@/types/database'
import { Calendar, Clock, Book, MapPin, User, GraduationCap, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface TeachersWorkloadProps extends Record<string, unknown> {
  teacher: Teacher;
  days: Day[];
  allocations: Allocation[];
}

export default function TeachersWorkload({
  auth,
  teacher,
  days,
  allocations,
}: PageProps<TeachersWorkloadProps>) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Teacher Workload',
      backItems: [{ title: 'Teachers', url: route('teachers.index') }],
    })
  }, [setBreadcrumb])

  const getAllocationsByDay = (dayId: number) => {
    return allocations.filter((a) => a.day_id === dayId);
  };

  const sortByStartTime = (a: Allocation, b: Allocation) => {
    return a.slot?.start_time.localeCompare(b.slot?.start_time || '') || 0;
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Teacher's Workload" />

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">{teacher.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Teacher Workload Schedule</p>
              </div>

              <div className="ml-auto">
                <div className="flex items-center gap-2">
                  <Badge className="text-sm font-medium">
                    {allocations.length} {allocations.length === 1 ? 'class' : 'classes'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <Accordion type="multiple" className="space-y-4">
            {days.map((day) => {
              const dayAllocations = getAllocationsByDay(day.id).sort(sortByStartTime);
              const totalClasses = dayAllocations.length;
              
              return (
                <Card key={day.id}>
                  <AccordionItem value={day.id.toString()} className="border-none">
                    <AccordionTrigger className="px-6">
                      <div className="flex items-center gap-4">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">{day.name}</span>
                          <Badge variant={totalClasses ? "default" : "secondary"}>
                            {totalClasses} {totalClasses === 1 ? 'class' : 'classes'}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent>
                      <CardContent>
                        {dayAllocations.length === 0 ? (
                          <div className="py-4 text-center text-muted-foreground">
                            No classes scheduled for this day
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {dayAllocations.map((allocation, index) => (
                              <div key={allocation.id}>
                                {index > 0 && <Separator className="my-4" />}
                                <div className="flex items-center gap-6 flex-wrap">
                                  {/* Room */}
                                  {allocation.room && (
                                    <div className="flex items-center gap-2 min-w-[150px]">
                                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                                      <span className="text-sm font-medium">{allocation.room.name}</span>
                                    </div>
                                  )}
                                  
                                  {/* Section/Semester */}
                                  {allocation.section && (
                                    <div className="flex items-center gap-2 min-w-[150px]">
                                      <Users className="h-4 w-4 text-primary shrink-0" />
                                      <span className="text-sm font-medium">
                                        {allocation.section?.semester?.name} - ({allocation.section?.name})
                                      </span>
                                    </div>
                                  )}
                                  
                                  {/* Course */}
                                  {allocation.course && (
                                    <div className="flex items-center gap-2 min-w-[200px]">
                                      <Book className="h-4 w-4 text-primary shrink-0" />
                                      <span className="text-sm font-medium">{allocation.course.code}</span>
                                    </div>
                                  )}
                                  
                                  {/* Time */}
                                  <div className="flex items-center gap-2 ml-auto">
                                    <Clock className="h-4 w-4 text-primary shrink-0" />
                                    <span className="text-sm font-medium whitespace-nowrap">
                                      {allocation.slot?.start_time} - {allocation.slot?.end_time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              );
            })}
          </Accordion>
        </ScrollArea>
      </div>
    </AuthenticatedLayout>
  )
}