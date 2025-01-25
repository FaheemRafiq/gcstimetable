import { useState } from "react";
import { EllipsisVertical, Eye, Trash, User as UserIcon } from "lucide-react";
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
import { useForm } from "@inertiajs/react";
import { UserType, Role } from "@/types";
import ViewUserModal from "./_components/ViewUserModal";
import DeleteConfirmationDialog from "@/Components/Dialog/DeleteConfirmationDialog";

export function UserActions({ row }: { row: UserType }) {
    const [ShowView, setShowView] = useState(false);
    const { delete: destroy } = useForm();

    // Delete Action State
    const [openConfirm, setOpenConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);


    const handleDelete = (row: UserType) => {
        setDeleting(true);
        destroy(route("users.destroy", row.id), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setDeleting(false);
                setOpenConfirm(false);
            },
        });
    };

    // Modals Methods

    const handleCloseView = () => {
        setShowView(false);
    };

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
                            onClick={() => setShowView(true)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setOpenConfirm(true)}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Modals */}
            <ViewUserModal
                show={ShowView}
                handleClose={handleCloseView}
                row={row}
            />

            {/* Shift Delete Confirmation */}
            <DeleteConfirmationDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onDelete={() => handleDelete(row)}
                title="Delete User?"
                message={<span>
                    Once a user is deleted, it cannot be recovered. Are you sure you want to delete this user <strong>{row.email}</strong>?
                </span>}
                confirmButtonLabel="Delete"
                cancelButtonLabel="Cancel"
                processing={deleting}
            />
        </Fragment>
    );
}