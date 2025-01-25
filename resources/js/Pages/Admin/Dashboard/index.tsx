import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, Statistics } from "@/types";
import SimpleStats from "@/Components/SimpleStats";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import { UsersIcon, GraduationCap, UserIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PieChartCard } from './_component/PieChartCard'
import { TeacherWorkloadChart } from './_component/TeacherWorkload'
import { ShiftCoverageBarChart } from './_component/ShiftCoverage'
import { StudentEnrollmentChart } from "./_component/StudentEnrollment";

// Type definitions
interface CourseTypes {
    [key: string]: number;
}

interface ShiftCoverage {
    shift: string;
    total_slots: number;
    allocated: number;
}

interface TeacherWorkload {
    teacher: string;
    allocations: number;
}

interface DepartmentActivity {
    department: string;
    courses: number;
    teachers: number;
}

interface SemesterProgress {
    semester: string;
    total: number;
    allocated: number;
}


interface DashboardProps {
    statistics: Statistics;
    courseTypes: CourseTypes;
    shiftCoverage: ShiftCoverage[];
    teacherWorkload: TeacherWorkload[];
    studentEnrollment: any[];
    semesterProgress: SemesterProgress[];
    [key: string]: unknown;
}

export default function Dashboard({
    auth,
    statistics,
    courseTypes,
    shiftCoverage,
    teacherWorkload,
    studentEnrollment,
    semesterProgress,
}: PageProps<DashboardProps>) {

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


                <PieChartCard
                    courseTypes={courseTypes}
                />

                {/* Shift Coverage */}
                <ShiftCoverageBarChart shiftCoverage={shiftCoverage} />


                {/* Semester Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>Semester Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {semesterProgress.map((semester) => (
                            <div key={semester.semester} className="mb-4">
                                <h4 className="text-sm font-medium mb-2">{semester.semester}</h4>
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 rounded-full h-2"
                                            style={{
                                                width: `${(semester.allocated / semester.total) * 100}%`,
                                                transition: 'width 0.5s ease-in-out'
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {Math.round((semester.allocated / semester.total) * 100)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Teacher Workload */}
                <TeacherWorkloadChart teacherWorkload={teacherWorkload} />

                {/* Student Enrollment */}
                <StudentEnrollmentChart studentEnrollment={studentEnrollment} />
            </div>
        </AuthenticatedLayout>
    );
}
