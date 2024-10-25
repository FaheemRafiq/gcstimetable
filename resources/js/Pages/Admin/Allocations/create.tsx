import { FormEventHandler, useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps, Shift, TimeStamp, TimeTable } from "@/types";
import { router, useForm, Link } from "@inertiajs/react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { toast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Day,
    Instituion,
    Room,
    Slot,
    Teacher,
    Semester,
    Course,
    Section,
    Allocation,
} from "@/types/database";
import { AutoCompleteSelect } from "@/components/combobox";
import { formatTime, getNumberWithOrdinal } from "@/utils/helper";
import { AllocationCell } from "../TimeTables/Partials/AllocationCell";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/components/providers/breadcrum-provider";
import {
    ArrowBigDown,
    CalendarDays,
    Group,
    Table,
    TimerIcon,
} from "lucide-react";
import { Book, User, MapPin, Calendar, MoveDown } from "lucide-react";
import DayCard from "./_components/DayCard";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getBackgroundColor } from "@/utils/dayHelper";
import Information from "./_components/Information";

interface FormProps {
    time_table_id: number;
    slot_id: number;
    day_id: number | null;
    section_id: number | null;
    room_id: number | null;
    teacher_id: number | null;
    course_id: number | null;
}

type ModifiedSection = {
    SemesterName: string;
    SemesterNo: number;
    SemesterId: number;
    ProgramType: string;
    id: number;
    name: string;
};

interface CreateAllocationProps {
    props: {
        timetable: TimeTable & {
            shift: Shift & {
                institution: Instituion & {
                    days?: Day[];
                    rooms?: Room[];
                    teachers?: Teacher[];
                    semesters?: Semester[];
                };
            };
        };
        slot: Slot;
        sections: ModifiedSection[];
        courses: Course[];
        allocations: Allocation[];
        haveSection: boolean;
    };
}

const EmptyAllocation: Allocation = {
    id: 0,
    day_id: 0,
    room_id: 0,
    teacher_id: 0,
    course_id: 0,
    section_id: 0,
    slot_id: 0,
    time_table_id: 0,
    name: "",
};

