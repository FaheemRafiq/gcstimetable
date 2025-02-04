"use client"

import * as React from "react"
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
} from "@tanstack/react-table"

import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar as DefaultTableToolbar } from "./data-table-toolbar"
import { cn } from "@/lib/utils"
import { Pagination } from "@/components/ui/pagination"
import { Link } from "@inertiajs/react"

interface TablePinningState {
  left: string[]
  right: string[]
}

export interface ServerSidePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  from: number;
  to: number;
  navigationLinks: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  },
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

interface BaseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pinnedColumns?: Partial<TablePinningState>;
  DataTableToolbar?: React.FC<{ table: Table<TData> }>;
}

interface ClientSideDataTableProps<TData, TValue> extends BaseDataTableProps<TData, TValue> {
  pagination?: 'client';
}

interface ServerSideDataTableProps<TData, TValue> extends BaseDataTableProps<TData, TValue>, ServerSidePaginationProps {
  pagination: 'server';
}

type DataTableProps<TData, TValue> = ClientSideDataTableProps<TData, TValue> | ServerSideDataTableProps<TData, TValue>;

export function DataTable<TData, TValue>({
  columns,
  data,
  pinnedColumns,
  DataTableToolbar = DefaultTableToolbar,
  pagination = 'client',
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  from = 0,
  to = 0,
  navigationLinks = { first: '', last: '', prev: null, next: null },
  pageSizeOptions = [10, 20, 30, 40, 50],
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: pinnedColumns?.left ?? [],
    right: pinnedColumns?.right ?? [],
  });

  const getCommonPinningClasses = (column: Column<TData>): object => {
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn =
      isPinned === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn =
      isPinned === 'right' && column.getIsFirstColumn('right')

    return {
      'sticky left-0 z-10 opacity-95': isPinned === 'left',
      'sticky right-0 z-10 opacity-95': isPinned === 'right',
      'shadow-[inset_-4px_0_4px_-4px_gray] border-r border-border': isLastLeftPinnedColumn,
      'shadow-[inset_4px_0_4px_-4px_gray] border-l border-border': isFirstRightPinnedColumn,
      'bg-background': isPinned,
    };
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

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border border-border shadow-md bg-background text-foreground">
        <TableComponent>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(getCommonPinningClasses(header.column))}
                    >
                      <div className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </div>
                      <div
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''
                            }`,
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(getCommonPinningClasses(cell.column))}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected. */}

          {/* Now I'm goind to show the total number of rows */}
          Total<strong className="pl-1">{totalItems}</strong>{" "}
          <span className="text-xs">
            {from && to && `(${from} to ${to})`}
          </span>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">

          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pagination == 'client' ? table.getState().pagination.pageSize : pageSize}`}
              onValueChange={(value) => {
                pagination == 'client' ? table.setPageSize(Number(value)) : onPageSizeChange?.(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize: number) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {pagination == 'client' ? (
              <>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </>
            ) : (
              <>
                Page {currentPage} of{" "}
                {Math.ceil(totalItems / pageSize)}
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {
              pagination == 'client' ? (
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
              ) : (
                <>
                  {/* First Page */}
                  <Link href={navigationLinks.first}>
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                    >
                      <span className="sr-only">Go to first page</span>
                      <ChevronsLeft />
                    </Button>
                  </Link>
                  {/* Previous Page */}
                  <Link href={navigationLinks.prev} disabled={!navigationLinks.prev}>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      disabled={!navigationLinks.prev}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <ChevronLeft />
                    </Button>
                  </Link>
                  {/* Next Page */}
                  <Link href={navigationLinks.next} disabled={!navigationLinks.next}>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      disabled={!navigationLinks.next}
                    >
                      <span className="sr-only">Go to next page</span>
                      <ChevronRight />
                    </Button>
                  </Link>
                  {/* Last Page */}
                  <Link href={navigationLinks.last}>
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                    >
                      <span className="sr-only">Go to last page</span>
                      <ChevronsRight />
                    </Button>
                  </Link>
                </>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
