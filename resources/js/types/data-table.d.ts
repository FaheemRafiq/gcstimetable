import { ColumnDef } from "@tanstack/react-table";
import React from "react";

interface WithSearchFilter {
    pagination?: boolean;
    search?: 'server' | 'client',
    searchFilter: true,
    filterColumn: string,
    onSearch?: (value: string) => void
}

interface WithoutSearchFilter {
    pagination?: boolean,
    searchFilter: false
}

type InputProps = WithoutSearchFilter | WithSearchFilter;

export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    inputProps?: InputProps;
    caption?: string,
    tableLayout?: "fixed" | "auto",
    pageLinks?: PaginationLink[],
    totalCount?: number,
    from?: number,
    to?: number,
    create_button?: React.ReactNode
}

export interface PaginationLink {
    url: string,
    label: string,
    active: boolean
}

// create interface of Laravel Pagination object
export interface LengthAwarePaginator<T> {
    current_page: number,
    data: T[],
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    links: PaginationLink[],
    next_page_url: string,
    path: string,
    per_page: number,
    prev_page_url: string | null,
    to: number,
    total: number
}

export interface ResourcePaginator<T> {
    data: T[],
    links: {
        first: string,
        last: string,
        prev: string | null,
        next: string | null
    },
    meta: {
        current_page: number,
        from: number,
        last_page: number,
        links: PaginationLink[],
        path: string,
        per_page: number,
        to: number,
        total: number
    }
}