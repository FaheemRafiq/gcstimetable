import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Program, Semester } from "@/types/database";
import { DataTable, SemesterForm } from "@/Components/Semesters";
import { getNumberWithOrdinal } from "@/utils/helper";

interface ShowRoomProps extends Record<string, unknown> {
    semester: Semester;
}

function ShowPage({ auth, semester }: PageProps<ShowRoomProps>) {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: semester.name,
            backItems: [
                {
                    title: "Semesters",
                    url: route("semesters.index"),
                },
            ],
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Show Semester" />

            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6 flex flex-col">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-semibold mb-6 text-card-foreground dark:text-foreground">
                            {semester.name} Details
                        </h1>
                        <Link
                            href={route("semesters.index")}
                            className="flex items-center space-x-2"
                        >
                            <Button variant={"outline"}>Back</Button>
                        </Link>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-background text-foreground p-6 sm:rounded-lg shadow-lg">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Name
                                </h3>
                                <p>{semester.name}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Number
                                </h3>
                                <p>{getNumberWithOrdinal(semester.number)}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Is Active
                                </h3>
                                <span>
                                    {semester.is_active === "active" ? (
                                        <Badge variant={"successOutline"}>
                                            Yes
                                        </Badge>
                                    ) : (
                                        <Badge variant={"destructiveOutline"}>
                                            No
                                        </Badge>
                                    )}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Program Name
                                </h3>
                                <p>{semester?.program?.name} Years</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Sections
                                </h3>
                                <span>
                                    <Badge variant={"secondary"}>
                                        {semester?.sections?.length}
                                    </Badge>
                                </span>
                            </div>
                        </div>

                        <div className="bg-background text-foreground p-6 sm:rounded-lg shadow-lg">
                            <div className="mb-4">
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Sections
                                    </h3>
                                    <span>
                                        {/* <SemesterForm programId={program.id} /> */}
                                    </span>
                                </div>
                                {/* <DataTable
                                    semesters={program.semesters ?? []}
                                /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default ShowPage;
