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
import { Plus } from "lucide-react";
import InputError from "@/Components/InputError";
import toast from "react-hot-toast";

export const types = ["Morning", "Afternoon", "Evening"];
export const programs = ["INTER", "BS", "ADP"];

interface FormProps {
    name: string;
    type: string;
    program_type: string;
}

export function CreateNewShift() {
    const [open, setOpen] = React.useState(false);
    const {
        data,
        errors,
        processing,
        setData,
        post,
        reset,
        hasErrors,
        setError,
    } = useForm<FormProps>({
        name: "",
        type: "",
        program_type: "",
    });

    React.useEffect(() => {
        if (open && hasErrors) {
            if (errors.name && data.name) {
                setError("name", "");
            }
            if (errors.type && data.type) {
                setError("type", "");
            }
            if (errors.program_type && data.program_type) {
                setError("program_type", "");
            }
        }
    }, [data, errors, open]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route("shifts.store"), {
            preserveState: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
            onError: (error) => {
                if (error.message) {
                    toast.error(error.message);
                }
            },
        });
    };
    return (
        <Sheet open={open} onOpenChange={() => setOpen(!open)}>
            <SheetTrigger asChild>
                <Button onClick={() => setOpen(true)} size={"sm"}>
                    <Plus /> New
                </Button>
            </SheetTrigger>
            <SheetContent>
                <form onSubmit={handleSubmit}>
                    <SheetHeader>
                        <SheetTitle>Create Shift</SheetTitle>
                        <SheetDescription>
                            Fill the require fields to create a new shift. Click
                            save when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                className="col-span-3"
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.name}
                                className="col-span-3"
                            />
                        </div>
                        <div className="items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Type
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    setData("type", value)
                                }
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
                            <InputError
                                message={errors.type}
                                className="col-span-2"
                            />
                        </div>
                        <div className="items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Program Type
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    setData("program_type", value)
                                }
                                value={data.program_type}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select program" />
                                </SelectTrigger>
                                <SelectContent>
                                    {programs.map((program) => (
                                        <SelectItem
                                            value={program}
                                            key={program}
                                        >
                                            {program}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={errors.program_type}
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
