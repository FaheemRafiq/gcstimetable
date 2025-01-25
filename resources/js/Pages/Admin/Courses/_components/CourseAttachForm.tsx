import React, { useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import InputError from "@/Components/InputError";
import { ClassType, Course, Institution, Semester } from "@/types/database";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { useAbilities } from "@/components/abilities-provider";
import Modal from "@/Components/Modal";
import { AutoCompleteSelect } from "@/components/combobox";
import toast from "react-hot-toast";

interface CourseAttachFormProps {
    open?: boolean | undefined;
    onClose?: () => void;
    course: Course;
}

interface PageState {
    semesters?: { value: number, label: string }[];
    isFeteched: boolean;
}

export const CourseAttachForm: React.FC<CourseAttachFormProps> = ({
    open: openProp = undefined,
    onClose,
    course
}) => {
    const { isSuperAdmin } = useAbilities();

    // State
    const [open, setOpen] = React.useState(openProp ?? false);
    const [pageState, setPageState] = React.useState<PageState>({
        semesters: [],
        isFeteched: false,
    });

    const { data, setData, post, processing, errors } = useForm({
        semester_id: ""
    });

    useEffect(() => {
        if (open && !pageState.isFeteched) {
            handleFetchState();
        }
    }, [open]);

    useEffect(() => {
        if (openProp !== undefined) {
            setOpen(openProp);
        }
    }, [openProp]);

    function handleFetchState() {
        fetchWrapper({
            url: route("courses.attach.semester", { course: course?.id }),
            method: "GET",
        })
            .then((response) => {
                console.log("handleFetchState -> response", response);
                setPageState({
                    ...response,
                    isFetched: true,
                });
            })
            .catch((error) => {
                console.error("handleCreate -> error", error);
            });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route("courses.attach", { course: course?.id }), {
            preserveScroll: true,
            onSuccess: () => {
                handleOpen(false);
            },
            onError: (error) => {
                if (error.message) {
                    toast.error(error.message);
                }
            }
        });
    };

    function handleOpen(value: boolean) {
        setOpen(value);

        if (value === false) {
            onClose?.();
        }
    }

    return (
        <Modal show={open} onClose={() => handleOpen(false)}>
            <Card className="w-full mx-auto bg-transparent shadow-none">
                <CardHeader>
                    <CardTitle>Attach Course</CardTitle>
                    <CardDescription>
                        Select the semester and attach the course to it.
                    </CardDescription>
                </CardHeader>
                <form id="courseAttachForm" onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {/* Semester Selector */}
                        <div className="space-y-2">
                            <Label htmlFor="semester_id">Semesters</Label>
                            <AutoCompleteSelect
                                label="Select Semester"
                                popoverClassName="w-full w-96"
                                value={
                                    data.semester_id?.toString() ??
                                    null
                                }
                                setValue={(value: string) => {
                                    setData(
                                        "semester_id",
                                        value
                                    );
                                }}
                                values={
                                    pageState?.semesters?.map(semester => ({
                                        value: semester.value.toString(),
                                        label: semester.label
                                    })) ?? []
                                }
                                isError={Boolean(errors.semester_id)}
                            />
                            <InputError message={errors.semester_id} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                        <Button
                            variant="secondary"
                            onClick={() => handleOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="default" disabled={processing}>
                            Attach Course
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </Modal>
    );
};
