import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Link } from "@inertiajs/react";
import { Room } from "@/types/database";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import TimeTableEvents from "@/Components/TimeTableEvents";
import { Events } from "@/types/time-table-events";

interface ShowRoomProps extends Record<string, unknown> {
    room: Room;
    events: Events;
}

export default function ShowRoom({
    auth,
    room,
    events,
}: PageProps<ShowRoomProps>) {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: "Show " + room.name,
            backItems: [
                {
                    title: "Rooms",
                    url: route("rooms.index"),
                },
            ],
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Show Room" />

            <div className="bg-card text-card-foreground border border-border sm:rounded-lg shadow-lg">
                <div className="p-6 flex flex-col">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-semibold mb-6 text-card-foreground dark:text-foreground">
                            Room Availability for {room.name}
                        </h1>
                        <Link
                            href={route("rooms.index")}
                            className="flex items-center space-x-2"
                        >
                            <Button variant={"outline"}>Back</Button>
                        </Link>
                    </div>

                    {/* Table structure to show availability */}
                    <TimeTableEvents events={events} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
