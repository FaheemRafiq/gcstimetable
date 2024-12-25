import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/database";

interface ShowCourseProps extends Record<string, unknown> {
    course: Course;
}

function ShowCourse({ auth, course }: PageProps<ShowCourseProps>) {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: course.name,
            backItems: [
                {
                    title: "Courses",
                    url: route("courses.index"),
                },
            ],
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Show Course" />

            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6 flex flex-col">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-semibold mb-6 text-card-foreground dark:text-foreground">
                            {course.name} Details
                        </h1>
                        <Link
                            href={route("courses.index")}
                            className="flex items-center space-x-2"
                        >
                            <Button variant={"outline"}>Back</Button>
                        </Link>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background text-foreground p-6 sm:rounded-lg shadow-lg">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Name
                                </h3>
                                <p>{course.name}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Code
                                </h3>
                                <p>{course.code}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Credit Hours
                                </h3>
                                <p>{course.credit_hours}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Display Code
                                </h3>
                                <p>{course.display_code}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Semester
                                </h3>
                                <p>{course.semester?.name}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Type
                                </h3>
                                <p>{course.type}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Status
                                </h3>
                                <span>
                                    <Badge
                                        variant={
                                            course.is_default === 1
                                                ? "success"
                                                : "destructive"
                                        }
                                        className="capitalize"
                                    >
                                        {course.is_default === 1
                                            ? "Default"
                                            : "Not Default"}
                                    </Badge>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default ShowCourse;