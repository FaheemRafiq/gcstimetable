import React, { useState } from 'react'
import { format, addMinutes, differenceInMinutes } from 'date-fns'
import _ from 'lodash'
import { Events } from '@/types/time-table-events'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { getBackgroundColor } from '@/utils/dayHelper'
import { Timer } from 'lucide-react'

const TimeTableEvents = ({ events }: { events: Events }) => {
  // State
  const [startsFrom, setStartsFrom] = useState(7) // 7 AM
  const [endsAt, setEndsAt] = useState(23) // 7 AM to 11 PM
  const [timeSlot, setTimeSlot] = useState(20) // 20 minutes time slot for each event

  // Constants
  const rowHeight = 3 // 3rem per slot
  const OneHoursInMinutes = 60 // 60 minutes in an hour

  const timeSlots = _.range(
    startsFrom * OneHoursInMinutes,
    endsAt * OneHoursInMinutes + 1,
    timeSlot
  ).map(minutes => ({
    label: format(addMinutes(new Date(2022, 0, 1, 0, 0), minutes), 'HH:mm'),
    minutes,
  }))

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  const ensureDate = (value: any): Date => {
    if (value instanceof Date) {
      return value
    }
    return new Date(value)
  }

  return (
    <ScrollArea className="w-full h-full bg-background text-foreground sm:rounded-lg shadow-md">
      {/* Header with Days */}
      <div className="flex">
        <div className="w-16 text-center self-center sticky top-0 bg-background z-10">Time</div>
        {days.map(day => (
          <div
            key={day}
            className="flex-1 text-center py-2 border-b font-medium capitalize sticky top-0 bg-background z-10"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Time Slots with Events */}
      <div className="flex">
        {/* Time Column */}
        <div className="flex flex-col w-16 border-r sticky left-0 bg-background z-10">
          {timeSlots.map(slot => (
            <div
              key={slot.minutes}
              className={cn('text-xs font-medium flex items-center justify-center border-b')}
              style={{ height: `${rowHeight}rem` }}
            >
              {slot.label}
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {days.map(day => (
          <div key={day} className="flex-1 border-r relative">
            {/* Time Slots */}
            {timeSlots.map(slot => (
              <div key={slot.minutes} className="h-12 border-b"></div>
            ))}

            {/* Events */}
            {events[day]?.map((event, index) => {
              const startMinutes =
                ensureDate(event.startTime).getHours() * OneHoursInMinutes +
                ensureDate(event.startTime).getMinutes()
              const endMinutes =
                ensureDate(event.endTime).getHours() * OneHoursInMinutes +
                ensureDate(event.endTime).getMinutes()

              const startSlot = (startMinutes - startsFrom * OneHoursInMinutes) / timeSlot // Map to 20-min slots
              const duration = (endMinutes - startMinutes) / timeSlot // Convert to slots

              return (
                <div
                  key={event.id}
                  className={cn(
                    'absolute rounded shadow-md text-xs p-2',
                    'w-[95%]',
                    getBackgroundColor(day)
                  )}
                  style={{
                    top: `${startSlot * rowHeight}rem`, // Height per slot = 3rem
                    height: `${duration * rowHeight}rem`, // Duration in slots * height
                    left: '2.5%', // Centered horizontally
                  }}
                >
                  <div className="flex justify-between">
                    <span className="text-xs">{event.name}</span>
                    <span className="text-xs flex items-center">
                      <Timer size={16} />
                      {differenceInMinutes(
                        ensureDate(event.endTime),
                        ensureDate(event.startTime)
                      )}{' '}
                      mins
                    </span>
                  </div>
                  {event.type && <div className="text-xs">{event.type}</div>}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}

export default TimeTableEvents
