import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import { Department, Institution } from "@/types/database";

interface ShowDepartmentProps extends Record<string, unknown> {
    department: Department;
}

function ShowPage({ auth, department }: PageProps<ShowDepartmentProps>) {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: department.name,
            backItems: [
                {
                    title: "Departments",
                    url: route("departments.index"),
                },
            ],
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Show Department" />

            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6 flex flex-col">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-semibold mb-6 text-card-foreground dark:text-foreground">
                            {department.name} Details
                        </h1>
                        <Link
                            href={route("departments.index")}
                            className="flex items-center space-x-2"
                        >
                            <Button variant={"outline"}>Back</Button>
                        </Link>
                    </div>

                    <div className="space-y-4 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background text-foreground p-6 sm:rounded-lg shadow-lg">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Name
                            </h3>
                            <p>{department.name}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Code
                            </h3>
                            <p>{department.code}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Institution
                            </h3>
                            <p>{department.institution?.name}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Created At
                            </h3>
                            <p>{department.created_at}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Updated At
                            </h3>
                            <p>{department.updated_at}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default ShowPage;
