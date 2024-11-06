import { ColumnDef } from "@tanstack/react-table";
import Tooltip from "@/components/ui/tooltip";
import { Room } from "@/types/database";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { Actions } from "./actions";

const columns: ColumnDef<Room>[] = [
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
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => {
            const capacity = row.original.capacity;

            return (
                <Badge variant={'outline'}>
                    {capacity}
                </Badge>
            );
        }
    },
    {
        accessorKey: "isavailable",
        header: "Is Available",
        cell: ({ row }) => {
            const isAvailable = row.original.isavailable;

            return (
                <Tooltip title={isAvailable ? 'Available' : 'Not Available'}>
                    {isAvailable ? (
                        <Check color="green" />
                    ) : (
                        <X color="red" />
                    )}
                </Tooltip>
            );
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.original.type;

            return (
                <Badge variant={'secondary'} className="capitalize">
                    {type}
                </Badge>
            );
        }
    },
    {
        accessorKey: "",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-center">
                    <Actions row={row.original}/>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
    },
];

export default columns;
