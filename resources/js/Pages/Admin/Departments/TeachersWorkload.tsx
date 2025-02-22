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
import * as ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
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

interface WorkloadData {
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
        rank: teacher.rank
      },
      sections: teacher.sections.map(section => ({
        semester: section.semester_name,
        section: section.section_name,
        allocations: section.allocations,
        credit_hours: Object.values(section.allocations).flat().reduce((acc, allocation) => acc + (allocation?.course?.credit_hours ?? 0), 0),
        per_week_lectures: Object.values(section.allocations).flat().length
      })),
      total_per_week_lectures: teacher.sections
        .flatMap(section => Object.values(section.allocations).flat())
        .length
    }
  })

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('TeacherWorkload');

    // Set default styles for the worksheet
    worksheet.properties.defaultRowHeight = 20;

    // Define reusable styles
    const centerAlign: Partial<ExcelJS.Alignment> = { horizontal: 'center', vertical: 'middle', wrapText: true };
    const headerStyle = {
      font: { bold: true, size: 12, color: { argb: '000000' } },
      alignment: centerAlign,
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E9ECEF' }
      },
      border: {
        top: { style: 'thin', color: { argb: 'D1D5DB' } },
        left: { style: 'thin', color: { argb: 'D1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
        right: { style: 'thin', color: { argb: 'D1D5DB' } }
      }
    };

    // Title Section with better formatting
    const titleSection = [
      [''],
      [`Teachers Workload Report - ${workloadData.department.name}`],
      [`Session: ${workloadData.session}`],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      ['']
    ];

    titleSection.forEach((row, index) => {
      const excelRow = worksheet.addRow(row);
      if (row[0]) {
        worksheet.mergeCells(`A${index + 1}:K${index + 1}`);
        excelRow.getCell(1).alignment = centerAlign;
        if (index === 1) {
          excelRow.font = { bold: true, size: 14 };
        } else {
          excelRow.font = { size: 11 };
        }
      }
    });

    // Add table headers
    const headers = [
      'Teacher Name (Rank)',
      'Semester & Section',
      ...workloadData.slots.map(slot =>
        `${slot.code}\n${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`
      ),
      'Credit Hours',
      'Per Week Lectures',
      'Total Lectures'
    ];

    const headerRow = worksheet.addRow(headers);
    headerRow.height = 40; // Taller header row for wrapped text
    headers.forEach((header, i) => {
      const cell = headerRow.getCell(i + 1);
      Object.assign(cell, headerStyle);
    });

    // Set column widths
    const columnWidths = {
      'A': 30, // Teacher Name
      'B': 25, // Semester & Section
      'K': 15, // Credit Hours
      'L': 15, // Per Week Lectures
      'M': 15  // Total Lectures
    };

    // Set slot columns width (columns C to J)
    for (let i = 0; i < workloadData.slots.length; i++) {
      (columnWidths as Record<string, number>)[String.fromCharCode(67 + i)] = 35; // Start from 'C'
    }

    Object.entries(columnWidths).forEach(([col, width]) => {
      worksheet.getColumn(col).width = width;
    });

    // Add data rows with improved formatting
    let rowNumber = 7; // Start after headers
    groupedData.forEach((teacherGroup) => {
      const startRow = rowNumber;

      teacherGroup.sections.forEach((section, sectionIndex) => {
        const rowData = [
          sectionIndex === 0 ? `${teacherGroup.teacher.name}\n(${teacherGroup.teacher.rank})` : '',
          `${section.semester}\n(${section.section})`,
          ...workloadData.slots.map(slot => {
            const allocations = section.allocations[slot.id] || [];
            const groupedAllocations = groupAllocationsByDay(
              allocations.sort((a, b) => Number(a.day?.number) - Number(b.day?.number))
            );

            return groupedAllocations.map(allocation => {
              const dayNumbers = allocation.days?.map((day: Day) => day.number) || [];
              const formattedDays = formatNumberRange(dayNumbers);
              return [
                allocation.course.display_code,
                allocation.teacher?.name ? `${allocation.teacher.name}` : '',
                `Room: ${allocation.room.name || ''}`,
                `(${formattedDays})`
              ].filter(Boolean).join('\n');
            }).join('\n\n') || '-';
          }),
          section.credit_hours,
          section.per_week_lectures,
          sectionIndex === 0 ? teacherGroup.total_per_week_lectures : ''
        ];

        const row = worksheet.addRow(rowData);
        row.height = 60; // Higher rows for wrapped content

        // Apply cell styles
        row.eachCell((cell, colNumber) => {
          cell.alignment = centerAlign;
          cell.border = {
            top: { style: 'thin', color: { argb: 'D1D5DB' } },
            left: { style: 'thin', color: { argb: 'D1D5DB' } },
            bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
            right: { style: 'thin', color: { argb: 'D1D5DB' } }
          };
        });

        rowNumber++;
      });

      // Merge cells for teacher name and total lectures if multiple sections
      if (teacherGroup.sections.length > 1) {
        worksheet.mergeCells(`A${startRow}:A${rowNumber - 1}`);
        worksheet.mergeCells(`${String.fromCharCode(64 + headers.length)}${startRow}:${String.fromCharCode(64 + headers.length)}${rowNumber - 1}`);
      }

      // Add a subtle separator after each teacher group
      const separatorRow = worksheet.addRow([]);
      separatorRow.height = 3;
      separatorRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F3F4F6' }
      };
      rowNumber++;
    });

    // Final formatting pass
    worksheet.views = [
      { state: 'frozen', xSplit: 2, ySplit: 6 } // Freeze header row and first two columns
    ];

    // Generate and download the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `Teacher_Workload_${workloadData.department.name}_${workloadData.session}.xlsx`
    );
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`${workloadData.department.name} - Teachers Workload`} />

      <div className="p-6 space-y-6 text-foreground">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">
            Department of {workloadData.department.name}
          </h1>
          <h2 className="text-xl">
            Teacher Wise Time Table / Workload (Session {workloadData.session})

            <span className='text-xs ml-2 font-normal'>
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
              <Button onClick={exportToExcel} variant="default">
                <Download className="h-5 w-5" />
                Export to Excel
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
                    <TableHead className="min-w-[180px] max-w-[180px] overflow-ellipsis">Teacher Name (Rank)</TableHead>
                    <TableHead className="w-[200px]">Semester & Section</TableHead>
                    {workloadData.slots.map(slot => (
                      <TableHead key={slot.id} className="text-center min-w-[250px]">
                        <div className='capitalize'>{slot.code}</div>
                        <div className="text-sm text-muted-foreground">
                          {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="min-w-[100px] text-center">#Cr Hrs</TableHead>
                    <TableHead className="min-w-[150px] text-center">Per Week Lectures</TableHead>
                    <TableHead className="min-w-[150px] text-center">Total Per Week Lectures</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedData.length > 0 ? (
                    groupedData.map((teacherGroup) => (
                      teacherGroup.sections.map((section, sectionIndex) => (
                        <TableRow key={`${teacherGroup.teacher.name}-${section.semester}-${section.section}`}>
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
                          <TableCell className='lg:sticky left-[182px] lg:bg-background z-20'>
                            {section.semester} ({section.section})
                          </TableCell>
                          {workloadData.slots.map(slot => (
                            <TableCell key={slot.id} className="text-center">
                              {section.allocations[slot.id] && section.allocations[slot.id].length > 0
                                ? groupAllocationsByDay(section.allocations[slot.id].sort((a, b) => Number(a.day?.number) - Number(b.day?.number))).map(allocation => (
                                  <GroupAllocationCell
                                    allocation={allocation}
                                    key={allocation.id}
                                  />
                                ))
                                : '-'}
                            </TableCell>
                          ))}
                          <TableCell className='text-center'>
                            {section.credit_hours}
                          </TableCell>
                          <TableCell className='text-center'>
                            {section.per_week_lectures}
                          </TableCell>
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
                    ))
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