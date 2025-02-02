import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/types";
import { Link, router } from "@inertiajs/react";

export function NavUser({ user }: { user: User }) {
    const { isMobile } = useSidebar();

    function handleLogout() {
        router.post(
            route("logout"),
            {},
            {
                onSuccess: () => {
                    localStorage.clear();
                },
            }
        );
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={user.profilePhotoUrl}
                                    alt={user.name}
                                />
                                <AvatarFallback className="rounded-lg uppercase text-muted-foreground dark:border dark:border-muted-foreground">
                                    {user.label.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-sidebar text-sidebar-foreground"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <Link
                                className="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                                href="/profile"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={user.profilePhotoUrl}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        CN
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </Link>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-sidebar dark:bg-muted" />
                        <DropdownMenuGroup>
                            <DropdownMenuItem disabled>
                                <Sparkles size={16} className="mr-2" />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-sidebar dark:bg-muted" />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck size={16} className="mr-2" />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Bell size={16} className="mr-2" />
                                Notifications (coming soon)
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-sidebar dark:bg-muted" />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut size={16} className="mr-2" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
