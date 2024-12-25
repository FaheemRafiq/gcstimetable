import { ColumnDef } from "@tanstack/react-table";
import Tooltip from "@/components/ui/tooltip";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Actions } from "./actions";
import { Shift } from "@/types";
import { IsActiveBadge } from "@/Components/IsActive";

const columns: ColumnDef<Shift>[] = [
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
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "is_active",
        header: "Is Active",
        cell: ({ row }) => {
            const isActive = row.original.is_active === "active";

            return <IsActiveBadge isActive={isActive} />;
        },
    },
    {
        accessorKey: "program_type",
        header: "Program Type",
        cell: ({ row }) => {
            return (
                <Badge variant={"secondary"} className="capitalize">
                    {row.original.program_type}
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
