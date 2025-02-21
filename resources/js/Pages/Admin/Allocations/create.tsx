import { FormEventHandler, useEffect, useMemo, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps, Shift, TimeStamp, TimeTable } from '@/types'
import { router, useForm, Link } from '@inertiajs/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'
import { toast } from 'react-toastify'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Day,
  Institution,
  Room,
  Slot,
  Teacher,
  Semester,
  Course,
  Section,
  Allocation,
} from '@/types/database'
import { AutoCompleteSelect } from '@/components/combobox'
import { formatTime, getNumberWithOrdinal } from '@/utils/helper'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import {
  ArrowBigDown,
  CalendarDays,
  EllipsisIcon,
  EllipsisVertical,
  Group,
  Table,
  Trash,
  TimerIcon,
  ArrowLeftRight,
} from 'lucide-react'
import { Book, User, MapPin, Calendar, MoveDown } from 'lucide-react'
import DayCard from './_components/DayCard'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { getBackgroundColor } from '@/utils/dayHelper'
import Information from './_components/Information'
import DeleteAllocationDialog from './_components/DeleteAllocationDialog'

interface FormProps {
  time_table_id: number
  slot_id: number
  day_id: number | null
  section_id: number | null
  room_id: number | null
  teacher_id: number | null
  course_id: number | null
  allocation_id: number | null
  [key: string]: any
}

type ModifiedSection = {
  SemesterName: string
  SemesterNo: number
  SemesterId: number
  ProgramType: string
  id: number
  name: string
}

interface CreateAllocationProps {
  props: {
    timetable: TimeTable & {
      shift: Shift & {
        institution: Institution & {
          days?: Day[]
          rooms?: Room[]
          teachers?: Teacher[]
          semesters?: Semester[]
        }
      }
    }
    slot: Slot
    sections: ModifiedSection[]
    courses: Course[]
    allocations: Allocation[]
    haveSection: boolean
  }
}

