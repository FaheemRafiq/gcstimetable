import React, { Fragment, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from '@inertiajs/react'
import InputError from '@/Components/InputError'
import { toast } from 'react-toastify';
import { TimePickerDemo } from '@/components/time-picker/time-picker-input'
import { format } from 'date-fns'
import { Slot } from '@/types/database'
import { Switch } from '@/components/ui/switch'
import { FormSheet } from '@/Components/FormSheet'

interface FormProps {
  code: string
  start_time: string
  end_time: string
  is_practical: string
  shift_id: number
  [key: string] : any
}

interface SlotFormProps {
  slot?: Slot | null
  shiftId?: number
  open?: boolean
  onClose?: () => void
}

export const SlotForm: React.FC<SlotFormProps> = ({ slot, shiftId, open: openProp, onClose }) => {
  const isEditForm = !!slot

  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp)
    }
  }, [openProp])

  const { data, errors, processing, setData, post, reset, put } = useForm<FormProps>({
    code: slot?.code || '',
    start_time: slot?.start_time || '07:00:00',
    end_time: slot?.end_time || '08:00:00',
    is_practical: slot?.is_practical?.toString() || '0',
    shift_id: slot?.shift_id ?? shiftId ?? 0,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const method = isEditForm ? put : post
    const routeName = isEditForm ? 'slots.update' : 'slots.store'
    const routeParams = isEditForm && slot ? [slot.id] : []

    method(route(routeName, routeParams), {
      preserveState: true,
      onSuccess: () => {
        reset()
        setOpen(false)
        onClose?.()
      },
      onError: error => {
        if (error.message) {
          toast.error(error.message)
        }
      },
    })
  }

  const createDateWithTime = (timeString = '07:00:00') => {
    try {
      const today = new Date().toISOString().split('T')[0]
      return new Date(`${today}T${timeString}`)
    } catch {
      return new Date()
    }
  }

  const setTimeData = (key: keyof FormProps, date: Date | undefined) => {
    setData(key, date ? format(date, 'HH:mm:ss') : '')
  }

  function handleOpen(value: boolean) {
    setOpen(value)

    if (value === false) {
      onClose?.()
    }
  }

  return (
    <Fragment>
      {openProp === undefined && (
        <Button onClick={() => setOpen(true)} size="sm">
          {isEditForm ? 'Edit' : 'Create'} Slot
        </Button>
      )}
      <FormSheet
        open={open}
        setOpen={handleOpen}
        title={isEditForm ? 'Edit Time Slot : ' + slot.name : 'Create Time Slot'}
        description={`Fill the required fields to ${
          isEditForm ? 'edit' : 'create'
        } a time slot. Click save when you're done.`}
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
        <form id="roomForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Code Field */}
          <div>
            <Label htmlFor="code">
              Code
              <span className="ps-0.5 text-xs text-red-600">*</span>
            </Label>
            <Input
              id="code"
              type="text"
              value={data.code}
              placeholder="Enter slot code"
              onChange={e => setData('code', e.target.value)}
              required
            />
            <InputError message={errors.code} />
          </div>

          {/* Start Time Field */}
          <div>
            <Label htmlFor="start_time">
              Start Time
              <span className="ps-0.5 text-xs text-red-600">*</span>
            </Label>
            <div className="flex justify-center">
              <TimePickerDemo
                date={createDateWithTime(data.start_time)}
                setDate={date => setTimeData('start_time', date)}
              />
            </div>
            <InputError message={errors.start_time} />
          </div>

          {/* End Time Field */}
          <div>
            <Label htmlFor="end_time">
              End Time
              <span className="ps-0.5 text-xs text-red-600">*</span>
            </Label>
            <div className="flex justify-center">
              <TimePickerDemo
                date={createDateWithTime(data.end_time)}
                setDate={date => setTimeData('end_time', date)}
              />
            </div>
            <InputError message={errors.end_time} />
          </div>

          {/* Is Practical Field */}
          <div>
            <Label htmlFor="is_practical">Is Practical</Label>
            <div className="flex items-center gap-2">
              <Switch
                id="is_practical"
                checked={data.is_practical === '1'}
                onCheckedChange={checked => setData('is_practical', checked ? '1' : '0')}
              />
              <span>{data.is_practical === '1' ? 'Yes' : 'No'}</span>
            </div>
            <InputError message={errors.is_practical} />
          </div>
        </form>
      </FormSheet>
    </Fragment>
  )
}
