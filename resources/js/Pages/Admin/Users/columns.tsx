import { ColumnDef } from "@tanstack/react-table";
import { Verified, BadgeInfo, EllipsisVertical } from "lucide-react";
import Tooltip from "@/components/ui/tooltip";
import { UserType } from "@/types";
import { UserActions } from "./actions";

const columns: ColumnDef<UserType>[] = [
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
        accessorKey: "profilePhotoUrl",
        header: "Profile",
        cell: ({ row }) => {
            return (
                <img
                    src={row.original.profilePhotoUrl}
                    alt={row.original.name}
                    className="w-10 h-10 rounded-full"
                />
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "verifiedAt",
        header: "Email Verified",
        cell: ({ row }) => {
            const isVerified = row.original.verifiedAt;

            return (
                <Tooltip
                    title={
                        "Email " + (isVerified ? "Verified!" : "Not-Verifed!")
                    }
                >
                    {isVerified ? (
                        <Verified color="green" />
                    ) : (
                        <BadgeInfo color="red" />
                    )}
                </Tooltip>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Registration Date",
    },
    {
        accessorKey: "",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-center">
                    <UserActions row={row.original}/>
                </div>
            );
        },
    },
];

export default columns;
