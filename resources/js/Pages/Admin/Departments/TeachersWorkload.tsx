import { Head, usePage, Link, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect } from 'react'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { GroupAllocationCell } from '../TimeTables/_components/AllocationCell'
import { formatNumberRange, groupAllocationsByDay } from '@/utils/helper'
import { Allocation, Day } from '@/types/database'
import { Download } from 'lucide-react'
import { PermissionEnum } from '@/lib/enums'
import { PermissionWrapper } from '@/Components/AdminWrapper'

// Type definitions updated to match the backend
interface Slot {
  id: number
  name: string
  code: string
  start_time: string
  end_time: string
}

interface Section {
  section_name: string
  semester_name: string
  allocations: Record<number, Allocation[]>
}

interface Teacher {
  id: number
  name: string
  rank: string
  sections: Section[]
}

interface Shift {
  id: number
  name: string
}

export interface WorkloadData {
  department: {
    id: number
    name: string
  }
  teachers: Teacher[]
  slots: Slot[]
  shifts: Shift[]
  currentShift: number
  session: string
}

interface TeacherWorkloadProps {
  auth: any
  workloadData: WorkloadData
}

export default function TeacherWorkload({ auth }: TeacherWorkloadProps) {
  const { props } = usePage<{ workloadData: WorkloadData }>()
  const { workloadData } = props
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: `${workloadData.department.name} - Teachers Workload`,
      backItems: [
        {
          title: 'Departments',
          url: route('departments.index'),
        },
      ],
    })
  }, [setBreadcrumb, workloadData.department.name])

  const handleShiftChange = (shiftId: string) => {
    router.get(
      route('departments.teacher-workload', workloadData.department.id),
      { shift_id: shiftId },
      { preserveState: true }
    )
  }

  // Group sections by teacher
  const groupedData = workloadData.teachers.map(teacher => {
    return {
      teacher: {
        name: teacher.name,
        rank: teacher.rank,
      },
      sections: teacher.sections.map(section => ({
        semester: section.semester_name,
        section: section.section_name,
        allocations: section.allocations,
        credit_hours: Object.values(section.allocations)
          .flat()
          .reduce((acc, allocation) => acc + (allocation?.course?.credit_hours ?? 0), 0),
        per_week_lectures: Object.values(section.allocations).flat().length,
      })),
      total_per_week_lectures: teacher.sections.flatMap(section =>
        Object.values(section.allocations).flat()
      ).length,
    }
  })

  async function handleExport() {
    const { exportTeachersWorkloadToExcel } = await import('@/lib/helpers/ExportJs')
    exportTeachersWorkloadToExcel({ workloadData, groupedData })
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`${workloadData.department.name} - Teachers Workload`} />

      <div className="p-6 space-y-6 text-foreground">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Department of {workloadData.department.name}</h1>
          <h2 className="text-xl">
            Teacher Wise Time Table / Workload (Session {workloadData.session})
            <span className="text-xs ml-2 font-normal">
              Last fetched {new Date().toLocaleDateString()}
            </span>
          </h2>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center gap-2">
          <Select
            defaultValue={workloadData.currentShift.toString()}
            onValueChange={handleShiftChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Shift" />
            </SelectTrigger>
            <SelectContent>
              {workloadData.shifts.map(shift => (
                <SelectItem key={shift.id} value={shift.id.toString()}>
                  {shift.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <PermissionWrapper permission={PermissionEnum.EXPORT_TEACHERS_WORKLOAD}>
            <div className="space-x-2">
              <Button onClick={() => handleExport()} variant="outline">
                <Download className="h-5 w-5 animate-bounce" />
                Export
              </Button>
            </div>
          </PermissionWrapper>
        </div>

        {/* Workload Table */}
        <Card>
          <CardHeader>
            <CardTitle>Teachers Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px] max-w-[180px] overflow-ellipsis">
                      Teacher Name (Rank)
                    </TableHead>
                    <TableHead className="w-[200px]">Semester & Section</TableHead>
                    {workloadData.slots.map(slot => (
                      <TableHead key={slot.id} className="text-center min-w-[250px]">
                        <div className="capitalize">{slot.code}</div>
                        <div className="text-sm text-muted-foreground">
                          {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="min-w-[100px] text-center">#Cr Hrs</TableHead>
                    <TableHead className="min-w-[150px] text-center">Per Week Lectures</TableHead>
                    <TableHead className="min-w-[150px] text-center">
                      Total Per Week Lectures
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedData.length > 0 ? (
                    groupedData.map(teacherGroup =>
                      teacherGroup.sections.map((section, sectionIndex) => (
                        <TableRow
                          key={`${teacherGroup.teacher.name}-${section.semester}-${section.section}`}
                        >
                          {sectionIndex === 0 && (
                            <TableCell
                              className="font-medium align-middle lg:sticky left-0 lg:bg-background z-20"
                              rowSpan={teacherGroup.sections.length}
                            >
                              <div>
                                {teacherGroup.teacher.name}
                                <div className="text-sm text-muted-foreground italic">
                                  ({teacherGroup.teacher.rank})
                                </div>
                              </div>
                            </TableCell>
                          )}
                          <TableCell className="lg:sticky left-[182px] lg:bg-background z-20">
                            {section.semester} ({section.section})
                          </TableCell>
                          {workloadData.slots.map(slot => (
                            <TableCell key={slot.id} className="text-center">
                              {section.allocations[slot.id] &&
                              section.allocations[slot.id].length > 0
                                ? groupAllocationsByDay(section.allocations[slot.id]).map(
                                    allocation => (
                                      <GroupAllocationCell
                                        allocation={allocation}
                                        key={allocation.id}
                                      />
                                    )
                                  )
                                : '-'}
                            </TableCell>
                          ))}
                          <TableCell className="text-center">{section.credit_hours}</TableCell>
                          <TableCell className="text-center">{section.per_week_lectures}</TableCell>
                          {sectionIndex === 0 && (
                            <TableCell
                              className="font-medium text-center bg-background"
                              rowSpan={teacherGroup.sections.length}
                            >
                              {teacherGroup.total_per_week_lectures}
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={workloadData.slots.length + 5}
                        className="h-24 text-center"
                      >
                        No workload data available for this shift
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
