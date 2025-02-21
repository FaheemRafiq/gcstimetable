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
  User,
} from 'lucide-react'

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
import { formatTime, getNumberWithOrdinal } from '@/utils/helper'
import { getBackgroundColor } from '@/utils/dayHelper'
import { cn } from '@/lib/utils'
import { toast } from 'react-toastify'
import DeleteAllocationDialog from './DeleteAllocationDialog'
import DayCard from './DayCard'
import Information from './Information'
import { CreateAllocationProps, getSectionLabel, ModifiedSection } from '../create_claude'
import { Allocation, Day } from '@/types/database'
import { AxiosWrapper, fetchWrapper } from '@/lib/fetchWrapper'
import BulkMessage from './BulkMessages'
import DeleteConfirmationDialog from '@/Components/Dialog/DeleteConfirmationDialog'

interface UnCommonProps {
  day_id: number | null
  room_id: number | null
  teacher_id: number | null
  course_id: number | null
  allocation_id: number | null
}

interface FormProps {
  time_table_id: number
  slot_id: number
  section_id: number | null
  allocations_data: UnCommonProps[]
  selected_days: number[]
  [key: string]: any
}

export interface ResponseMessage {
  success: boolean
  day_id: number
  message: string
}

type SuccessResponse = {
  allocation: Allocation
  message: string
}

type FailedResponse = {
  day_id: number
  message: string
}

interface MultipleCreateForm extends CreateAllocationProps {}

