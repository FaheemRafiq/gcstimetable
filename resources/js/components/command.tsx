import * as React from "react";
import {
    Settings,
    GraduationCap,
    User,
    ChartNoAxesCombined,
    Users,
    CalendarDays,
    Building,
    LayoutDashboardIcon,
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { NavData, NavDataType, NavItem } from "./app-sidebar";

export function CommandDialogDemo() {
    const [open, setOpen] = React.useState(false);
    const superKey = "CTRL+";

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey) {
                if (e.key === "k") {
                    e.preventDefault();
                    setOpen((open) => !open);
                }

                if (e.key === "p") {
                    handleProfileNavigation(e);
                }
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleProfileNavigation = (e: KeyboardEvent | any) => {
        if (e instanceof KeyboardEvent) {
            e.preventDefault();
        }

        handlePageSelect(route("profile.edit"));
    };

    const handlePageSelect = (routePath: string) => {
        router.get(routePath);

        if (open === true) {
            setOpen(false);
        }
    };

    const resolveSideBarNavs = (item: NavItem, index: number) => {
        let NavItems: React.ReactNode[] = [];
        if (item.items?.length) {
            item.items.forEach((subItem, index) => {
                NavItems.push(
                    <CommandItem
                        key={index + subItem.url}
                        onSelect={() => handlePageSelect(subItem.url)}
                    >
                        <subItem.icon className="mr-2 h-4 w-4" />
                        <span>{subItem.title}</span>
                    </CommandItem>
                );
            });
        }

        if (NavItems.length === 0) {
            return (
                <CommandItem
                    key={index}
                    onSelect={() => handlePageSelect(item.url)}
                >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                </CommandItem>
            );
        }

        NavItems.push(
            <CommandItem
                key={index}
                onSelect={() => handlePageSelect(item.url)}
            >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
            </CommandItem>
        );

        return NavItems;
    };

    return (
        <>
            <Button
                onClick={() => setOpen(!open)}
                variant="ghost"
                size="sm"
                className="h-7 px-2 flex items-center"
            >
                <p className="text-sm text-muted-foreground">
                    Press{" "}
                    <kbd className="pointer-events-none inline-flex h-5 bg-muted border rounded-sm select-none items-center px-1.5 font-mono text-[10px] font-medium opacity-100">
                        <span className="text-xs">{superKey}</span>k
                    </kbd>
                </p>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    className="border-transparent focus:border-transparent focus:ring-transparent"
                    placeholder="Type a command or search..."
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Pages">
                        {NavData.navMain.map((item, index) =>
                            resolveSideBarNavs(item, index)
                        )}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="General">
                        <CommandItem onSelect={handleProfileNavigation}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <CommandShortcut>{superKey}P</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <CommandShortcut>{superKey}S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
