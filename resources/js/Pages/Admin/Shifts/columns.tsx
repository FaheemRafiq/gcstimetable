import { ColumnDef } from "@tanstack/react-table";
import Tooltip from "@/components/ui/tooltip";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Actions } from "./actions";
import { Shift } from "@/types";

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
        accessorKey: "is_active",
        header: "Type",
        cell: ({ row }) => {
            const isActive = row.original.is_active === "active";

            return (
                <Tooltip title={isActive ? "Active" : "Not Active"}>
                    {isActive ? <Check color="green" /> : <X color="red" />}
                </Tooltip>
            );
        },
    },
    {
        accessorKey: "program_type",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <Badge variant={"secondary"} className="capitalize">
                    {row.original.program_type}
                </Badge>
            );
        },
    },
];

export default columns;
