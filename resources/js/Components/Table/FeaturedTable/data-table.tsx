'use client'

import * as React from 'react'
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  SortingState,
  Table,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { DataTableToolbar as DefaultTableToolbar } from './data-table-toolbar'
import { cn } from '@/lib/utils'
import { Link } from '@inertiajs/react'

interface TablePinningState {
  left: string[]
  right: string[]
}

interface BaseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pinnedColumns?: Partial<TablePinningState>
  DataTableToolbar?: React.FC<{ table: Table<TData> }>
  pageSizeOptions?: number[]
}

interface ClientSideDataTableProps<TData, TValue> extends BaseDataTableProps<TData, TValue> {
  pagination: 'client'
}

interface ServerSideDataTableProps<TData, TValue> extends BaseDataTableProps<TData, TValue> {
  pagination: 'server'
  currentPage: number
  totalItems: number
  pageSize: number
  from: number
  to: number
  navigationLinks: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  onPageSizeChange?: (pageSize: number) => void
}

type DataTableProps<TData, TValue> =
  | ClientSideDataTableProps<TData, TValue>
  | ServerSideDataTableProps<TData, TValue>

export function DataTable<TData, TValue>({
  columns,
  data,
  pinnedColumns,
  DataTableToolbar = DefaultTableToolbar,
  pagination,
  ...props
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: pinnedColumns?.left ?? [],
    right: pinnedColumns?.right ?? [],
  })

  const pageSizeOptions = props.pageSizeOptions ?? [10, 20, 30, 40, 50]

  const getCommonPinningClasses = (column: Column<TData>): object => {
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
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      columnPinning,
    },
    enableRowSelection: true,
    manualPagination: pagination === 'server',
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnPinningChange: setColumnPinning,
  })

  const isServerSide = pagination === 'server'
  const serverProps = isServerSide ? (props as ServerSideDataTableProps<TData, TValue>) : null

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border border-border shadow-md bg-background text-foreground">
        <TableComponent>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(getCommonPinningClasses(header.column))}
                    >
                      <div className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                      <div
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                        }}
                      />
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className={cn(getCommonPinningClasses(cell.column))}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Total
          <strong className="pl-1">
            {isServerSide ? serverProps?.totalItems : table.getFilteredRowModel().rows.length}
          </strong>{' '}
          {isServerSide && serverProps?.from && serverProps?.to && (
            <span className="text-xs">
              ({serverProps.from} to {serverProps.to})
            </span>
          )}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${isServerSide ? serverProps?.pageSize : table.getState().pagination.pageSize}`}
              onValueChange={value => {
                const newSize = Number(value)
                if (isServerSide) {
                  serverProps?.onPageSizeChange?.(newSize)
                } else {
                  table.setPageSize(newSize)
                }
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={
                    isServerSide ? serverProps?.pageSize : table.getState().pagination.pageSize
                  }
                />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {isServerSide ? (
              <>
                Page {serverProps?.currentPage} of{' '}
                {Math.ceil((serverProps?.totalItems ?? 0) / (serverProps?.pageSize ?? 1))}
              </>
            ) : (
              <>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isServerSide ? (
              <>
                <Link href={serverProps?.navigationLinks.first ?? '#'}>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    disabled={!serverProps?.navigationLinks.prev}
                  >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft />
                  </Button>
                </Link>
                <Link href={serverProps?.navigationLinks.prev ?? '#'}>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    disabled={!serverProps?.navigationLinks.prev}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft />
                  </Button>
                </Link>
                <Link href={serverProps?.navigationLinks.next ?? '#'}>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    disabled={!serverProps?.navigationLinks.next}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight />
                  </Button>
                </Link>
                <Link href={serverProps?.navigationLinks.last ?? '#'}>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    disabled={!serverProps?.navigationLinks.next}
                  >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
