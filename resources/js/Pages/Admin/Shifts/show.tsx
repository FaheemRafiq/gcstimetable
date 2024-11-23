import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, Shift } from "@/types";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable, CreateNewSlot } from "@/Components/Slots";

interface ShowRoomProps extends Record<string, unknown> {
    shift: Shift;
}

function ShowShift({ auth, shift }: PageProps<ShowRoomProps>) {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: "Show " + shift.name,
            backItems: [
                {
                    title: "Shifts",
                    url: route("shifts.index"),
                },
            ],
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Show Shift" />

            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6 flex flex-col">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-semibold mb-6 text-card-foreground dark:text-foreground">
                            {shift.name} Details
                        </h1>
                        <Link
                            href={route("shifts.index")}
                            className="flex items-center space-x-2"
                        >
                            <Button variant={"outline"}>Back</Button>
                        </Link>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background text-foreground p-6 sm:rounded-lg shadow-lg">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Name
                                </h3>
                                <p>{shift.name}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Type
                                </h3>
                                <p>{shift.type}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Program Type
                                </h3>
                                <p>{shift.program_type}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Status
                                </h3>
                                <span>
                                    <Badge
                                        variant={
                                            shift.is_active === "active"
                                                ? "success"
                                                : "destructive"
                                        }
                                        className="capitalize"
                                    >
                                        {shift.is_active}
                                    </Badge>
                                </span>
                            </div>
                        </div>

                        <div className="bg-background text-foreground p-6 sm:rounded-lg shadow-lg">
                            <div className="mb-4">
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Time Slots
                                    </h3>
                                    <span>
                                        <CreateNewSlot shiftId={shift.id} />
                                    </span>
                                </div>
                                <DataTable slots={shift.slots ?? []} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default ShowShift;
