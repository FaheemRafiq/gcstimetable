import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Program } from "@/types/database";
import { DataTable, SemesterForm } from "@/Components/Semesters";

interface ShowRoomProps extends Record<string, unknown> {
    program: Program;
}

function ShowPage({ auth, program }: PageProps<ShowRoomProps>) {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: program.name,
            backItems: [
                {
                    title: "Programs",
                    url: route("programs.index"),
                },
            ],
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Show Program" />

            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6 flex flex-col">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-semibold mb-6 text-card-foreground dark:text-foreground">
                            {program.name} Details
                        </h1>
                        <Link
                            href={route("programs.index")}
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
                                <p>{program.name}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Code
                                </h3>
                                <p>{program.code}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Duration
                                </h3>
                                <p>{program.duration} Years</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Type
                                </h3>
                                <span>
                                    <Badge
                                        variant={"secondary"}
                                        className="capitalize"
                                    >
                                        {program.type}
                                    </Badge>
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    Shift
                                </h3>
                                <p>{program?.shift?.name}</p>
                            </div>
                        </div>

                        <div className="bg-background text-foreground p-6 sm:rounded-lg shadow-lg">
                            <div className="mb-4">
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Semesters
                                    </h3>
                                    <span>
                                        <SemesterForm programId={program.id} />
                                    </span>
                                </div>
                                <DataTable
                                    semesters={program.semesters ?? []}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default ShowPage;
