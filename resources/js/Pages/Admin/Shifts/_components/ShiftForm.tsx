import React, { useEffect } from "react";
import { FormSheet } from "@/Components/FormSheet";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
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
import { IsActive, Shift } from "@/types";
import { Switch } from "@/components/ui/switch";

export const types = ["Morning", "Afternoon", "Evening"];
export const programs = ["INTER", "BS", "ADP"];

interface FormProps {
    name: string;
    type: string;
    is_active: IsActive;
    program_type: string;
}

interface ShiftFormProps {
    shift?: Shift;
    open?: boolean | undefined;
    onClose?: () => void;
}

export const ShiftForm: React.FC<ShiftFormProps> = ({
    shift,
    open: openProp = undefined,
    onClose,
}) => {
    // Constants
    const isEditForm = !!shift;

    // State
    const [open, setOpen] = React.useState(openProp ?? false);

    useEffect(() => {
        if (openProp !== undefined) {
            setOpen(openProp);
        }
    }, [openProp]);

    const { data, post, put, errors, processing, reset, setData } =
        useForm<FormProps>({
            name: shift?.name || "",
            type: shift?.type || "",
            is_active: shift?.is_active || "active",
            program_type: shift?.program_type || "",
        });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fullRoute = isEditForm
            ? route("shifts.update", shift.id)
            : route("shifts.store");
        const method = isEditForm ? put : post;

        method(fullRoute, {
            preserveState: true,
            onSuccess: () => {
                reset();
                setOpen(false);
                onClose?.();
            },
            onError: (error) => {
                toast.error(error.message || "An error occurred.");
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
        <React.Fragment>
            {/* Conditionally render button if `openProp` is not provided */}
            {openProp === undefined && (
                <Button onClick={() => setOpen(true)} size="sm">
                    {isEditForm ? "Edit Shift" : "Create Shift"}
                </Button>
            )}

            <FormSheet
                open={open}
                setOpen={handleOpen}
                title={
                    isEditForm ? `Edit Shift: ${shift?.name}` : "Create Shift"
                }
                description={`Fill the required fields to ${
                    isEditForm ? "update the shift." : "create a new shift."
                }`}
                footerActions={
                    <Button
                        disabled={processing}
                        size="sm"
                        type="submit"
                        form="shiftForm" // Attach the button to the form
                    >
                        Save
                    </Button>
                }
            >
                <form
                    id="shiftForm"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    {/* Name Field */}
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            placeholder="Enter shift name"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Type Field */}
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                            onValueChange={(value) => setData("type", value)}
                            value={data.type}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map((type) => (
                                    <SelectItem value={type} key={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>

                    {/* Program Type Field */}
                    <div>
                        <Label htmlFor="program_type">Program Type</Label>
                        <Select
                            onValueChange={(value) =>
                                setData("program_type", value)
                            }
                            value={data.program_type}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select program type" />
                            </SelectTrigger>
                            <SelectContent>
                                {programs.map((program) => (
                                    <SelectItem value={program} key={program}>
                                        {program}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.program_type} />
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
        </React.Fragment>
    );
};
