import { FormEventHandler, Fragment, useEffect, useMemo, useState } from 'react'
import { router, useForm, Link } from '@inertiajs/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AutoCompleteSelect } from '@/components/combobox'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'
import {
  ArrowLeftRight,
  Book,
  CalendarDays,
  EllipsisVertical,
  Group,
  MapPin,
  MoveDown,
  Table,
  TimerIcon,
  Trash,
  User
} from 'lucide-react'
import { formatTime, getNumberWithOrdinal } from '@/utils/helper'
import { getBackgroundColor } from '@/utils/dayHelper'
import { cn } from '@/lib/utils'
import { toast } from 'react-toastify';
import DeleteAllocationDialog from './DeleteAllocationDialog'
import DayCard from './DayCard'
import Information from './Information'
import { CreateAllocationProps, getSectionLabel, ModifiedSection } from '../create_claude'

interface FormProps {
  time_table_id: number
  slot_id: number
  day_id: number | null
  section_id: number | null
  room_id: number | null
  teacher_id: number | null
  course_id: number | null
  allocation_id: number | null
}

interface SingleCreateForm extends CreateAllocationProps {}


function SingleCreateForm({ props }: SingleCreateForm) {

  const BACK_ROUTE = route('timetables.add.allocations', props.timetable.id)
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

  useEffect(() => {
    setDefaultValues();
  }, []);

  const filteredCourse = useMemo(() => {
    if (!data.section_id) return []
    const semester = props?.sections?.find(section => section.id === data.section_id)
    return props?.courses?.filter(course =>
      course.semesters?.find(sem => sem.id === semester?.SemesterId)
    )
  }, [data.section_id])

  const filteredRooms = useMemo(() => {
    if (!data.section_id) return []
    const semester = props?.sections?.find(section => section.id === data.section_id)
    return (props?.timetable?.shift?.institution?.rooms || []).filter(
      room => semester?.ProgramType === room?.type || room?.type === 'BOTH'
    )
  }, [data.section_id])

  const selectedDay = useMemo(() => {
    return props?.timetable?.shift?.institution?.days?.find(day => day.id === data.day_id)
  }, [data.day_id])

  const allocatedDays = useMemo(() => {
    return props.allocations.map(allocation => allocation.day_id)
  }, [props.allocations])

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
      const monday = props?.timetable?.shift?.institution?.days?.find(
        day => day.name === 'Monday'
      )
      setData('day_id', monday?.id ?? null)
    }
  }

  const submit: FormEventHandler = e => {
    e.preventDefault()

    if (data.allocation_id) {
      put(route('allocations.update', data.allocation_id))
    } else {
      post(route('allocations.store'), {
        preserveState: true,
        onSuccess: () => setDefaultValues(),
        onError: error => error.message && toast.error(error.message),
      })
    }
  }

  function getDayAllocation(dayId: number) {
    return props.allocations.find(allocation => allocation.day_id === dayId)
  }

  return (
    <Fragment>
      <div className="container mx-auto py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Schedule View */}
          <Card className="flex-1">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle>Schedule View</CardTitle>
                <Badge variant="outline" className="font-normal">
                  {formatTime(props?.slot?.start_time)} - {formatTime(props?.slot?.end_time)}
                </Badge>
              </div>
              <CardDescription>
                Select a day to manage its allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-1">
                  {props?.timetable?.shift?.institution?.days?.map(day => {
                    const allocation = getDayAllocation(day.id)
                    const isSelected = data.day_id === day.id &&
                      data.allocation_id === (allocation ? allocation.id : null)

                    return (
                      <DayCard
                        key={day.id}
                        day={day}
                        selected={isSelected}
                        onClick={() => {
                          setData({
                            ...data,
                            day_id: day.id,
                            allocation_id: allocation?.id ?? null,
                            room_id: allocation?.room_id ?? null,
                            teacher_id: allocation?.teacher_id ?? null,
                            course_id: allocation?.course_id ?? null,
                          })
                          clearErrors()
                        }}
                      >
                        <div className="pt-12 px-4 pb-4">
                          {allocation ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Book className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">
                                  {allocation.course?.display_code}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                <span className="text-sm">
                                  {allocation.teacher?.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-sm">
                                  {allocation.room?.name}
                                </span>
                              </div>
                            </div>
                          ) : (data.course_id || data.teacher_id || data.room_id) &&
                            data.day_id === day.id ? (
                            <div className="space-y-2">
                              {data.course_id && (
                                <div className="flex items-center gap-2">
                                  <Book className="w-4 h-4 text-primary" />
                                  <span className='text-sm'>
                                    {
                                      props?.courses.find(course => course.id === data.course_id)
                                        ?.display_code
                                    }
                                  </span>
                                </div>
                              )}
                              {data.teacher_id && (
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-primary" />
                                  <span className='text-sm'>
                                    {
                                      props?.timetable?.shift?.institution?.teachers?.find(
                                        teacher => teacher.id === data.teacher_id
                                      )?.name
                                    }
                                  </span>
                                </div>
                              )}
                              {data.room_id && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <span className='text-sm'>
                                    {
                                      props?.timetable?.shift?.institution?.rooms?.find(
                                        room => room.id === data.room_id
                                      )?.name
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                              Click to add allocation
                            </div>
                          )}
                        </div>
                      </DayCard>
                    )
                  })}

                  <div className="col-span-1 md:col-span-2 xl:col-span-3 border-border bg-background p-4 rounded-md">
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
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Details Form */}
          <div className="w-full lg:w-[400px]">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Allocation Details</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger
                          disabled={allocatedDays.length === 0}
                        >
                          <ArrowLeftRight className="mr-2 h-4 w-4" />
                          <span>Copy From</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {allocatedDays.map(dayId => {
                              const allocation = getDayAllocation(dayId)
                              return (
                                <DropdownMenuItem
                                  key={dayId}
                                  onClick={() => {
                                    setData({
                                      ...data,
                                      room_id: allocation?.room_id ?? null,
                                      teacher_id: allocation?.teacher_id ?? null,
                                      course_id: allocation?.course_id ?? null,
                                    })
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
                        disabled={!data.allocation_id}
                        onClick={() => setDeleteAllocation(data.allocation_id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent>
                <form onSubmit={submit} className="space-y-4">
                  {props.haveSection === false && (
                    <div className="space-y-2">
                      <InputLabel htmlFor="section">Section</InputLabel>
                      <AutoCompleteSelect
                        label="Select Section"
                        value={data.section_id?.toString() ?? ''}
                        setValue={(value) => setData('section_id', Number(value))}
                        values={props?.sections.map(section => ({
                          value: section.id.toString(),
                          label: getSectionLabel(section),
                        }))}
                        isError={Boolean(errors.section_id)}
                      />
                      <InputError message={errors.section_id} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <InputLabel htmlFor="room">Room</InputLabel>
                    <AutoCompleteSelect
                      label="Select Room"
                      value={data.room_id?.toString() ?? ''}
                      setValue={(value) => setData('room_id', Number(value))}
                      values={filteredRooms.map(room => ({
                        value: room.id.toString(),
                        label: room.name,
                      }))}
                      isError={Boolean(errors.room_id)}
                    />
                    <InputError message={errors.room_id} />
                  </div>

                  <div className="space-y-2">
                    <InputLabel htmlFor="teacher">Teacher</InputLabel>
                    <AutoCompleteSelect
                      label="Select Teacher"
                      value={data.teacher_id?.toString() ?? ''}
                      setValue={(value) => setData('teacher_id', Number(value))}
                      values={props?.timetable?.shift?.institution?.teachers?.map(teacher => ({
                        value: teacher.id.toString(),
                        label: teacher.name,
                      })) ?? []}
                      isError={Boolean(errors.teacher_id)}
                    />
                    <InputError message={errors.teacher_id} />
                  </div>

                  <div className="space-y-2">
                    <InputLabel htmlFor="course">Course</InputLabel>
                    <AutoCompleteSelect
                      label="Select Course"
                      value={data.course_id?.toString() ?? ''}
                      setValue={(value) => setData('course_id', Number(value))}
                      values={filteredCourse.map(course => ({
                        value: course.id.toString(),
                        label: course.code,
                      }))}
                      isError={Boolean(errors.course_id)}
                    />
                    <InputError message={errors.course_id} />
                  </div>
                </form>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.get(BACK_ROUTE)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={submit}
                  disabled={processing}
                >
                  {data.allocation_id ? 'Update' : 'Create'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <DeleteAllocationDialog
        open={deleteAllocation !== null}
        onClose={() => {
          setDeleteAllocation(null), setDefaultValues()
        }}
        allocation_id={deleteAllocation ?? 0}
      />
    </Fragment>
  )
}

export default SingleCreateForm;