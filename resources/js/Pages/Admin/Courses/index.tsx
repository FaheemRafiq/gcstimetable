import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Course } from "@/types/database";
import { DataTable } from "@/Components/Table/DataTable";
import columns from "./_components/columns";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import { CourseForm } from "./_components/CourseForm";
import { PageProps } from "@/types";
import { LengthAwarePaginator } from "@/types/data-table";

export default function Courses({
    auth,
    courses,
}: PageProps<{ courses: LengthAwarePaginator<Course> }>) {
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
                        data={courses.data}
                        columns={columns}
                        inputProps={{
                            searchFilter: true,
                            filterColumn: "name",
                            pagination: false,
                        }}
                        // caption="List of courses"
                        totalCount={courses.total}
                        pageLinks={courses.links}
                        from={courses.from}
                        to={courses.to}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}