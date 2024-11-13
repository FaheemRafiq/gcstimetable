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
import Modal from "@/Components/Modal";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, router, useForm } from "@inertiajs/react";
import { UserType, Role } from "@/types";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function UserActions({ row }: { row: UserType }) {
    const [ShowView, setShowView] = useState(false);
    const { delete: destroy } = useForm();

    const handleDelete = (row: UserType) => {
        destroy(route("users.destroy", row.id), {
            preserveScroll: true,
            preserveState: true,
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
                <DropdownMenuContent className="w-56">
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
                            onClick={() => handleDelete(row)}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Modals */}
            <ViewUser show={ShowView} handleClose={handleCloseView} row={row} />
        </Fragment>
    );
}

export function ViewUser({
    show,
    handleClose,
    row,
}: {
    show: boolean;
    row: UserType;
    handleClose: () => void;
}) {
    return (
        <Modal
            show={show}
            onClose={handleClose}
            maxWidth="md"
            className="!w-full"
        >
            <Card className="w-full max-w-md bg-white shadow-md rounded-lg dark:bg-background">
                <CardHeader className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage
                            src={row.profilePhotoUrl}
                            alt={row.name}
                            className={cn({
                                "h-12 w-12 rounded-full": !row.profilePhotoUrl,
                            })}
                        />
                        <AvatarFallback className="dark:bg-gray-600">
                            <UserIcon />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-gray-900 dark:text-foreground text-center capitalize">
                            {row.name}
                        </CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                            {row.email}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="mt-4">
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Role:
                            </span>
                            <Badge
                                variant="outline"
                                className="capitalize text-gray-900 dark:text-foreground dark:border-gray-500"
                            >
                                {row.label}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Verified At:
                            </span>
                            <span className="text-sm text-gray-900 dark:text-foreground">
                                {row.verifiedAt}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Created At:
                            </span>
                            <span className="text-sm text-gray-900 dark:text-foreground">
                                {row.createdAt}
                            </span>
                        </div>
                    </div>

                    {/* Display roles */}
                    <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Roles:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                            {row.roles.map((role: Role) => (
                                <li
                                    key={role.id}
                                    className="text-sm text-card-foreground dark:text-gray-200"
                                >
                                    {role.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>

                <CardFooter className="mt-4 flex justify-end gap-3">
                    <Button variant={"outline"} onClick={handleClose}>
                        Close
                    </Button>
                    <Button>Edit Profile</Button>
                </CardFooter>
            </Card>
        </Modal>
    );
}
