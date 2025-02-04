import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, UserType } from "@/types";
import { DataTable } from "@/Components/Table/DataTable";
import columns from "./_components/columns";
import { Room } from "@/types/database";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import { RoomForm } from "./_components/RoomForm";

export default function Rooms({ auth, rooms }: PageProps<{ rooms: Room[] }>) {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: "Rooms",
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Rooms" />
            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6">
                    <DataTable
                        data={rooms}
                        columns={columns}
                        inputProps={{
                            searchFilter: true,
                            filterColumn: "code",
                            pagination: true,
                        }}
                        create_button={
                            <div className="flex justify-end">
                                <RoomForm />
                            </div>
                        }
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