export default function CreateAllocation({
    auth,
    props,
}: PageProps & CreateAllocationProps) {
    // Constants
    const BACK_ROUTE = route("timetables.add.allocations", props.timetable.id);

    // State
    const { setBreadcrumb } = useBreadcrumb();
    const [selectedAllocation, setSelectedAllocation] = useState<Allocation>(
        props.allocations[0] ?? getDefaultAllocation()
    );

    const { data, setData, post, put, errors, processing, reset } =
        useForm<FormProps>({
            time_table_id: props?.timetable?.id,
            slot_id: props?.slot?.id,
            day_id: null,
            section_id:
                props?.sections.length > 1 ? null : props?.sections[0]?.id,
            room_id: null,
            teacher_id: null,
            course_id: null,
        });

    // Life Cycle Hooks
    useEffect(() => {
        setBreadcrumb({
            title: "Allocation",
            backItems: [
                {
                    title: "Time Tables",
                    url: route("timetables.index"),
                },
                {
                    title: "Add Allocations",
                    url: BACK_ROUTE,
                },
            ],
        });
    }, [setBreadcrumb]);

    useEffect(() => {
        if (selectedAllocation) {
            setData((data) => ({
                ...data,
                day_id: mapZeroToNull(selectedAllocation.day_id),
                room_id: mapZeroToNull(selectedAllocation.room_id),
                teacher_id: mapZeroToNull(selectedAllocation.teacher_id),
                course_id: mapZeroToNull(selectedAllocation.course_id),
            }));
        }
    }, [selectedAllocation]);

    function mapZeroToNull(value: number) {
        return value === 0 ? null : value;
    }

    function getDefaultAllocation() {
        const monday = props?.timetable?.shift?.institution?.days?.find(
            (day) => day.name === "Monday"
        );

        return { ...EmptyAllocation, day_id: monday?.id ?? 0 };
    }

    function getSectionLabel(section: ModifiedSection) {
        return `${section?.SemesterNo ? getNumberWithOrdinal(section.SemesterNo) : ''} - ${section?.name ?? ''} - ${section?.SemesterName ?? ''}`;
    }

    const filteredCourse: Course[] | [] = useMemo(() => {
        if (data.section_id) {
            let semester = props?.sections?.find(
                (section: ModifiedSection) => section.id === data.section_id
            );
            return props?.courses?.filter(
                (course) => course.semester_id === semester?.SemesterId
            );
        }

        return [];
    }, [data.section_id]);

    const filteredRooms: Room[] | [] = useMemo(() => {
        if (data.section_id) {
            let semester = props?.sections?.find(
                (section: ModifiedSection) => section.id === data.section_id
            );

            return (props?.timetable?.shift?.institution?.rooms || []).filter(
                (room) =>
                    semester?.ProgramType === room?.type ||
                    room?.type === "BOTH"
            );
        }

        return [];
    }, [data.section_id]);

    const selectedDay = useMemo(() => {
        return props?.timetable?.shift?.institution?.days?.find(
            (day) => day.id === selectedAllocation.day_id
        );
    }, [selectedAllocation]);

    // Submit Form
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (selectedAllocation.id === 0) {
            // Create New Allocation
            post(route("allocations.store"), {
                onSuccess: () => {
                    reset("room_id", "teacher_id", "course_id");
                    setSelectedAllocation(EmptyAllocation);
                },
            });
        } else {
            // Update Existing Allocation
            put(route("allocations.update", selectedAllocation.id));
        }
    };

    function getDayAllocation(dayId: number) {
        return props.allocations.find(
            (allocation) => allocation.day_id === dayId
        );
    }

    function handleClose() {
        router.get(BACK_ROUTE);
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Allocation" />
            <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
                <div className="p-2 md:p-6 space-y-4 flex flex-col">

                    {/* Show Allocations */}
                    <div className="order-2 md:order-1 w-full shadow-md rounded-lg bg-background px-6 py-4 border border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                            {/* Time Slot Row */}
                            <div className="font-bold min-h-[100px] flex flex-col justify-center items-center">
                                <div>{formatTime(props?.slot?.start_time)}</div>
                                <MoveDown
                                    className="text-center text-foreground/70"
                                    size={18}
                                />
                                <div>{formatTime(props?.slot?.end_time)}</div>
                            </div>
                            {props?.timetable?.shift?.institution?.days?.map(
                                (day) => {
                                    let allocation = getDayAllocation(day.id);

                                    if (allocation) {
                                        return (
                                            <DayCard
                                                key={day.id}
                                                day={day}
                                                selected={
                                                    selectedAllocation.day_id ===
                                                        day.id &&
                                                    selectedAllocation.id ===
                                                        allocation.id
                                                }
                                                onClick={() =>
                                                    setSelectedAllocation(
                                                        allocation
                                                    )
                                                }
                                            >
                                                <div
                                                    className={cn(
                                                        "flex items-start justify-center h-full cursor-pointer"
                                                    )}
                                                >
                                                    <div className="flex flex-col mt-2">
                                                        <div className="text-sm flex items-center space-x-2">
                                                            <Book className="w-4 h-4" />
                                                            <span>
                                                                {
                                                                    allocation
                                                                        ?.course
                                                                        ?.display_code
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="text-sm flex items-center space-x-2">
                                                            <User className="w-4 h-4" />
                                                            <span>
                                                                {
                                                                    allocation
                                                                        ?.teacher
                                                                        ?.name
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="text-sm flex items-center space-x-2">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>
                                                                {
                                                                    allocation
                                                                        ?.room
                                                                        ?.name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DayCard>
                                        );
                                    }

                                    return (
                                        <DayCard
                                            key={day.id}
                                            day={day}
                                            selected={
                                                selectedAllocation.day_id ===
                                                day.id
                                            }
                                            onClick={() =>
                                                setSelectedAllocation({
                                                    ...EmptyAllocation,
                                                    day_id: day.id,
                                                    slot_id: props.slot.id,
                                                    time_table_id:
                                                        props.timetable.id,
                                                })
                                            }
                                        >
                                            Empty
                                        </DayCard>
                                    );
                                }
                            )}
                        </div>
                    </div>

                    {/* Create Allocation */}
                    <Card className="order-1 md:order-2 w-full bg-white shadow-md rounded-lg dark:bg-background border border-border">
                        <CardHeader className="flex items-center space-x-4">
                            <CardTitle>Create Allocation</CardTitle>
                        </CardHeader>

                        <CardContent className="mt-4">
                            <div className="columns-1 lg:columns-2">
                                <Information
                                    icon={Table}
                                    title="Time Table"
                                    value={props?.timetable?.title}
                                />
                                <Information
                                    icon={TimerIcon}
                                    title="Time Slot"
                                    value={props?.slot?.name}
                                />
                                {props.haveSection === true ? (
                                    <Information
                                        icon={Group}
                                        title="Section"
                                        value={getSectionLabel(props.sections[0])}
                                    />
                                ) : null}

                                {selectedDay && selectedDay.name ? (
                                    <Information
                                        icon={CalendarDays}
                                        title="Day"
                                        value={selectedDay.name}
                                        jsxValue={
                                            <Badge
                                                className={cn(
                                                    "pointer-events-none",
                                                    getBackgroundColor(
                                                        selectedDay.name
                                                    )
                                                )}
                                            >
                                                {selectedDay.name}
                                            </Badge>
                                        }
                                    />
                                ) : null}
                            </div>

                            <Separator className="my-4" />

                            <div className="grid grid-cols-12 gap-4">
                                {props.haveSection === false ? (
                                    <div className="col-span-12 md:col-span-6">
                                        <InputLabel
                                            htmlFor="section"
                                            value="Section"
                                            className="mb-1"
                                        />
                                        <AutoCompleteSelect
                                            label="Select Section"
                                            value={
                                                data.section_id?.toString() ??
                                                null
                                            }
                                            setValue={(value: string) => {
                                                setData(
                                                    "section_id",
                                                    Number(value) ?? null
                                                );
                                            }}
                                            values={
                                                props?.sections.map(
                                                    (section) => {
                                                        return {
                                                            value: section.id.toString(),
                                                            label: `${getNumberWithOrdinal(
                                                                section.SemesterNo
                                                            )} - ${
                                                                section.name
                                                            } - ${
                                                                section.SemesterName
                                                            }`,
                                                        };
                                                    }
                                                ) ?? []
                                            }
                                        />
                                        <InputError
                                            message={errors.section_id}
                                        />
                                    </div>
                                ) : null}

                                {/* Rooms */}
                                <div className="col-span-12 md:col-span-6">
                                    <InputLabel htmlFor="room" value="Room" className="mb-1" />
                                    <AutoCompleteSelect
                                        label="Select Room"
                                        disabled={filteredRooms.length === 0}
                                        value={data.room_id?.toString() ?? null}
                                        setValue={(value: string) => {
                                            setData(
                                                "room_id",
                                                Number(value) ?? null
                                            );
                                        }}
                                        values={
                                            filteredRooms?.map((room) => {
                                                return {
                                                    value: room.id.toString(),
                                                    label: room.name,
                                                };
                                            }) ?? []
                                        }
                                    />
                                    <InputError message={errors.room_id} />
                                </div>

                                {/* Teacher Id */}
                                <div className="col-span-12 md:col-span-6">
                                    <InputLabel
                                        htmlFor="teacher"
                                        value="Teacher"
                                        className="mb-1"
                                    />
                                    <AutoCompleteSelect
                                        label="Select Teacher"
                                        value={
                                            data.teacher_id?.toString() ?? null
                                        }
                                        setValue={(value: string) => {
                                            setData(
                                                "teacher_id",
                                                Number(value) ?? null
                                            );
                                        }}
                                        values={
                                            props?.timetable?.shift?.institution?.teachers?.map(
                                                (teacher) => {
                                                    return {
                                                        value: teacher.id.toString(),
                                                        label: teacher.name,
                                                    };
                                                }
                                            ) ?? []
                                        }
                                    />
                                    <InputError message={errors.teacher_id} />
                                </div>

                                {/* Course Id */}
                                <div className="col-span-12 md:col-span-6">
                                    <InputLabel
                                        htmlFor="course"
                                        value="Course"
                                        className="mb-1"
                                    />

                                    <AutoCompleteSelect
                                        label="Select Course"
                                        disabled={filteredCourse.length === 0}
                                        value={
                                            data.course_id?.toString() ?? null
                                        }
                                        setValue={(value: string) => {
                                            setData(
                                                "course_id",
                                                Number(value) ?? null
                                            );
                                        }}
                                        values={
                                            filteredCourse?.map((course) => {
                                                return {
                                                    value: course.id.toString(),
                                                    label: course.code,
                                                };
                                            }) ?? []
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="mt-4 flex justify-end gap-3">
                            <Button variant={"outline"} onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                size={"sm"}
                                className="px-4"
                                onClick={submit}
                                disabled={processing}
                            >
                                Save
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
