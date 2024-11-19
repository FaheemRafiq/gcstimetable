import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "@inertiajs/react";
import { Pencil, Plus } from "lucide-react";
import InputError from "@/Components/InputError";
import toast from "react-hot-toast";
import { TimePickerDemo } from "@/components/time-picker/time-picker-input";
import { format } from "date-fns";
import { Slot } from "@/types/database";

interface FormProps {
    code: string;
    start_time: string;
    end_time: string;
    is_practical: string;
    shift_id: number;
}

interface SlotFormProps {
    slot?: Slot | null;
    shiftId?: number;
    onSuccess?: () => void;
}

export function SlotForm({ slot, shiftId, onSuccess }: SlotFormProps) {
    const isEditMode = !!slot;
    const [open, setOpen] = React.useState(false);

    const { data, errors, processing, setData, post, reset, put } =
        useForm<FormProps>({
            code: slot?.code || "",
            start_time: slot?.start_time || "07:00:00",
            end_time: slot?.end_time || "08:00:00",
            is_practical: slot?.is_practical.toString() || "0",
            shift_id: slot?.shift_id || shiftId || 0,
        });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const method = isEditMode ? put : post;
        const routeName = isEditMode ? `slots.update` : `slots.store`;
        const routeParams = isEditMode ? [slot!.id] : [];

        method(route(routeName, routeParams), {
            preserveState: true,
            onSuccess: () => {
                reset();
                setOpen(false);
                if (onSuccess) onSuccess();
            },
            onError: (error) => {
                if (error.message) {
                    toast.error(error.message);
                }
            },
        });
    };

    function handleClose() {
        setOpen(!open);
        if (!open) reset();
    }

    function createDateWithTime(timeString = "07:00:00") {
        const today = new Date().toISOString().split("T")[0];
        return new Date(`${today}T${timeString || "07:00:00"}`);
    }

    function setTimeData(key: keyof FormProps, date: Date | undefined) {
        setData(key, date ? format(date, "HH:mm:ss") : "");
    }

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetTrigger asChild>
                {isEditMode ? (
                    <button
                        onClick={() => setOpen(true)}
                        className="flex appearance-none w-full"
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </button>
                ) : (
                    <Button onClick={() => setOpen(true)} size={"sm"}>
                        <Plus /> New
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent>
                <form onSubmit={handleSubmit}>
                    <SheetHeader>
                        <SheetTitle>
                            {isEditMode ? "Edit Time Slot" : "Create Time Slot"}
                        </SheetTitle>
                        <SheetDescription>
                            Fill the required fields to{" "}
                            {isEditMode ? "edit" : "create"} a time slot. Click
                            save when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Code
                                <span className="text-sx text-red-600">*</span>
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.code}
                                className="col-span-3"
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.code}
                                className="col-span-3"
                            />
                        </div>
                        <div className="items-center gap-4">
                            <Label htmlFor="start_time" className="text-right">
                                Start Time
                            </Label>
                            <div className="flex justify-center">
                                <TimePickerDemo
                                    date={createDateWithTime(data.start_time)}
                                    setDate={(date) =>
                                        setTimeData("start_time", date)
                                    }
                                />
                            </div>
                            <InputError
                                message={errors.start_time}
                                className="col-span-2"
                            />
                        </div>
                        <div className="items-center gap-4">
                            <Label htmlFor="end_time" className="text-right">
                                End Time
                            </Label>
                            <div className="flex justify-center">
                                <TimePickerDemo
                                    date={createDateWithTime(data.end_time)}
                                    setDate={(date) =>
                                        setTimeData("end_time", date)
                                    }
                                />
                            </div>
                            <InputError
                                message={errors.end_time}
                                className="col-span-2"
                            />
                        </div>
                        <div className="items-center gap-4">
                            <Label
                                htmlFor="is_practical"
                                className="text-right"
                            >
                                Is Practical
                                <span className="text-sx text-red-600">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    setData("is_practical", value)
                                }
                                value={data.is_practical}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"1"}>Yes</SelectItem>
                                    <SelectItem value={"0"}>No</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError
                                message={errors.is_practical}
                                className="col-span-2"
                            />
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button size={"sm"} variant={"ghost"}>
                                Close
                            </Button>
                        </SheetClose>
                        <Button disabled={processing} size={"sm"} type="submit">
                            Save
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
