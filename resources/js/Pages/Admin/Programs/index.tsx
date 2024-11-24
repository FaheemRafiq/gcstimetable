import { useEffect } from "react";
import { Head } from "@inertiajs/react";

// Types
import { PageProps, Shift, UserType } from "@/types";
import { Program } from "@/types/database";

// Components
import { DataTable } from "@/Components/Table/DataTable";
import columns from "./_components/columns";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";

export default function Rooms({
    auth,
    programs,
}: PageProps<{ programs: Program[] }>) {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: "Programs",
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Programs" />
            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6">
                    <DataTable
                        data={programs}
                        columns={columns}
                        inputProps={{
                            searchFilter: true,
                            filterColumn: "name",
                            pagination: true,
                        }}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
