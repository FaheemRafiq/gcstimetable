import React, { Fragment, useEffect } from "react";
import { FormSheet } from "@/Components/FormSheet";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Room } from "@/types/database";
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

export const types = ["INTER", "BS", "BOTH"];

interface FormProps {
    name: string;
    code: string;
    capacity: number;
    type: string;
    isavailable: boolean;
}

interface RoomFormProps {
    room?: Room;
    open?: boolean | undefined;
    onClose?: () => void;
}

export const RoomForm: React.FC<RoomFormProps> = ({
    room,
    open: openProp = undefined,
    onClose,
}) => {
    // Constants
    const isEditForm = room !== undefined;

    // State
    const [open, setOpen] = React.useState(openProp ?? false);

    useEffect(() => {
        if (openProp !== undefined) {
            setOpen(openProp);
        }
    }, [openProp]);

    const { data, post, put, errors, processing, reset, setData } =
        useForm<FormProps>({
            name: "",
            code: "",
            capacity: 0,
            type: "",
            isavailable: true,
        });

    React.useEffect(() => {
        if (isEditForm && room) {
            setData({
                name: room.name || "",
                code: room.code || "",
                capacity: room.capacity || 0,
                type: room.type || "",
                isavailable: room.isavailable ?? true,
            });
        }
    }, [room]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fullRoute = isEditForm
            ? route("rooms.update", room.id)
            : route("rooms.store");
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
        <Fragment>
            {openProp === undefined && (
                <Button onClick={() => setOpen(true)} size="sm">
                    {isEditForm ? "Edit" : "Create"} Room
                </Button>
            )}

            <FormSheet
                open={open}
                setOpen={handleOpen}
                title={
                    isEditForm ? `Edit Shift: ${room?.name}` : "Create Shift"
                }
                description={`Fill the required fields to ${
                    isEditForm ? "update the room." : "create a new room."
                }`}
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
                    {/* Name Field */}
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            placeholder="Enter room name"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Code Field */}
                    <div>
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            value={data.code}
                            placeholder="Enter room code"
                            onChange={(e) => setData("code", e.target.value)}
                        />
                        <InputError message={errors.code} />
                    </div>

                    {/* Capacity Field */}
                    <div>
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                            id="capacity"
                            type="number"
                            value={data.capacity}
                            placeholder="Enter room capacity"
                            onChange={(e) =>
                                setData(
                                    "capacity",
                                    parseInt(e.target.value, 10) || 0
                                )
                            }
                        />
                        <InputError message={errors.capacity} />
                    </div>

                    {/* Type Field */}
                    <div>
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={data.type}
                            onValueChange={(value) => setData("type", value)}
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
                </form>
            </FormSheet>
        </Fragment>
    );
};
