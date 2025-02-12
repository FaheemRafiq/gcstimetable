import * as React from 'react'
import { format, isValid, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  yearRange?: {
    toYear?: number
    fromYear?: number
  }
  value?: Date | string | null
  onChange?: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  isError?: boolean
  customFormat?: string
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  showClearButton?: boolean
  popoverWidth?: string
  calendarClassName?: string
  clearButtonLabel?: string
  onPopoverOpenChange?: (open: boolean) => void
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className,
      value,
      onChange,
      yearRange,
      placeholder = 'Pick a date',
      disabled = false,
      isError,
      customFormat = 'PPP',
      minDate,
      maxDate,
      disabledDates = [],
      showClearButton = true,
      popoverWidth = 'w-auto',
      calendarClassName,
      clearButtonLabel = 'Clear',
      onPopoverOpenChange,
      ...props
    },
    ref
  ) => {
    const FROM_YEAR = 1950
    const TO_YEAR = 2050

    const validatedYearRange = {
      toYear: yearRange?.toYear ?? TO_YEAR,
      fromYear: yearRange?.fromYear ?? FROM_YEAR,
    }

    // Handle both string and Date values
    const parseDate = (value: Date | string | null | undefined): Date | undefined => {
      if (!value) return undefined
      if (value instanceof Date) return isValid(value) ? value : undefined
      return isValid(parse(value, 'yyyy-MM-dd', new Date()))
        ? parse(value, 'yyyy-MM-dd', new Date())
        : undefined
    }

    const [date, setDate] = React.useState<Date | undefined>(parseDate(value))
    const [isOpen, setIsOpen] = React.useState(false)

    const handleDateChange = (selectedDate: Date | undefined) => {
      setDate(selectedDate || undefined)
      if (onChange) {
        onChange(selectedDate || null)
      }
      setIsOpen(false)
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      handleDateChange(undefined)
    }

    const handlePopoverOpenChange = (open: boolean) => {
      setIsOpen(open)
      onPopoverOpenChange?.(open)
    }

    const isDateDisabled = (date: Date) => {
      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true
      return disabledDates.some(disabledDate => disabledDate.getTime() === date.getTime())
    }

    return (
      <div className={cn('relative', className)}>
        <Popover open={isOpen} onOpenChange={handlePopoverOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground',
                isError && 'border-red-500',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, customFormat) : <span>{placeholder}</span>}
              {showClearButton && date && (
                <div className="ml-auto h-auto p-0" onClick={handleClear}>
                  <span className="sr-only">{clearButtonLabel}</span>×
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className={cn('p-0', popoverWidth)}>
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={date}
              onSelect={handleDateChange}
              fromYear={validatedYearRange.fromYear}
              toYear={validatedYearRange.toYear}
              disabled={isDateDisabled}
              defaultMonth={date}
              className={calendarClassName}
            />
          </PopoverContent>
        </Popover>
        <input
          type="hidden"
          ref={ref}
          value={date ? format(date, 'yyyy-MM-dd') : ''}
          disabled={disabled}
          {...props}
        />
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

export default DatePicker
