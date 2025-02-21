import React, { useEffect } from 'react'
import { FormEventHandler } from 'react'
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
import TextInput from '@/Components/TextInput'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/inputs/date-picker'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, FileText, Users } from 'lucide-react'

interface FormProps {
  title: string
  description: string
  shift_id: number | null
  start_date: string
  end_date: string
  [key: string]: any
}

interface TimeTableFormProps {
  timetable?: TimeTable
  shifts: Shift[]
}

function TimeTableForm({ timetable, shifts }: TimeTableFormProps) {
  const isEditPage = !!timetable

  const { data, setData, post, put, errors, processing, reset } = useForm<FormProps>({
    title: timetable?.title ?? '',
    description: timetable?.description ?? '',
    shift_id: timetable?.shift_id ?? null,
    start_date: timetable?.start_date ?? '',
    end_date: timetable?.end_date ?? '',
  })

  useEffect(() => {
    if (timetable) {
      setData(data => {
        return {
          ...data,
          title: timetable.title,
          description: timetable.description,
          shift_id: timetable.shift_id,
          start_date: getStringDate(new Date(timetable.start_date)),
          end_date: getStringDate(new Date(timetable.end_date)),
        }
      })
    }
  }, [timetable])

  const submit: FormEventHandler = e => {
    e.preventDefault()

    const method = isEditPage ? put : post
    const url = isEditPage ? route('timetables.update', timetable?.id) : route('timetables.store')

    method(url, {
      preserveState: true,
      onSuccess: () => {
        reset('title', 'description')
      },
    })
  }

  function handleClose() {
    router.get(route('timetables.index'))
  }

  function getStringDate(date: Date | null): string {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Title Field */}
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <InputLabel htmlFor="title" value="Title" className="font-medium" />
                </div>
                <TextInput
                  autoFocus
                  className="w-full"
                  id="title"
                  placeholder="e.g., Time Table for BSIT 3rd year"
                  value={data.title}
                  onChange={e => setData('title', e.target.value)}
                  required
                />
                <InputError message={errors.title} />
              </div>

              {/* Shift Selection */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <InputLabel htmlFor="shift" value="Shift" className="font-medium" />
                </div>
                <Select
                  name="shift"
                  defaultValue={data.shift_id?.toString() || ''}
                  onValueChange={value => setData('shift_id', Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts?.map(shift => (
                      <SelectItem key={shift.id} value={shift.id.toString()}>
                        {shift.name} - {shift.program_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.shift_id} />
              </div>

              {/* Date Range */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <InputLabel value="Date Range" className="font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <DatePicker
                      className="w-full"
                      id="start_date"
                      value={data.start_date}
                      onChange={date => setData('start_date', getStringDate(date))}
                      isError={Boolean(errors.start_date)}
                      required
                      placeholder="Start Date"
                    />
                    <InputError message={errors.start_date} />
                  </div>
                  <div>
                    <DatePicker
                      className="w-full"
                      id="end_date"
                      value={data.end_date}
                      onChange={date => setData('end_date', getStringDate(date))}
                      isError={Boolean(errors.end_date)}
                      required
                      placeholder="End Date"
                    />
                    <InputError message={errors.end_date} />
                  </div>
                </div>
              </div>

              {/* Description Field */}
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <InputLabel htmlFor="description" value="Description" className="font-medium" />
                </div>
                <Textarea
                  className="w-full min-h-[120px]"
                  id="description"
                  placeholder="Enter a detailed description of the time table..."
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  required
                />
                <InputError message={errors.description} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing} className="w-full md:w-auto">
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default TimeTableForm
