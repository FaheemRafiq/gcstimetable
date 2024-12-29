import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, Statistics } from "@/types";
import SimpleStats from "@/Components/SimpleStats";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import { UsersIcon, GraduationCap, UserIcon } from "lucide-react";
import { ProgramsPerDepartment } from './_component/ProgramsPerDepartment'

export default function Dashboard({
    auth,
    statistics,
    charts
}: PageProps<{ statistics: Statistics, charts: any }>) {

    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: "Dashboard",
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <SimpleStats
                    title="Total Users"
                    value={statistics.users}
                    navigation={route("users.index")}
                    icon={UsersIcon}
                />
                <SimpleStats
                    title="Total Students"
                    value={statistics.students}
                    navigation={route("students.index")}
                    icon={GraduationCap}
                />
                <SimpleStats
                    title="Total Teachers"
                    value={statistics.teachers}
                    navigation={route("teachers.index")}
                    icon={UserIcon}
                />
            </div>

            {/* Charts */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <ProgramsPerDepartment data={charts.programsPerDepartment} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
