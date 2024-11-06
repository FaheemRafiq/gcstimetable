import React, { useState } from "react";
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getPaginationRowModel,
    TableOptions,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableCaption,
} from "@/components/ui/table";

import { DataTableProps, InputProps } from "@/types/data-table";

import { TablePagination } from "./Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DefaultInputProps: InputProps = {
    pagination: true,
    searchFilter: false,
};

export function DataTable<TData, TValue>({
    columns,
    data,
    inputProps,
    caption,
    tableLayout = "auto",
    pageLinks,
    totalCount,
    from,
    to,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0, //initial page index
        pageSize: 10, //default page size
    });

    const TotalRecords: React.FC<{
        paramTotalCount: number | null;
        paramFrom: number | undefined;
        paramTo: number | undefined;
    }> = ({ paramTotalCount, paramFrom, paramTo }) => {
        return (
            <>
                Total<strong className="pl-1">{paramTotalCount}</strong>{" "}
                <span className="text-xs">
                    {paramFrom && paramTo && `(${paramFrom} to ${paramTo})`}
                </span>
            </>
        );
    };

    const finalProps = { ...DefaultInputProps, ...inputProps };

    const reactTable: TableOptions<TData> = {
        data,
        columns,
        defaultColumn: {
            minSize: 60,
            maxSize: 800,
        },
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        state: {
            columnFilters,
        },
    };

    if (finalProps.pagination) {
        reactTable.getPaginationRowModel = getPaginationRowModel();

        reactTable.state = {
            ...reactTable.state,
            pagination,
        };
    }

    const table = useReactTable(reactTable);

    const columnSizeVars = React.useMemo(() => {
        const headers = table.getFlatHeaders();
        const colSizes: { [key: string]: number } = {};

        for (let i = 0; i < headers.length; i++) {
            const header = headers[i]!;
            colSizes[`--header-${header.id}-size`] = header.getSize();
            colSizes[`--col-${header.column.id}-size`] =
                header.column.getSize();
        }

        return colSizes;
    }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

    return (
        <div>
            <div className="flex items-center py-4">
                {finalProps.searchFilter && (
                    <Input
                        placeholder={`Filter ${finalProps.filterColumn} ...`}
                        value={
                            (table
                                .getColumn(finalProps.filterColumn)
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn(finalProps.filterColumn)
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                        autoFocus
                    />
                )}
                <div className="ml-auto self-end dark:text-foreground">
                    <TotalRecords
                        paramTotalCount={
                            finalProps.pagination
                                ? table.getRowCount()
                                : totalCount ?? 0
                        }
                        paramFrom={
                            finalProps.pagination
                                ? pagination.pageIndex * pagination.pageSize + 1
                                : from
                        }
                        paramTo={
                            finalProps.pagination
                                ? Math.min(
                                      (pagination.pageIndex + 1) *
                                          pagination.pageSize,
                                      table.getRowCount()
                                  )
                                : to
                        }
                    />
                </div>
            </div>

            <div className="rounded-md border border-border text-foreground">
                <Table
                    style={{
                        ...(tableLayout === "fixed" && columnSizeVars),
                        tableLayout: tableLayout,
                    }}
                >
                    {caption && <TableCaption>{caption}</TableCaption>}
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                width: `calc(var(--header-${header?.id}-size) * 1px)`,
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                                            }}
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
                </Table>
            </div>

            {finalProps.pagination && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        size={'sm'}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        size={'sm'}
                    >
                        Next
                    </Button>
                </div>
            )}

            {pageLinks && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <TablePagination links={pageLinks} />
                </div>
            )}
        </div>
    );
}
