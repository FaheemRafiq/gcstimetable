import { User as UserIcon, Shield } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserType, Role, Permission } from "@/types";
import { cn } from "@/lib/utils";

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
        <Dialog open={show} onOpenChange={handleClose}>
            <DialogContent className="max-w-xl w-full rounded-lg p-6 dark:bg-background">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-foreground flex items-center gap-2">
                        <Shield className="w-5 h-5" /> User Details
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                        Comprehensive view of user information, roles, and permissions
                    </DialogDescription>
                </DialogHeader>

                {/* User Profile Section */}
                <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage
                            src={row.profilePhotoUrl}
                            alt={row.name}
                            className={cn("h-full w-full rounded-full object-cover")}
                        />
                        <AvatarFallback className="dark:bg-gray-600">
                            <UserIcon size={28} />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground capitalize">
                            {row.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {row.email}
                        </p>
                    </div>
                </div>

                <Separator className="my-4" />

                <ScrollArea className="h-[400px] pr-4">
                    {/* Basic Information */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Primary Role:</span>
                            <Badge variant="outline" className="capitalize text-gray-900 dark:text-foreground dark:border-gray-500">
                                {row.label}
                            </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Verified At:</span>
                            <span className="text-gray-900 dark:text-foreground">
                                {row.verifiedAt || 'Not Verified'}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Created At:</span>
                            <span className="text-gray-900 dark:text-foreground">
                                {row.createdAt}
                            </span>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Roles Section */}
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            Assigned Roles
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {row.roles.map((role: Role) => (
                                <Badge 
                                    key={role.id} 
                                    variant="secondary" 
                                    className="capitalize"
                                >
                                    {role.name}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Permissions Section */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            Assigned Permissions
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {row.permissions.map((permission: Permission) => (
                                <Badge 
                                    key={permission.id} 
                                    variant="outline" 
                                    className="text-xs justify-start truncate"
                                >
                                    {permission.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </ScrollArea>

                <div className="mt-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={handleClose}>Close</Button>
                    <Button>Edit Profile</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ViewUserModal;