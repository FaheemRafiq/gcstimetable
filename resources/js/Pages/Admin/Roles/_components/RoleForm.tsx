import React, { Fragment, useEffect } from "react";
import { FormSheet } from "@/Components/FormSheet";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Department, Program, Room } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import InputError from "@/Components/InputError";
import { Role, Shift } from "@/types";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { AutoCompleteSelect } from "@/components/combobox";

interface FormProps {
    name: string;
    guard_name: string;
}

interface RoleFormProps {
    role?: Role;
    open?: boolean | undefined;
    onClose?: () => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({
    role,
    open: openProp = undefined,
    onClose,
}) => {
    // Constants
    const isEditForm = role !== undefined;

    // State
    const [open, setOpen] = React.useState(false);

    const { data, post, put, errors, processing, reset, setData, setError } =
        useForm<FormProps>({
            name: "",
            guard_name: "web",
        });

    useEffect(() => {
        if (openProp !== undefined) {
            setOpen(openProp);
        }
    }, [openProp]);

    useEffect(() => {
        if (isEditForm && role) {
            setData((data) => ({
                ...data,
                name: role.name,
                code: role.guard_name
            }));
        }
    }, [role]);

    // Clear errors when data changes
    useEffect(() => {
        if (errors && data) {
            Object.keys(errors).forEach((key) => {
                if (key === "duration") {
                    return;
                }

                if (
                    errors[key as keyof FormProps] &&
                    data[key as keyof FormProps]
                ) {
                    setError(key as keyof FormProps, "");
                }
            });
        }
    }, [data]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fullRoute = isEditForm
            ? route("roles.update", role.id)
            : route("roles.store");
        const method = isEditForm ? put : post;

        method(fullRoute, {
            preserveState: true,
            onSuccess: () => {
                reset();
                setOpen(false);
                onClose?.();
            },
            onError: (error) => {
                if (error.message) {
                    toast.error(error.message);
                }
            },
        });
    };

    function handleOpen(value: boolean) {
        setOpen(value);

        if (value === false) {
            onClose?.();
        }
    }

    return (
        <Fragment>
            {openProp === undefined && (
                <Button onClick={() => setOpen(true)} size="sm">
                    {isEditForm ? "Edit" : "Create"} Role
                </Button>
            )}

            <FormSheet
                open={open}
                setOpen={handleOpen}
                title={
                    isEditForm
                        ? `Edit Role: ${role?.name}`
                        : "Create Role"
                }
                description={`Fill the required fields to ${
                    isEditForm ? "update the role." : "create a new role."
                }`}
                footerActions={
                    <Button
                        disabled={processing}
                        size="sm"
                        type="submit"
                        form="roleForm" // Attach button to form
                    >
                        Save
                    </Button>
                }
            >
                <form
                    id="roleForm"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    {/* Name Field */}
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            placeholder="Enter role name"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Guard Name */}
                    <div>
                        <Label htmlFor="name">Guard Name</Label>
                        <Input
                            id="guard_name"
                            value={data.guard_name}
                            placeholder="Enter guard name"
                            onChange={(e) => setData("guard_name", e.target.value)}
                            disabled
                        />
                        <InputError message={errors.guard_name} />
                    </div>
                </form>
            </FormSheet>
        </Fragment>
    );
};