function MultipleCreateForm({ props }: MultipleCreateForm) {
  const BACK_ROUTE = route('timetables.add.allocations', props.timetable.id)

  const [openDelete, setOpenDelete] = useState(false)
  const [deleteAllocations, setDeleteAllocations] = useState<UnCommonProps[]>([])
  const [deleting, setDeleting] = useState(false)

  const [saving, setSaving] = useState(false)
  const [bulkMessages, setBulkMessages] = useState<ResponseMessage[]>([])

  const { data, setData, errors, clearErrors, setError } = useForm<FormProps>({
    time_table_id: props?.timetable?.id,
    slot_id: props?.slot?.id,
    section_id: props?.sections.length > 1 ? null : props?.sections[0]?.id,
    allocations_data: [],
    selected_days: [],
  })

  console.log('data', data)

  function handleOpenDelete() {
    console.log('delete')
    if (data.allocations_data.length > 0) {
      let validAllocations = data.allocations_data.filter(
        allocation => allocation.allocation_id !== undefined && allocation.allocation_id !== null
      )

      if (validAllocations.length > 0) {
        setDeleteAllocations(validAllocations)
        setOpenDelete(true)
      } else {
        toast.error('Allocations are not in the database')
      }
    } else {
      toast.error('Please select at least one allocation')
    }
  }

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

  const selectedDays = useMemo(() => {
    return props?.timetable?.shift?.institution?.days?.filter(day =>
      data.selected_days.includes(day.id)
    )
  }, [data.selected_days])

  const allocationData = useMemo(() => {
    return data.allocations_data.find(allocation => allocation.day_id)
  }, [data.allocations_data, data.selected_days])

  const submit: FormEventHandler = e => {
    e.preventDefault()
    setSaving(true)

    setBulkMessages([])
    AxiosWrapper({
      url: route('allocations.bulk.store'),
      method: 'POST',
      body: data,
    })
      .then(response => {
        if (response.status === 200) {
          const { data } = response

          if (data.success && data.success.length > 0) {
            let messages: ResponseMessage[] = data.success.map((res: SuccessResponse) => {
              return {
                success: true,
                day_id: res.allocation.day_id,
                message: res.message,
              }
            })

            setBulkMessages(messages)

            setTimeout(() => {
              fetchDataAgain()
            }, 5000)
          }

          if (data.message) {
            toast.success(data.message)
          }
        }
      })
      .catch(error => {
        const { response } = error

        if (error.status === 422) {
          if (response.data.errors && response.data.errors.section_id) {
            setError('section_id', response.data.errors.section_id)
          } else if (response.data.message) {
            setError('section_id', '')
            toast.error(response.data.message)
          }

          if (response.data.failed && response.data.failed.length > 0) {
            let messages: ResponseMessage[] = response.data.failed.map((res: FailedResponse) => {
              return {
                success: false,
                day_id: res.day_id,
                message: res.message,
              }
            })

            setBulkMessages(messages)
          }
        } else {
          setError('section_id', '')
          toast.error(error?.response?.data?.message ?? 'Something went wrong!')
        }
      })
      .finally(() => {
        setSaving(false)
      })
  }

  const bulkDestroy = () => {
    setDeleting(true)
    AxiosWrapper({
      url: route('allocations.bulk.destroy'),
      method: 'DELETE',
      body: {
        allocations_data: deleteAllocations,
      },
    })
      .then(response => {
        if (response.status === 200) {
          const { data } = response

          toast.success(data.message)
          setBulkMessages([])
          setDeleteAllocations([])
          fetchDataAgain()
        }
      })
      .catch(error => {
        toast.error(error?.response?.data?.message ?? 'Something went wrong!')
      })
      .finally(() => {
        setDeleting(false)
      })
  }

  function fetchDataAgain() {
    const params: any = {
      time_table_id: data.time_table_id,
      slot_id: data.slot_id,
      section_id: data.section_id,
    }
    router.get(route('allocations.create'), params)
  }

  function getDayAllocation(dayId: number) {
    return props.allocations.find(allocation => allocation.day_id === dayId)
  }

  function handleOnDayCardClick(day: Day, allocation: UnCommonProps | Allocation | undefined) {
    let allocationId = null
    let alreadySelectedDay = false

    if (allocation && 'id' in allocation) {
      allocationId = allocation.id
    }

    if (data.selected_days.includes(day.id)) {
      alreadySelectedDay = true

      console.log('allocation', allocation, allocation && !('id' in allocation))
      if (allocation && !('id' in allocation)) {
        allocation = undefined
      }
    }

    let allocations_data = alreadySelectedDay
      ? data.allocations_data.filter(allocation => allocation.day_id !== day.id)
      : [
          ...data.allocations_data,
          {
            day_id: day.id,
            room_id: allocation?.room_id ?? null,
            teacher_id: allocation?.teacher_id ?? null,
            course_id: allocation?.course_id ?? null,
            allocation_id: allocationId,
          },
        ]

    setData({
      ...data,
      allocations_data: allocations_data,
      selected_days: alreadySelectedDay
        ? data.selected_days.filter(id => id !== day.id)
        : [...data.selected_days, day.id],
    })
    clearErrors()
  }

  function handleAllocationData(key: string, value: any) {
    // now update the selected days of allocation data
    setData(data => ({
      ...data,
      allocations_data: data.allocations_data.map(allocation => {
        if (allocation.day_id && data.selected_days.includes(allocation.day_id)) {
          return {
            ...allocation,
            [key]: value,
          }
        }
        return allocation
      }),
    }))
  }

  return (
    <Fragment>
      <div className="container mx-auto py-6">
        {bulkMessages && bulkMessages.length > 0 && (
          <div className="mb-4">
            <BulkMessage
              messages={bulkMessages}
              days={props.timetable.shift.institution.days ?? []}
            />
          </div>
        )}
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
              <CardDescription>Select a day to manage its allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-20rem)]">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-1">
                  {props?.timetable?.shift?.institution?.days?.map(day => {
                    const allocation = getDayAllocation(day.id)
                    const isSelected = data.selected_days.includes(day.id)
                    const filledDay = data.allocations_data.find(
                      allocation => allocation.day_id === day.id
                    )
                    let allocationUpdated = false

                    if (isSelected && allocation) {
                      if (
                        allocation.room_id !== filledDay?.room_id ||
                        allocation.teacher_id !== filledDay?.teacher_id ||
                        allocation.course_id !== filledDay?.course_id
                      ) {
                        allocationUpdated = true
                      }
                    }

                    return (
                      <DayCard
                        key={day.id}
                        day={day}
                        selected={isSelected}
                        onClick={() => {
                          handleOnDayCardClick(day, {
                            day_id: day.id,
                            course_id: allocationData?.course_id ?? allocation?.course_id ?? null,
                            teacher_id:
                              allocationData?.teacher_id ?? allocation?.teacher_id ?? null,
                            room_id: allocationData?.room_id ?? allocation?.room_id ?? null,
                            allocation_id: allocationData?.allocation_id ?? allocation?.id ?? null,
                            id: allocation?.id,
                          })
                        }}
                      >
                        <div className="pt-12 px-4 pb-4">
                          {allocation && allocationUpdated == false ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Book className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">
                                  {allocation.course?.display_code}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                <span className="text-sm">{allocation.teacher?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-sm">{allocation.room?.name}</span>
                              </div>
                            </div>
                          ) : filledDay?.course_id ||
                            filledDay?.teacher_id ||
                            filledDay?.room_id ? (
                            <div className="space-y-2">
                              {filledDay?.course_id && (
                                <div className="flex items-center gap-2">
                                  <Book className="w-4 h-4 text-primary" />
                                  <span className="text-sm">
                                    {
                                      props?.courses.find(
                                        course => course.id === filledDay.course_id
                                      )?.display_code
                                    }
                                  </span>
                                </div>
                              )}
                              {filledDay?.teacher_id && (
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-primary" />
                                  <span className="text-sm">
                                    {
                                      props?.timetable?.shift?.institution?.teachers?.find(
                                        teacher => teacher.id === filledDay.teacher_id
                                      )?.name
                                    }
                                  </span>
                                </div>
                              )}
                              {filledDay?.room_id && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  <span className="text-sm">
                                    {
                                      props?.timetable?.shift?.institution?.rooms?.find(
                                        room => room.id === filledDay.room_id
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

                    {selectedDays && selectedDays.length > 0 ? (
                      <Information
                        icon={CalendarDays}
                        title="Day"
                        value={selectedDays.map(day => day.name).join(', ')}
                        jsxValue={
                          <span className="flex items-center gap-2">
                            {selectedDays.map(selectedDay => (
                              <Badge
                                key={selectedDay.id}
                                className={cn(
                                  'pointer-events-none',
                                  getBackgroundColor(selectedDay.name)
                                )}
                              >
                                {selectedDay.name}
                              </Badge>
                            ))}
                          </span>
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
                      <DropdownMenuItem
                        disabled={data.allocations_data.length === 0}
                        onClick={() => handleOpenDelete()}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {props.haveSection === false && (
                    <div className="space-y-2">
                      <InputLabel htmlFor="section">Section</InputLabel>
                      <AutoCompleteSelect
                        label="Select Section"
                        value={data.section_id?.toString() ?? ''}
                        setValue={value => setData('section_id', Number(value))}
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
                      value={allocationData?.room_id?.toString() ?? ''}
                      setValue={value => handleAllocationData('room_id', Number(value))}
                      values={filteredRooms.map(room => ({
                        value: room.id.toString(),
                        label: room.name,
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <InputLabel htmlFor="teacher">Teacher</InputLabel>
                    <AutoCompleteSelect
                      label="Select Teacher"
                      value={allocationData?.teacher_id?.toString() ?? ''}
                      setValue={value => handleAllocationData('teacher_id', Number(value))}
                      values={
                        props?.timetable?.shift?.institution?.teachers?.map(teacher => ({
                          value: teacher.id.toString(),
                          label: teacher.name,
                        })) ?? []
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <InputLabel htmlFor="course">Course</InputLabel>
                    <AutoCompleteSelect
                      label="Select Course"
                      value={allocationData?.course_id?.toString() ?? ''}
                      setValue={value => handleAllocationData('course_id', Number(value))}
                      values={filteredCourse.map(course => ({
                        value: course.id.toString(),
                        label: course.code,
                      }))}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.get(BACK_ROUTE)}>
                  Cancel
                </Button>
                <Button onClick={submit} disabled={saving}>
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={() => bulkDestroy()}
        title="Delete Allocations?"
        message="Once an allocations is deleted, it cannot be recovered. Are you sure you want to delete these allocations?"
        confirmButtonLabel="Delete Allocations"
        cancelButtonLabel="Cancel"
        processing={deleting}
      />
    </Fragment>
  )
}

export default MultipleCreateForm
