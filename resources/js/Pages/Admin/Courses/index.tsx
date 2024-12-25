import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Course } from "@/types/database";
import { DataTable } from "@/Components/Table/DataTable";
import columns from "./_components/columns";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import { CourseForm } from "./_components/CourseForm";
import { PageProps } from "@/types";

export default function Courses({
    auth,
    courses,
}: PageProps<{ courses: Course[] }>) {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: "Courses",
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Courses" />
            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6">
                    <div className="flex justify-end">
                        <CourseForm />
                    </div>
                    <DataTable
                        data={courses}
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