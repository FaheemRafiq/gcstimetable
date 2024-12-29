import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { ResourcePaginator } from "@/types/data-table";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/Components/Table/FeaturedTable";
import columns from "./components/columns";
import { Teacher } from "@/types/database";

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
                        pinnedColumns={{ right: ['actions'] }}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
