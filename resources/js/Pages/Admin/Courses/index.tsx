import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Course, StringObject } from "@/types/database";
import { DataTable } from "@/Components/Table/DataTable";
import columns from "./_components/columns";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import { CourseForm } from "./_components/CourseForm";
import { PageProps } from "@/types";
import { LengthAwarePaginator } from "@/types/data-table";
import CourseFilters from "./_components/CourseFilters";

export default function Courses({
    auth,
    courses,
    types
}: PageProps<{ courses: LengthAwarePaginator<Course>, types: StringObject }>) {
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
                    <div className="flex justify-between items-center">
                        <CourseFilters types={types}  />
                        
                        <div className="self-end">
                            <CourseForm />
                        </div>
                    </div>
                    <DataTable
                        data={courses.data}
                        columns={columns}
                        inputProps={{
                            searchFilter: false,
                            // filterColumn: "name",
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