import React, { Fragment, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Semester, Slot } from "@/types/database";
import { Switch } from "@/components/ui/switch";
import { FormSheet } from "@/Components/FormSheet";
import { IsActive } from "@/types";

interface FormProps {
    name: string;
    number: number;
    is_active: IsActive;
    program_id: number | null;
}

interface PageProps {
    semester?: Semester | null;
    programId?: number;
    open?: boolean;
    onClose?: () => void;
}

export const SemesterForm: React.FC<PageProps> = ({
    semester,
    programId,
    open: openProp,
    onClose,
}) => {
    const isEditForm = !!semester;

    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (openProp !== undefined) {
            setOpen(openProp);
        }
    }, [openProp]);

    const { data, errors, processing, setData, post, reset, put } =
        useForm<FormProps>({
            name: semester?.name ?? "",
            number: semester?.number ?? 1,
            is_active: semester?.is_active ?? "active",
            program_id: semester?.program_id ?? programId ?? null,
        });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const method = isEditForm ? put : post;
        const routeName = isEditForm ? "semesters.update" : "semesters.store";
        const routeParams = isEditForm && semester ? [semester.id] : [];

        method(route(routeName, routeParams), {
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

    const createDateWithTime = (timeString = "07:00:00") => {
        try {
            const today = new Date().toISOString().split("T")[0];
            return new Date(`${today}T${timeString}`);
        } catch {
            return new Date();
        }
    };

    const setTimeData = (key: keyof FormProps, date: Date | undefined) => {
        setData(key, date ? format(date, "HH:mm:ss") : "");
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
                    {isEditForm ? "Edit" : "Create"} Semester
                </Button>
            )}
            <FormSheet
                open={open}
                setOpen={handleOpen}
                title={
                    isEditForm
                        ? "Edit Semester : " + semester.name
                        : "Create Semester"
                }
                description={`Fill the required fields to ${
                    isEditForm ? "edit" : "create"
                } a Semester. Click save when you're done.`}
                footerActions={
                    <Button
                        disabled={processing}
                        size="sm"
                        type="submit"
                        form="roomForm" // Attach button to form
                    >
                        Save
                    </Button>
                }
            >
                <form
                    id="roomForm"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    {/* Code Field */}
                    <div>
                        <Label htmlFor="code">
                            Name
                            <span className="ps-0.5 text-xs text-red-600">
                                *
                            </span>
                        </Label>
                        <Input
                            id="code"
                            type="text"
                            value={data.name}
                            placeholder="Enter name"
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Semester No. Field */}
                    <div>
                        <Label htmlFor="code">
                            Semester No.
                            <span className="ps-0.5 text-xs text-red-600">
                                *
                            </span>
                        </Label>
                        <Input
                            id="code"
                            type="number"
                            min={1}
                            max={10}
                            value={data.number}
                            placeholder="Enter semester number"
                            onChange={(e) =>
                                setData("number", parseInt(e.target.value))
                            }
                            required
                        />
                        <InputError message={errors.number} />
                    </div>

                    {/* Is Active Field */}
                    <div>
                        <Label htmlFor="is_active">Is Active</Label>
                        <div className="flex items-center gap-2 mt-2">
                            <Switch
                                id="is_active"
                                checked={data.is_active === "active"}
                                onCheckedChange={(checked) =>
                                    setData(
                                        "is_active",
                                        checked ? "active" : "inactive"
                                    )
                                }
                            />
                            <span>
                                {data.is_active === "active" ? "Yes" : "No"}
                            </span>
                        </div>
                        <InputError message={errors.is_active} />
                    </div>
                </form>
            </FormSheet>
        </Fragment>
    );
};