export default function CreateAllocation({ auth, props }: PageProps & CreateAllocationProps) {
  // Constants
  const BACK_ROUTE = route('timetables.add.allocations', props.timetable.id)

  // State
  const { setBreadcrumb } = useBreadcrumb()
  const [deleteAllocation, setDeleteAllocation] = useState<number | null>(null)

  const { data, setData, post, put, errors, processing, reset, clearErrors } = useForm<FormProps>({
    time_table_id: props?.timetable?.id,
    slot_id: props?.slot?.id,
    day_id: null,
    section_id: props?.sections.length > 1 ? null : props?.sections[0]?.id,
    room_id: null,
    teacher_id: null,
    course_id: null,
    allocation_id: null,
  })

  // Life Cycle Hooks
  useEffect(() => {
    setDefaultValues()
    setBreadcrumb({
      title:
        (props.sections.length > 1 ? null : getSectionLabel(props.sections[0])) ?? 'Allocation',
      backItems: [
        {
          title: 'Time Tables',
          url: route('timetables.index'),
        },
        {
          title: props.timetable.title ?? 'Add Allocations',
          url: BACK_ROUTE,
        },
      ],
    })
  }, [setBreadcrumb])

  function setDefaultValues() {
    if (props.allocations[0]) {
      const allocation = props.allocations[0]
      setData(data => ({
        ...data,
        day_id: allocation.day_id,
        room_id: allocation.room_id,
        teacher_id: allocation.teacher_id,
        course_id: allocation.course_id,
        allocation_id: allocation.id,
      }))
    } else {
      const monday = props?.timetable?.shift?.institution?.days?.find(day => day.name === 'Monday')

      setData('day_id', monday?.id ?? null)
    }
  }

  function getSectionLabel(section: ModifiedSection) {
    return `${
      section?.SemesterNo ? getNumberWithOrdinal(section.SemesterNo) : ''
    } - ${section?.name ?? ''} - ${section?.SemesterName ?? ''}`
  }

  const filteredCourse: Course[] | [] = useMemo(() => {
    if (data.section_id) {
      let semester = props?.sections?.find(
        (section: ModifiedSection) => section.id === data.section_id
      )
      return props?.courses?.filter(course =>
        course.semesters?.find(sem => sem.id === semester?.SemesterId)
      )
    }

    return []
  }, [data.section_id])

  const filteredRooms: Room[] | [] = useMemo(() => {
    if (data.section_id) {
      let semester = props?.sections?.find(
        (section: ModifiedSection) => section.id === data.section_id
      )

      return (props?.timetable?.shift?.institution?.rooms || []).filter(
        room => semester?.ProgramType === room?.type || room?.type === 'BOTH'
      )
    }

    return []
  }, [data.section_id])

  const selectedDay = useMemo(() => {
    return props?.timetable?.shift?.institution?.days?.find(day => day.id === data.day_id)
  }, [data.day_id])

  const allocatedDays = useMemo(() => {
    return props.allocations.map(allocation => allocation.day_id)
  }, [props.allocations])

  // Submit Form
  const submit: FormEventHandler = e => {
    e.preventDefault()

    if (data.allocation_id) {
      // Update Existing Allocation
      put(route('allocations.update', data.allocation_id))
    } else {
      // Create New Allocation
      post(route('allocations.store'), {
        preserveState: true,
        onSuccess: () => {
          setDefaultValues()
        },
        onError: error => {
          if (error.message) {
            toast.error(error.message)
          }
        },
      })
    }
  }

  function getDayAllocation(dayId: number) {
    return props.allocations.find(allocation => allocation.day_id === dayId)
  }

  function handleClose() {
    router.get(BACK_ROUTE)
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Manage Allocation" />
      <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
        <div className="p-2 md:p-6 space-y-4 flex flex-col">
          {/* Show Allocations */}
          <div className="order-2 md:order-1 w-full shadow-md rounded-lg bg-background px-6 py-4 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {/* Time Slot Row */}
              <div className="font-bold min-h-[100px] flex flex-col justify-center items-center">
                <div>{formatTime(props?.slot?.start_time)}</div>
                <MoveDown className="text-center text-foreground/70" size={18} />
                <div>{formatTime(props?.slot?.end_time)}</div>
              </div>
              {props?.timetable?.shift?.institution?.days?.map(day => {
                const allocation = getDayAllocation(day.id)
                const isSelected =
                  data.day_id === day.id &&
                  data.allocation_id === (allocation ? allocation.id : null)

                const handleClick = () => {
                  setData(prevData => ({
                    ...prevData,
                    day_id: day.id,
                    allocation_id: allocation ? allocation.id : null,
                    room_id: allocation?.room_id || null,
                    teacher_id: allocation?.teacher_id || null,
                    course_id: allocation?.course_id || null,
                  }))
                  clearErrors()
                }

                return (
                  <DayCard key={day.id} day={day} selected={isSelected} onClick={handleClick}>
                    <div className={cn('flex items-start justify-center h-full cursor-pointer')}>
                      <div className="flex flex-col mt-2">
                        {allocation ? (
                          <>
                            <div className="text-sm flex items-center space-x-2">
                              <Book className="w-4 h-4" />
                              <span className="truncate text-ellipsis ">
                                {allocation.course?.display_code?.substring(0, 10)}
                              </span>
                            </div>
                            <div className="text-sm flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>{allocation.teacher?.name?.substring(0, 15)}</span>
                            </div>
                            <div className="text-sm flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{allocation.room?.name}</span>
                            </div>
                          </>
                        ) : (data.course_id || data.teacher_id || data.room_id) &&
                          data.day_id === day.id ? (
                          <>
                            {data.course_id && (
                              <div className="text-sm flex items-center space-x-2">
                                <Book className="w-4 h-4" />
                                <span>
                                  {
                                    props?.courses.find(course => course.id === data.course_id)
                                      ?.display_code
                                  }
                                </span>
                              </div>
                            )}
                            {data.teacher_id && (
                              <div className="text-sm flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>
                                  {
                                    props?.timetable?.shift?.institution?.teachers?.find(
                                      teacher => teacher.id === data.teacher_id
                                    )?.name
                                  }
                                </span>
                              </div>
                            )}
                            {data.room_id && (
                              <div className="text-sm flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {
                                    props?.timetable?.shift?.institution?.rooms?.find(
                                      room => room.id === data.room_id
                                    )?.name
                                  }
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          'Empty'
                        )}
                      </div>
                    </div>
                  </DayCard>
                )
              })}
            </div>
          </div>

          {/* Manage Allocation */}
          <Card className="order-1 md:order-2 w-full bg-white shadow-md rounded-lg dark:bg-background border border-border">
            <CardHeader className="relative flex flex-row items-center justify-center border-b space-x-4">
              <CardTitle>Manage Allocation</CardTitle>
              <div className="absolute top-0 right-0 p-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left" className="w-44">
                    <DropdownMenuLabel>Operations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger
                          disabled={allocatedDays.length === 0}
                          className="cursor-pointer"
                        >
                          <ArrowLeftRight className="mr-2 h-4 w-4" />
                          <span>Same As</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {allocatedDays.map(dayId => {
                              const allocation = getDayAllocation(dayId)
                              return (
                                <DropdownMenuItem
                                  key={dayId}
                                  onClick={() => {
                                    setData(prevData => ({
                                      ...prevData,
                                      room_id: allocation?.room_id ?? null,
                                      teacher_id: allocation?.teacher_id ?? null,
                                      course_id: allocation?.course_id ?? null,
                                    }))
                                  }}
                                >
                                  {allocation?.day?.name}
                                </DropdownMenuItem>
                              )
                            })}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        disabled={data.allocation_id === null}
                        onClick={() => {
                          setDeleteAllocation(data.allocation_id)
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="mt-4">
              <div className="columns-1 lg:columns-2">
                <Information icon={Table} title="Time Table" value={props?.timetable?.title} />
                <Information icon={TimerIcon} title="Time Slot" value={props?.slot?.name} />
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
                        className={cn('pointer-events-none', getBackgroundColor(selectedDay.name))}
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
                    <InputLabel htmlFor="section" value="Section" className="mb-1" />
                    <AutoCompleteSelect
                      label="Select Section"
                      value={data.section_id?.toString() ?? null}
                      setValue={(value: string) => {
                        setData('section_id', Number(value) ?? null)
                      }}
                      values={
                        props?.sections.map(section => {
                          return {
                            value: section.id.toString(),
                            label: `${getNumberWithOrdinal(section.SemesterNo)} - ${
                              section.name
                            } - ${section.SemesterName}`,
                          }
                        }) ?? []
                      }
                      isError={Boolean(errors.section_id)}
                    />
                    <InputError message={errors.section_id} />
                  </div>
                ) : null}

                {/* Rooms */}
                <div className="col-span-12 md:col-span-6">
                  <InputLabel htmlFor="room" value="Room" className="mb-1" />
                  <AutoCompleteSelect
                    label="Select Room"
                    value={data.room_id?.toString() ?? null}
                    setValue={(value: string) => {
                      setData('room_id', Number(value) ?? null)
                    }}
                    values={
                      filteredRooms?.map(room => {
                        return {
                          value: room.id.toString(),
                          label: room.name,
                        }
                      }) ?? []
                    }
                    isError={Boolean(errors.room_id)}
                  />
                  <InputError message={errors.room_id} />
                </div>

                {/* Teacher Id */}
                <div className="col-span-12 md:col-span-6">
                  <InputLabel htmlFor="teacher" value="Teacher" className="mb-1" />
                  <AutoCompleteSelect
                    label="Select Teacher"
                    value={data.teacher_id?.toString() ?? null}
                    setValue={(value: string) => {
                      setData('teacher_id', Number(value) ?? null)
                    }}
                    values={
                      props?.timetable?.shift?.institution?.teachers?.map(teacher => {
                        return {
                          value: teacher.id.toString(),
                          label: teacher.name,
                        }
                      }) ?? []
                    }
                    isError={Boolean(errors.teacher_id)}
                  />
                  <InputError message={errors.teacher_id} />
                </div>

                {/* Course Id */}
                <div className="col-span-12 md:col-span-6">
                  <InputLabel htmlFor="course" value="Course" className="mb-1" />

                  <AutoCompleteSelect
                    label="Select Course"
                    value={data.course_id?.toString() ?? null}
                    setValue={(value: string) => {
                      setData('course_id', Number(value) ?? null)
                    }}
                    values={
                      filteredCourse?.map(course => {
                        return {
                          value: course.id.toString(),
                          label: course.code,
                        }
                      }) ?? []
                    }
                    isError={Boolean(errors.course_id)}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="mt-4 flex justify-end gap-3">
              <Button variant={'outline'} onClick={handleClose}>
                Cancel
              </Button>
              <Button size={'sm'} className="px-4" onClick={submit} disabled={processing}>
                Save
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <DeleteAllocationDialog
        open={deleteAllocation !== null}
        onClose={() => {
          setDeleteAllocation(null), setDefaultValues()
        }}
        allocation_id={deleteAllocation ?? 0}
      />
    </AuthenticatedLayout>
  )
}
