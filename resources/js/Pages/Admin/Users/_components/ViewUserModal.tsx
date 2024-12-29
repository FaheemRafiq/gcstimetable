import { useState } from "react";
import { User as UserIcon } from "lucide-react";
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
import { UserType, Role } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function ViewUserModal({
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

export default ViewUserModal;
