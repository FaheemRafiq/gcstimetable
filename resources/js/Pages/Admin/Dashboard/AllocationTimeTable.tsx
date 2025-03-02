import React, { useState, useEffect, useMemo } from 'react'
import { Inertia } from '@inertiajs/inertia'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Clock, BookOpen, User, MapPin, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react'
import { Department, Slot, Allocation, Institution } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { PageProps } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import { DatePicker } from '@/components/inputs/date-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { format, parse } from 'date-fns'
import TimeInputField from '@/components/TimeInputField'
import { SuperAdminWrapper } from '@/Components/AdminWrapper'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface FormProps {
  shift_id: number | null
  start_time: string | null
  end_time: string | null
  selected_day: number | null
  institution_id: number | null
  [key: string]: any
}

type UpdatedSlot = Slot & {
  status: string
}

interface TimetableResponse {
  selected_day: number
  shift_id: number
  current_time: string
  time_window: {
    start: string
    end: string
  }
  departments: Department[]
  slots: UpdatedSlot[]
  institutions: Institution[]
}

function AllocationTimeTable({
  auth,
  initialData,
  institution,
}: PageProps<{ initialData: TimetableResponse; institution: Institution }>) {
  const [data, setData] = useState(initialData)
  const { setBreadcrumb } = useBreadcrumb()

  const {
    data: formData,
    setData: setFormData,
    get,
    processing,
    transform,
  } = useForm<FormProps>({
    shift_id: initialData.shift_id,
    start_time: format(initialData.time_window.start, 'H:m:s'),
    end_time: format(initialData.time_window.end, 'H:m:s'),
    selected_day: initialData.selected_day,
    institution_id: institution.id,
  })

  useEffect(() => {
    setBreadcrumb({
      title: 'Allocations',
    })
  }, [setBreadcrumb])

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'default'
      case 'upcoming':
        return 'secondary'
      case 'past':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const handleFilter = ({ refresh = false } = {}) => {
    transform(data => {
      return {
        ...data,
      }
    })

    get(route('allocations.index'), {
      preserveState: true,
      only: ['initialData'],
      onSuccess: page => {
        setData(page.props.initialData as TimetableResponse)
      },
    })
  }

  const resetFilters = () => {
    setFormData({
      shift_id: null,
      start_time: null,
      end_time: null,
      selected_day: null,
      institution_id: null,
    })
    handleFilter({ refresh: true })
  }

  const renderAllocationSection = (department: Department) => (
    <div key={department.id} className="space-y-6">
      <div className="border-b pb-2">
        <h2 className="text-xl font-semibold">{department.name}</h2>
      </div>

      {/* Allocations */}
      <div className="space-y-6">
        {department.programs?.map(program => (
          <div key={program.id} className="space-y-4">
            {program.semesters?.map(semester => (
              <div key={semester.id} className="space-y-2">
                {semester.sections?.map(section => (
                  <div key={section.id} className="flex flex-col md:flex-row gap-2">
                    <div className="w-full md:w-32 md:flex-shrink-0 lg:w-48 bg-muted p-2 rounded">
                      <div
                        className="text-sm font-medium truncate"
                        title={`${program.name} - ${semester.name} - ${section.name}`}
                      >
                        {program.name} - {semester.name} - {section.name}
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 relative">
                      {section.allocations?.map((allocation: Allocation) => (
                        <TooltipProvider key={allocation.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-blue-50 border border-blue-100 rounded p-2 hover:bg-blue-100 transition-all duration-200 group relative cursor-pointer">
                                <Badge
                                  variant={getStatusVariant(allocation.slot?.status ?? '')}
                                  className="absolute top-1 right-1 text-[10px]"
                                >
                                  {allocation.slot?.status ?? ''}
                                </Badge>
                                <div className="space-y-1">
                                  <div className="text-xs font-medium flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    <span className="truncate">{allocation?.course?.name}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span className="truncate">{allocation?.teacher?.name}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{allocation?.room?.name}</span>
                                  </div>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" />
                                  {allocation?.course?.name}
                                </h4>
                                <div className="text-xs space-y-1">
                                  <p className="flex items-center gap-2">
                                    <User className="h-3 w-3" />
                                    <span>Teacher: {allocation?.teacher?.name}</span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3" />
                                    <span>Room: {allocation?.room?.name}</span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {formatTime(allocation.slot?.start_time ?? '')} -
                                      {formatTime(allocation.slot?.end_time ?? '')}
                                    </span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                                    <span>Status: {allocation.slot?.status}</span>
                                  </p>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Allocations" />
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Allocations
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              <span className="text-xs">Last Fetched</span>{' '}
              {new Date(data.current_time).toLocaleTimeString()}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Showing: {new Date(data.time_window.start).toLocaleTimeString()} -{' '}
            {new Date(data.time_window.end).toLocaleTimeString()}
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters Section */}
          <div
            className={cn('mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', {
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-5': initialData.institutions.length > 1,
            })}
          >
            <div>
              <Label htmlFor="shift_id">Shift</Label>
              <Select
                value={formData.shift_id?.toString() || ''}
                onValueChange={value => setFormData('shift_id', value ? parseInt(value) : null)}
              >
                <SelectTrigger id="shift_id">
                  <SelectValue placeholder="Select Shift" />
                </SelectTrigger>
                <SelectContent>
                  {institution?.shifts?.map(shift => (
                    <SelectItem key={shift.id} value={shift.id.toString()}>
                      {shift.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <TimeInputField
                id="start_time"
                label="Start Time"
                value={formData.start_time}
                onChange={value => setFormData('start_time', value)}
                disabled={processing}
                className="w-full"
              />
            </div>

            <div>
              <TimeInputField
                id="end_time"
                label="End Time"
                value={formData.end_time}
                onChange={value => setFormData('end_time', value)}
                disabled={processing}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="selected_day">Day</Label>
              <Select
                value={formData.selected_day?.toString() || ''}
                onValueChange={value => setFormData('selected_day', value ? parseInt(value) : null)}
              >
                <SelectTrigger id="selected_day">
                  <SelectValue placeholder="Select Day" />
                </SelectTrigger>
                <SelectContent>
                  {institution?.days?.map(day => (
                    <SelectItem key={day.number} value={day.number.toString()}>
                      {day.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <SuperAdminWrapper>
              <div>
                <Label htmlFor="shift_id">Institution</Label>
                <Select
                  value={formData.institution_id?.toString() || ''}
                  onValueChange={value =>
                    setFormData('institution_id', value ? parseInt(value) : null)
                  }
                >
                  <SelectTrigger id="institution_id">
                    <SelectValue placeholder="Select Institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialData.institutions?.map(item => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SuperAdminWrapper>

            <div className="ml-auto flex gap-2 col-span-full">
              <Button onClick={() => handleFilter()} disabled={processing}>
                Apply Filters
              </Button>
              <Button variant="outline" onClick={resetFilters} disabled={processing}>
                Reset
              </Button>
            </div>
          </div>

          {data.departments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No allocations found matching the filters
            </div>
          ) : (
            <div className="space-y-12">
              <Separator />
              {/* Slots Header */}
              <ScrollArea className="w-full">
                <div className="flex items-center gap-10">
                  {data.slots.map(slot => (
                    <div key={slot.id} className="text-center">
                      <div className="text-xs font-medium capitalize">{slot.code}</div>
                      <div className="text-xs font-medium flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </div>
                      <Badge variant={getStatusVariant(slot.status)} className="mt-1 text-xs">
                        {slot.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <ScrollArea className="w-full">
                <div className="grid grid-cols-1 gap-10">
                  {data.departments.map(department => renderAllocationSection(department))}
                </div>

                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  )
}

export default AllocationTimeTable
