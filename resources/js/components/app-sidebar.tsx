import * as React from "react";
import {
    type LucideIcon,
    BookOpen,
    Bot,
    Command,
    Frame,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
    HomeIcon,
    UsersIcon,
    UserIcon,
    CalendarIcon,
    Building,
    CalendarDays,
    LayoutDashboardIcon,
    GraduationCap,
    Hourglass,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "@/types";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { useAbilities } from "./abilities-provider";

export type Icon = LucideIcon;

export type NavItem = {
    title: string;
    url: string;
    route: string;
    icon: Icon;
    isActive: boolean;
    collaped?: boolean;
    disabled?: boolean;
    items?: NavItem[];
};

export type NavDataType = {
    navMain: NavItem[];
    navCurriculum: NavItem[];
    navSecondary: any;
    projects: any;
};

export const NavData: NavDataType = {
    navMain: [
        {
            title: "Dashboard",
            route: "dashboard",
            url: route("dashboard"),
            icon: LayoutDashboardIcon,
            isActive: route().current("dashboard"),
        },
        {
            title: "Users",
            route: "users.index",
            url: route("users.index"),
            icon: UsersIcon,
            isActive: route().current("users.index"),
            collaped:
                route().current("teachers.index") ||
                route().current("students.index"),
            items: [
                {
                    title: "Teachers",
                    route: "teachers.index",
                    url: route("teachers.index"),
                    icon: UserIcon,
                    isActive: route().current("teachers.index"),
                },
                {
                    title: "Students",
                    route: "students.index",
                    url: route("students.index"),
                    icon: GraduationCap,
                    isActive: route().current("students.index"),
                },
            ],
        },
        {
            title: "Time Tables",
            route: "timetables.index",
            url: route("timetables.index"),
            isActive: route().current("timetables.index"),
            icon: CalendarDays,
        },
        {
            title: "Rooms",
            route: "rooms.index",
            url: route("rooms.index"),
            isActive: route().current("rooms.index"),
            icon: Building,
        },
        {
            title: "Shifts",
            route: "shifts.index",
            url: route("shifts.index"),
            isActive: route().current("shifts.index"),
            icon: Hourglass,
        },
    ],
    navCurriculum: [
        {
            title: "Programs",
            route: "programs.index",
            url: route("programs.index"),
            icon: BookOpen,
            isActive: route().current("programs.index"),
        },
        {
            title: "Semesters",
            route: "semesters.index",
            url: route("semesters.index"),
            icon: Command,
            isActive: route().current("semesters.index"),
        },
        {
            title: "Sections",
            route: "sections.index",
            url: route("sections.index"),
            icon: SquareTerminal,
            isActive: route().current("sections.index"),
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
    const checkActivity = React.useCallback((item: NavItem) => {
        let NewItem = {
            ...item,
            isActive: route().current(item.route),
        };

        if (NewItem?.collaped) {
            NewItem.collaped = NewItem.items?.some((subItem) =>
                route().current(subItem.route)
            );
        }

        if (NewItem.items) {
            NewItem.items = NewItem.items.map(checkActivity);
        }

        return NewItem;
    }, []);

    const AdministrationRoutes = React.useMemo(() => {
        return NavData.navMain.map(checkActivity);
    }, [window.location.pathname]);

    const StructureRoutes = React.useMemo(() => {
        return NavData.navCurriculum.map(checkActivity);
    }, [window.location.pathname]);

    return (
        <Sidebar variant="inset" collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <ApplicationLogo />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        Time Table
                                    </span>
                                    <span className="truncate text-xs">
                                        Enterprise
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain label="Administration" items={AdministrationRoutes} />
                <NavMain label="Academic Structure" items={StructureRoutes} />
                {/* <NavProjects projects={NavData.projects} /> */}
                <NavSecondary
                    items={NavData.navSecondary}
                    className="mt-auto"
                />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
