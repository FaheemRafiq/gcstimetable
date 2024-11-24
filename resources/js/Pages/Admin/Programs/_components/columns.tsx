import { ColumnDef } from "@tanstack/react-table";
import Tooltip from "@/components/ui/tooltip";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Actions } from "./actions";
import { Shift } from "@/types";
import { Program } from "@/types/database";

const columns: ColumnDef<Program>[] = [
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
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => row.original.duration + " Years",
    },
    {
        accessorKey: "type",
        header: "Type"
    },
    {
        accessorKey: "id",
        header: "",
        cell: ({ row }) => {
            return <Actions row={row.original} />;
        },
    },
];

export default columns;
