import React from "react";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { router } from "@inertiajs/react";
import { Slot } from "@/types/database";
import { EditSlot } from "@/Components/Slots";
import DeleteConfirmationDialog from "../Dialog/DeleteConfirmationDialog";

export function Actions({ row }: { row: Slot }) {
    // Edit State
    const [openEdit, setOpenEdit] = React.useState(false);

    // Delete Action State
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    const handleDelete = (row: Slot) => {
        setDeleting(true);
        router.delete(route("slots.destroy", row.id), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                    <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Operations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={(e) => setOpenEdit(true)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={(e) => setOpenConfirm(true)}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Slot Sheet */}
            <EditSlot
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                slot={row}
            />

            {/* Slot Delete Confirmation */}
            <DeleteConfirmationDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onDelete={() => handleDelete(row)}
                processing={deleting}
                title="Delete Time Slot?"
                message="Once a slot is deleted, it cannot be recovered. Are you sure you want to delete this slot?"
                confirmButtonLabel="Delete Slot"
                cancelButtonLabel="Cancel"
            />
        </>
    );
}
