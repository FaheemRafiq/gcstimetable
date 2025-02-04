import { useState } from "react";
import {
    EllipsisVertical,
    Eye,
    Pencil,
    Trash,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Fragment } from "react/jsx-runtime";
import { Link, router, useForm } from "@inertiajs/react";
import DeleteConfirmationDialog from "@/Components/Dialog/DeleteConfirmationDialog";
import { RoleForm } from "./RoleForm";
import { Role } from "@/types";

export function Actions({ row }: { row: Role }) {
    // Edit state
    const [openEdit, setOpenEdit] = useState(false);

    // Delete state
    const [openDelete, setOpenDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = (row: Role) => {
        setDeleting(true);
        router.delete(route("roles.destroy", row.id), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setDeleting(false);
            },
            onSuccess: () => {
                setOpenDelete(false);
            },
        });
    };

    function handleView(row: Role) {
        router.get(route("roles.show", row.id));
    }

    return (
        <Fragment>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                    <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Operations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleView(row)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setOpenEdit(true)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setOpenDelete(true)}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Program */}

            {openEdit && (
                <RoleForm
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    role={row}
                />
            )}

            {/* Delete Confirmation */}
            <DeleteConfirmationDialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                onDelete={() => handleDelete(row)}
                title="Delete Role"
                message={
                    <p>
                        Are you sure you want to delete this <strong>{row.name}</strong> role? This action cannot be undone.
                    </p>
                }
                processing={deleting}
            />
        </Fragment>
    );
}
