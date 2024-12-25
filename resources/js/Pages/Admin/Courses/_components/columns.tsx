import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Actions } from "./actions";
import { Course } from "@/types/database";

const columns: ColumnDef<Course>[] = [
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
        accessorKey: "credit_hours",
        header: "Credit Hours",
    },
    {
        accessorKey: "display_code",
        header: "Display Code",
    },
    {
        accessorKey: "semester_id",
        header: "Semester",
        cell: ({ row }) => {
            return (
                <Badge variant={"secondary"} className="capitalize">
                    {row.original.semester?.name}
                </Badge>
            );
        },
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "is_default",
        header: "Is Default",
        cell: ({ row }) => {
            const isDefault = row.original.is_default === 1;

            return (
                <Badge
                    variant={isDefault ? "success" : "destructive"}
                    className="capitalize"
                >
                    {isDefault ? "Default" : "Not Default"}
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
];

export default columns;
