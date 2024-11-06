import { PropsWithChildren, ReactNode, useEffect } from "react";
import { PageProps, User } from "@/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Header from "@/Components/layout/Header";
import { usePage } from "@inertiajs/react";
import { toast } from "@/hooks/use-toast";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";
import { AbilitiesProvider } from "@/components/abilities-provider";

export default function Authenticated({
    user,
    children,
}: PropsWithChildren<{ user: User }>) {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.error || flash?.success) {
            toast({
                variant: flash.error ? "destructiveOutline" : "successOutline",
                description: flash.error || flash.success,
            });
        }
    }, [flash]);

    return (
        <AbilitiesProvider user={user}>
            <SidebarProvider className="h-screen">
                <AppSidebar user={user} />
                <SidebarInset className="overflow-hidden">
                    <Header SidebarTrigger={SidebarTrigger} />
                    <ScrollArea className={cn("flex flex-1 flex-col p-4 pt-0")}>
                        {children}
                    </ScrollArea>
                </SidebarInset>
            </SidebarProvider>
        </AbilitiesProvider>
    );
}
