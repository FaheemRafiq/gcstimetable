import React from "react";
import { EllipsisVertical, Eye, Trash, Pencil } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Fragment } from "react/jsx-runtime";
import { router } from "@inertiajs/react";
import { Slot } from "@/types/database";
import { EditSlot } from "@/Components/Slots";

export function Actions({ row }: { row: Slot }) {
    const [open, setOpen] = React.useState(false);

    const handleDelete = (row: Slot) => {
        router.delete(route("slots.destroy", row.id), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    function handleChange() {
        setOpen(!open);
    }

    return (
        <Fragment>
            <DropdownMenu open={open} onOpenChange={handleChange}>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                    <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Operations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <EditSlot slot={row} onSuccess={handleChange} />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleDelete(row)}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    );
}
