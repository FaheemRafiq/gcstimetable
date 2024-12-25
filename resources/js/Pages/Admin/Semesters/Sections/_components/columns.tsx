import { ColumnDef } from "@tanstack/react-table";
import { Actions } from "./actions";
import { Section } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { IsActiveBadge } from "@/Components/IsActive";

const columns: ColumnDef<Section>[] = [
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
        header: "Is Active",
        cell: ({ row }) => {
            const isActive = row.original.is_active === "active";

            return <IsActiveBadge isActive={isActive} />;
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
        accessorKey: "created_at",
        header: "Created At",
    },
    {
        accessorKey: "updated_at",
        header: "Updated At",
    },
];

export default columns;
