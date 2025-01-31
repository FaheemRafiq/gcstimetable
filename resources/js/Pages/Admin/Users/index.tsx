import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps, UserType } from "@/types";
import { DataTable } from "@/Components/Table/DataTable";
import columns from "./columns";
import { ResourcePaginator } from "@/types/data-table";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import SearchInput from "@/components/inputs/search-input";
import UserFilters from "./_components/UserFilters";

export default function Users({
    auth,
    users,
}: PageProps<{ users: ResourcePaginator<UserType> }>) {
    const { setBreadcrumb } = useBreadcrumb();
    const [search, setSearch] = useState("");

    useEffect(() => {
        setBreadcrumb({
            title: "Users",
        });

        const searchParams = new URLSearchParams(location.search);

        if (searchParams.has("s")) {
            setSearch(searchParams.get("s")!);
        }

    }, [setBreadcrumb]);

    function handleSearch(query: string) {
        router.get(route("users.index", { s: query }));
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Users" />

            <div className="bg-card border border-border text-foreground sm:rounded-lg">
                <div className="p-6">

                    <div className="flex justify-between items-center gap-5">
                        <div className="flex-1">
                            <SearchInput
                                value={search}
                                onSearch={handleSearch}
                                placeholder="Search users by name, email..."
                            />
                        </div>
                        <div className="self-end">
                            <UserFilters />
                        </div>
                    </div>


                    <DataTable
                        data={users.data}
                        columns={columns}
                        inputProps={{
                            searchFilter: false,
                            // filterColumn: "email",
                            pagination: false,
                        }}
                        pageLinks={users.meta.links}
                        totalCount={users.meta.total}
                        from={users.meta.from}
                        to={users.meta.to}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
