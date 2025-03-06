import { useState, useEffect, useMemo } from 'react'
import { Head } from '@inertiajs/react'
import { router, Link } from '@inertiajs/react'
import { ArrowUpRight, Calendar, Download, Plus } from 'lucide-react'
import {
  formatDateString,
  formatNumberRange,
  getRomanNumber,
  groupAllocationsByDay,
} from '@/utils/helper'
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
    const filteredAllocations = allocations.filter(
      allocation => allocation.slot_id === slotId && allocation.section_id === sectionId
    )

    return groupAllocationsByDay(filteredAllocations)
  }

  async function handleExport() {
    const { exportTimeTableToExcel } = await import('@/lib/helpers/ExportJs')
    exportTimeTableToExcel({ timetable, sections, allocations })
  }

  const handleCreateAllocation = (slot_id: number, section_id?: number) => {
    const params: any = {
      time_table_id: timetable.id,
      slot_id,
      ...(section_id && { section_id }),
    }
    router.get(route('allocations.create', params))
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
                  {formatDateString(timetable.start_date)} - {formatDateString(timetable.end_date)}
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
            <Button variant="outline" onClick={() => handleExport()}>
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
