import React from 'react'
import { cn } from '@/lib/utils'
import { ClockIcon } from 'lucide-react'
import { TimeField, DateInput } from '@/components/ui/datefield-rac'
import { Label } from 'react-aria-components'
import { Time } from '@internationalized/date' // Already part of react-aria-components
import { format } from 'date-fns'

interface DynamicTimeInputProps {
  id?: string
  label?: string
  value?: string | null // Expects 'HH:mm:ss' or null
  onChange?: (value: string | null) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export const TimeInputField: React.FC<DynamicTimeInputProps> = ({
  id,
  label = 'Time',
  value,
  onChange,
  disabled = false,
  className,
  placeholder = 'Select time',
}) => {
  // Convert HH:mm:ss string to Time object, handle undefined explicitly
  const parseTimeValue = (timeStr: string | null | undefined): Time | null => {
    if (!timeStr) return null
    const [hours, minutes, seconds] = timeStr.split(':').map(Number)
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null
    return new Time(hours, minutes, seconds)
  }
  // Convert Time object to HH:mm:ss string
  const formatTimeValue = (time: Time | null): string | null => {
    if (!time) return null
    return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}:${time.second.toString().padStart(2, '0')}`
  }

  return (
    <TimeField
      id={id}
      className={cn('*:not(:first-child):mt-2', className)}
      value={parseTimeValue(value)}
      onChange={time => onChange?.(formatTimeValue(time))}
      isDisabled={disabled}
    >
      <Label className="text-foreground text-sm font-medium">{label}</Label>
      <div className="relative">
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3">
          <ClockIcon size={16} aria-hidden="true" />
        </div>
        <DateInput className="ps-9" />
      </div>
    </TimeField>
  )
}

TimeInputField.displayName = 'TimeInputField'

export default TimeInputField
