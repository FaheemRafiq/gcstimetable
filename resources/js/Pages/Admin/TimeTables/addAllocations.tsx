import { useState, useEffect, useMemo } from 'react'
import { Head } from '@inertiajs/react'
import { router, Link } from '@inertiajs/react'
import { ArrowUpRight, Calendar, Download, Plus } from 'lucide-react'
import { formatNumberRange, getRomanNumber, groupAllocationsByDay } from '@/utils/helper'
import { PageProps, TimeTable } from '@/types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AllocationCell, GroupAllocationCell } from './_components/AllocationCell'
import { Allocation, Day, Section } from '@/types/database'
import {
  Column,
  ColumnPinningState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { random } from 'lodash'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import * as ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export default function TimeTableView({
  auth,
  timetable,
  sections,
}: PageProps<{ timetable: TimeTable; sections: Section[] }>) {
  const { setBreadcrumb } = useBreadcrumb()
  const isMobile = useIsMobile()

  // state
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: [],
    right: [],
  })

  useEffect(() => {
    if (isMobile) {
      setColumnPinning({
        left: [],
        right: [],
      })
    } else {
      setColumnPinning({
        left: ['section'],
        right: [],
      })
    }
  }, [isMobile])

  useEffect(() => {
    setBreadcrumb({
      title: timetable?.title ?? 'Add Allocations',
      backItems: [
        {
          title: 'Time Tables',
          url: route('timetables.index'),
        },
      ],
    })
  }, [timetable])

  useEffect(() => {
    if (timetable?.allocations?.length) {
      setAllocations(timetable.allocations)
    }
  }, [timetable])

  const getAllocations = (slotId: number, sectionId: number) => {
    let filteredAllocations = allocations
      .filter(allocation => allocation.slot_id === slotId && allocation.section_id === sectionId)
      .sort((a, b) => Number(a.day?.number) - Number(b.day?.number))

    return groupAllocationsByDay(filteredAllocations)
  }

  const handleCreateAllocation = (slot_id: number, section_id?: number) => {
    const params: any = {
      time_table_id: timetable.id,
      slot_id,
      ...(section_id && { section_id }),
    }
    router.get(route('allocations.create', params))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const columnHelper = createColumnHelper<any>()

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor('section', {
        header: 'Section',
        size: 200,

        cell: ({ row }) => (
          <div className="p-4 font-medium text-center">
            {row.original?.semester?.name} ({row.original?.name})
          </div>
        ),
      }),
    ]

    // Add slot columns dynamically
    const slotColumns =
      timetable.shift?.slots?.map((slot, index) =>
        columnHelper.accessor(`slot_${slot.id}`, {
          header: () => (
            <div className="space-y-2">
              <div className="font-medium text-center">{getRomanNumber(index + 1)}</div>
              <div className="text-sm text-muted-foreground text-center">{slot.name}</div>
            </div>
          ),
          size: 250,

          cell: ({ row }) => {
            const allocs = getAllocations(slot.id, row.original?.id)
            return (
              <div className="min-h-[120px] hover:bg-accent/50 transition-colors p-2">
                {allocs.length > 0 ? (
                  <div
                    className="h-full w-full cursor-pointer"
                    onClick={() => handleCreateAllocation(slot.id, row.original?.id)}
                  >
                    {allocs.map(alloc => {
                      return <GroupAllocationCell key={alloc.id} allocation={alloc} />
                    })}
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCreateAllocation(slot.id, row.original?.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add Allocation</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            )
          },
        })
      ) || []

    return [...baseColumns, ...slotColumns]
  }, [timetable.shift?.slots, random(1, 1000)])

  const getCommonPinningClasses = (column: Column<any>): object => {
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

    return {
      'sticky left-0 z-10 opacity-95': isPinned === 'left',
      'sticky right-0 z-10 opacity-95': isPinned === 'right',
      'shadow-[inset_-4px_0_4px_-4px_gray] border-r border-border': isLastLeftPinnedColumn,
      'shadow-[inset_4px_0_4px_-4px_gray] border-l border-border': isFirstRightPinnedColumn,
      'bg-background': isPinned,
    }
  }

  const table = useReactTable({
    data: sections,
    columns,
    state: {
      columnPinning,
    },
    enablePinning: true,
    enableRowPinning: true,
    getCoreRowModel: getCoreRowModel(),
    onColumnPinningChange: setColumnPinning,
  })

  const exportTimeTableToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Timetable')

    // Set default styles for the worksheet
    worksheet.properties.defaultRowHeight = 20

    // Define reusable styles
    const centerAlign: Partial<ExcelJS.Alignment> = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    }
    const headerStyle = {
      font: { bold: true, size: 12, color: { argb: '000000' } },
      alignment: centerAlign,
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E9ECEF' },
      },
      border: {
        top: { style: 'thin', color: { argb: 'D1D5DB' } },
        left: { style: 'thin', color: { argb: 'D1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
        right: { style: 'thin', color: { argb: 'D1D5DB' } },
      },
    }

    // Title Section
    const titleSection = [
      [''],
      [`${timetable.title} - ${timetable.shift?.name}`],
      [timetable.description],
      [`Period: ${formatDate(timetable.start_date)} - ${formatDate(timetable.end_date)}`],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [''],
    ]

    titleSection.forEach((row, index) => {
      const excelRow = worksheet.addRow(row)
      if (row[0]) {
        worksheet.mergeCells(
          `A${index + 1}:${String.fromCharCode(65 + (timetable.shift?.slots?.length || 0))}${index + 1}`
        )
        excelRow.getCell(1).alignment = centerAlign
        if (index === 1) {
          excelRow.font = { bold: true, size: 14 }
        } else {
          excelRow.font = { size: 11 }
        }
      }
    })

    // Add table headers
    const headers = [
      'Section',
      ...(timetable.shift?.slots?.map(
        (slot, index) => `${getRomanNumber(index + 1)}\n${slot.name}`
      ) || []),
    ]

    const headerRow = worksheet.addRow(headers)
    headerRow.height = 40 // Taller header row for wrapped text
    headers.forEach((header, i) => {
      const cell = headerRow.getCell(i + 1)
      Object.assign(cell, headerStyle)
    })

    // Set column widths
    worksheet.getColumn('A').width = 30 // Section column

    // Set slot columns width
    timetable.shift?.slots?.forEach((_, index) => {
      worksheet.getColumn(String.fromCharCode(66 + index)).width = 35
    })

    // Calculate dynamic row height based on content
    const calculateRowHeight = (allocations: any[]) => {
      if (allocations.length === 0) return 60 // Default height for empty cells

      // Base height per allocation (accounts for the content and spacing)
      const baseHeightPerAllocation = 20

      // Additional height for padding and separation between allocations
      const padding = 20

      // Calculate total height needed
      const totalHeight = allocations.length * baseHeightPerAllocation + padding

      // Set minimum and maximum heights
      return Math.max(60, Math.min(300, totalHeight))
    }

    // Add data rows
    sections.forEach(section => {
      let maxAllocations = 1 // Track maximum allocations for this row

      const rowData = [
        `${section.semester?.name} (${section.name})`,
        ...(timetable.shift?.slots?.map(slot => {
          const allocs = getAllocations(slot.id, section.id)
          maxAllocations = Math.max(maxAllocations, allocs.length || 1)

          if (allocs.length === 0) return '-'

          return allocs
            .map(allocation => {
              const dayNumbers = allocation.days?.map((day: Day) => day.number) || []
              const formattedDays = formatNumberRange(dayNumbers)

              return [
                allocation.course?.display_code +
                  ', ' +
                  allocation.teacher?.name +
                  ', ' +
                  allocation.room?.name +
                  ' ' +
                  `(${formattedDays})`,
              ]
                .filter(Boolean)
                .join('\n')
            })
            .join('\n\n')
        }) || []),
      ]

      const row = worksheet.addRow(rowData)

      // Set dynamic row height based on maximum allocations in this row
      row.height = calculateRowHeight(new Array(maxAllocations))

      // Apply cell styles
      row.eachCell((cell, colNumber) => {
        cell.alignment = centerAlign
        cell.border = {
          top: { style: 'thin', color: { argb: 'D1D5DB' } },
          left: { style: 'thin', color: { argb: 'D1D5DB' } },
          bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
          right: { style: 'thin', color: { argb: 'D1D5DB' } },
        }
      })
    })

    // Final formatting
    worksheet.views = [
      { state: 'frozen', xSplit: 1, ySplit: 7 }, // Freeze header row and first column
    ]

    // Generate and download the Excel file
    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), `${timetable.title}_${formatDate(timetable.start_date)}.xlsx`)
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Timetable View" />

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center flex-1">
              <div className="flex gap-4 justify-center items-center">
                <h2 className="text-2xl font-bold">{timetable.title}</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="secondary">{timetable.shift?.name}</Badge>
                    </TooltipTrigger>
                    <TooltipContent>Shift</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {timetable.description}
                <div className="mt-1 text-xs font-medium">
                  {formatDate(timetable.start_date)} - {formatDate(timetable.end_date)}
                </div>
              </p>
            </div>
            <Link href={route('timetables.edit', timetable.id)}>
              <Button variant="ghost" size="icon">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mb-2 flex justify-end">
            <Button variant="outline" onClick={exportTimeTableToExcel}>
              <Download className="h-5 w-5 animate-bounce" />
              Export
            </Button>
          </div>
          <div className="rounded-md border">
            <div className={cn('overflow-x-auto', { 'max-h-[75vh]': !isMobile })}>
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-background border-b">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className={cn('border-r p-4', getCommonPinningClasses(header.column))}
                          style={{
                            width: header.getSize(),
                            minWidth: header.getSize(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="border-b">
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className={cn('border-r', getCommonPinningClasses(cell.column))}
                          style={{
                            width: cell.column.getSize(),
                            minWidth: cell.column.getSize(),
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Empty Row for Additional Allocations */}
                  <tr className="border-b">
                    <td className="border-r p-4"></td>
                    {timetable.shift?.slots?.map(slot => (
                      <td key={slot.id} className="border-r" style={{ width: 250, minWidth: 250 }}>
                        <div className="min-h-[120px] flex items-center justify-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCreateAllocation(slot.id)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Add Allocation</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  )
}
