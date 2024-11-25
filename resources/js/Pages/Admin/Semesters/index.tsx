import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";

// Types
import { PageProps } from "@/types";
import { Program, Semester } from "@/types/database";

// Components
import { DataTable, SemesterForm } from "@/Components/Semesters";
import columns from "./_components/columns";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import { Button } from "@/components/ui/button";
import { ProgramForm } from "./_components/ProgramForm";

export default function Rooms({
    auth,
    semesters,
}: PageProps<{ semesters: Semester[] }>) {
    // state
    const [openCreate, setOpenCreate] = useState(false);

    // Constants
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: "Semesters",
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Semesters" />
            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-6">
                    <h2 className="flex justify-end">
                        <Button size={"sm"} onClick={() => setOpenCreate(true)}>
                            Create Semester
                        </Button>
                    </h2>
                    <DataTable semesters={semesters} searchFilter pagination />
                </div>
            </div>

            <SemesterForm
                open={openCreate}
                onClose={() => setOpenCreate(false)}
            />
        </AuthenticatedLayout>
    );
}
