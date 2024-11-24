import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";

export default function Edit({
    auth,
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb({
            title: "Profile",
        });
    }, [setBreadcrumb]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profile" />

            <div className="space-y-5">
                <div className="p-4 sm:p-8 bg-card text-card-foreground border border-border shadow sm:rounded-lg">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="p-4 sm:p-8 bg-card text-card-foreground border border-border shadow sm:rounded-lg">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="p-4 sm:p-8 bg-card text-card-foreground border border-border shadow sm:rounded-lg">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
