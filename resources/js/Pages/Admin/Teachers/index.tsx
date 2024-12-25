import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { DataTable } from "@/Components/Table/DataTable";
import columns, { Teacher } from "./columns";
import { ResourcePaginator } from "@/types/data-table";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Teachers({
    auth,
    teachers,
}: PageProps<{ teachers: ResourcePaginator<Teacher> }>) {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: "Teachers",
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Teachers" />

            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6">
                    <DataTable
                        data={teachers.data}
                        columns={columns}
                        tableLayout="fixed"
                        inputProps={{
                            pagination: false,
                            searchFilter: true,
                            filterColumn: "email",
                        }}
                        pageLinks={teachers.meta.links}
                        totalCount={teachers.meta.total}
                        from={teachers.meta.from}
                        to={teachers.meta.to}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
