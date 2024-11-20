import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Actions } from "./actions";
import { Slot } from "@/types/database";

const columns: ColumnDef<Slot>[] = [
    {
        accessorKey: "index",
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "code",
        header: "Code",
    },
    {
        accessorKey: "start_time",
        header: "Start Time",
        cell: ({ row }) => {
            return (
                <Badge variant={"secondary"} className="capitalize">
                    {row.original.start_time}
                </Badge>
            );
        },
    },
    {
        accessorKey: "end_time",
        header: "End Time",
        cell: ({ row }) => {
            return (
                <Badge variant={"secondary"} className="capitalize">
                    {row.original.end_time}
                </Badge>
            );
        },
    },
    {
        accessorKey: "id",
        header: "Actions",
        cell: ({ row }) => {
            return <Actions row={row.original} />;
        },
    },
    {
        accessorKey: "is_practical",
        header: "Practical",
        cell: ({ row }) => {
            const isPractical = row.original.is_practical === 1;

            return (
                <>
                    {isPractical ? (
                        <Badge variant={"successOutline"}>Yes</Badge>
                    ) : (
                        <Badge variant={"destructiveOutline"}>No</Badge>
                    )}
                </>
            );
        },
    },
];

export default columns;
