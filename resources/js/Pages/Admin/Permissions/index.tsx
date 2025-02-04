import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";

// Types
import { PageProps, Permission, Role } from "@/types";

// Components
import { DataTable } from "@/Components/Table/DataTable";
import columns from "./_components/columns";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { Button } from "@/components/ui/button";
import { PermissionForm } from "./_components/PermissionForm";

export default function Rooms({
    auth,
    permissions,
}: PageProps<{ permissions: Permission[] }>) {
    // state
    const [openCreate, setOpenCreate] = useState(false);

    // Constants
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: "Permissions",
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Permissions" />
            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6">

                    <DataTable
                        data={permissions}
                        columns={columns}
                        inputProps={{
                            searchFilter: true,
                            filterColumn: "name",
                            pagination: true,
                        }}
                        create_button={
                            <h2 className="flex justify-end">
                                <Button size={"sm"} onClick={() => setOpenCreate(true)}>
                                    Create Permission
                                </Button>
                            </h2>
                        }
                    />
                </div>
            </div>

            <PermissionForm
                open={openCreate}
                onClose={() => setOpenCreate(false)}
            />
        </AuthenticatedLayout>
    );
}
