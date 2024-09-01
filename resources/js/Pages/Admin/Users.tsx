import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, User } from "@/types";
import { DataTable } from "@/Components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Verified, BadgeInfo } from "lucide-react";
import Tooltip from "@/components/ui/tooltip";

export default function Users({ auth, users }: PageProps<{ users: User[] }>) {

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
            accessorKey: "email_verified_at",
            header: "Email Verified",
            cell: ({ row }) => {
                const isVerified = row.original.email_verified_at;

                return (
                    <Tooltip
                        title={
                            "Email " +
                            (isVerified ? "Verified!" : "Not-Verifed!")
                        }
                        
                    >
                        {isVerified ? (
                            <Verified color="green" />
                        ) : (
                            <BadgeInfo color="red" />
                        )}
                    </Tooltip>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Registration Date",
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
                            <DataTable
                                data={users}
                                columns={columns}
                                inputProps={{
                                    searchFilter: true,
                                    filterColumn: "email",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
