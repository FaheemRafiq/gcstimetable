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
    Book,
    Landmark,
    Hotel,
    ShieldCheckIcon,
    KeyIcon,
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
    navItems?: NavItem[];
};

export interface NavSection {
    label: string;
    items: NavItem[];
}

export type NavDataType = NavSection[];

export const NavData: NavDataType = [
    {
        label: "Management",
        items: [
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
            },
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
        label: "Academics",
        items: [
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
                title: "Courses",
                route: "courses.index",
                url: route("courses.index"),
                icon: Book,
                isActive: route().current("courses.index"),
            },
        ],
    },
    {
        label: "Infrastructure",
        items: [
            {
                title: "Institutions",
                route: "institutions.index",
                url: route("institutions.index"),
                isActive: route().current("institutions.index"),
                icon: Landmark,
            },
            {
                title: "Departments",
                route: "departments.index",
                url: route("departments.index"),
                isActive: route().current("departments.index"),
                icon: Hotel,
            },
            {
                title: "Rooms",
                route: "rooms.index",
                url: route("rooms.index"),
                isActive: route().current("rooms.index"),
                icon: Building,
            },
            {
                title: "Time Tables",
                route: "timetables.index",
                url: route("timetables.index"),
                isActive: route().current("timetables.index"),
                icon: CalendarDays,
            },
            {
                title: "Shifts",
                route: "shifts.index",
                url: route("shifts.index"),
                isActive: route().current("shifts.index"),
                icon: Hourglass,
            },
        ],
    },
    {
        label: "Access Control",
        items: [
            {
                title: "Roles",
                route: "roles.index",
                url: route("roles.index"),
                icon: ShieldCheckIcon,
                isActive: route().current("roles.index"),
            },
            {
                title: "Permissions",
                route: "permissions.index",
                url: route("permissions.index"),
                icon: KeyIcon,
                isActive: route().current("permissions.index"),
            },
        ],
    },
];

export const SecondaryNavData: any = [
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
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: User;
}
export function AppSidebar({ user, ...props }: AppSidebarProps) {
    const { isSuperAdmin } = useAbilities();

    const checkActivity = React.useCallback((item: NavItem) => {
        let NewItem = {
            ...item,
            isActive: route().current(item.route),
        };

        if (NewItem?.collaped !== undefined) {
            NewItem.collaped = NewItem.navItems?.some((subItem) =>
                route().current(subItem.route)
            );
        }

        if (NewItem.navItems) {
            NewItem.navItems = NewItem.navItems.map(checkActivity);
        }

        return NewItem;
    }, []);

    const NavigationData = React.useMemo(() => {
        return NavData
        .filter(section => isSuperAdmin() || !section.label.includes('Access Control'))
        .map((section) => ({
            ...section,
            items: section.items
                .filter((item) => isSuperAdmin() || item.route !== "institutions.index")
                .map((item) => checkActivity(item))
        }));
    }, [isSuperAdmin, checkActivity]);

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
                                        {user.label ?? "Time Table"}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.institution?.name ?? "Enterprise"}
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {NavigationData.map((section) => (
                    <NavMain
                        key={section.label}
                        label={section.label}
                        items={section.items}
                    />
                ))}
                <NavSecondary items={SecondaryNavData} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
