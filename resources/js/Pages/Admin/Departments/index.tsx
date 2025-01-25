import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";

// Types
import { PageProps } from "@/types";
import { Department } from "@/types/database";

// Components
import { DataTable } from "@/Components/Table/DataTable";
import columns from "./_components/columns";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { Button } from "@/components/ui/button";
import { DepartmentForm } from "./_components/DepartmentForm";

export default function Rooms({
    auth,
    departments,
}: PageProps<{ departments: Department[] }>) {
    // state
    const [openCreate, setOpenCreate] = useState(false);

    // Constants
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: "Departments",
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Departments" />
            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6">
                    <h2 className="flex justify-end">
                        <Button size={"sm"} onClick={() => setOpenCreate(true)}>
                            Create Department
                        </Button>
                    </h2>
                    <DataTable
                        data={departments}
                        columns={columns}
                        inputProps={{
                            searchFilter: true,
                            filterColumn: "name",
                            pagination: true,
                        }}
                    />
                </div>
            </div>

            <DepartmentForm
                open={openCreate}
                onClose={() => setOpenCreate(false)}
            />
        </AuthenticatedLayout>
    );
}
