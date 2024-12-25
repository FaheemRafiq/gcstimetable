import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, Student } from "@/types";
import { DataTable } from "@/Components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";

export default function Students({
    auth,
    students,
}: PageProps<{ students: Student[] }>) {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: "Students",
        });
    }, [setBreadcrumb]);

    const columns: ColumnDef<Student>[] = [
        {
            accessorKey: "index",
            header: "#",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "mobile",
            header: "Phone",
        },
        {
            accessorKey: "createdAt",
            header: "Registration Date",
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Students" />

            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6">
                    <DataTable
                        data={students}
                        columns={columns}
                        inputProps={{
                            searchFilter: true,
                            filterColumn: "email",
                            pagination: true,
                        }}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
