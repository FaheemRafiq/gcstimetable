import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/Components/Table/FeaturedTable"

import { DataTableFacetedFilter } from "@/Components/Table/FeaturedTable"
import { router } from "@inertiajs/react"
import useTeacherStore from "@/store/Admin/useTeacherStore"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function TeacherToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const ranks = useTeacherStore((state) => state.ranks);
    const isFiltered = table.getState().columnFilters.length > 0;

    function handleAddNew() {
        router.get(route('teachers.create'));
    }

    // convert key => value into { label: key, value: value }
    function getOptions(obj: { [key: string]: string }) {
        return Object.keys(obj).map((key) => ({
            label: obj[key],
            value: key,
        }));
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter by name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="w-[250px] lg:w-[350px] md:shadow-md"
                />
                {table.getColumn("rank") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("rank")}
                        title="Ranks"
                        options={getOptions(ranks)}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
            {/* Create a new Button here */}
            <div className="ml-4">
                <Button
                    variant="default"
                    className="h-8 px-2 lg:px-3"
                    onClick={() => handleAddNew()}
                >
                    Create New
                </Button>
            </div>
        </div>
    )
}
