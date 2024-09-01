import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, User } from "@/types";
import { DataTable } from "@/Components/DataTable";
import { ColumnDef } from "@tanstack/react-table";

export default function Users({ auth, users }: PageProps<{ users: User[] }>) {

    console.log("Users -> users", users);

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "id",
            header: "#",
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
            accessorKey: "verifiedAt",
            header: "Email Verified At",
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Users
                </h2>
            }
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white text-gray-900 dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6">
                            <DataTable data={users} columns={columns} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
