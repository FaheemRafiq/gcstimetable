import React, { useState } from 'react'
import { format, addMinutes, differenceInMinutes } from 'date-fns'
import _ from 'lodash'
import { Events } from '@/types/time-table-events'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { getBackgroundColor } from '@/utils/dayHelper'
import { Timer, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'

const TimeTableEvents = ({ events }: { events: Events }) => {
  // State
  const [startsFrom, setStartsFrom] = useState(7) // 7 AM
  const [endsAt, setEndsAt] = useState(23) // 7 AM to 11 PM
  const [timeSlot, setTimeSlot] = useState(20) // 20 minutes time slot for each event
  const [currentDayIndex, setCurrentDayIndex] = useState(0)

  // Media query for responsive design
  const isDesktop = !useIsMobile()

  // Constants
  const rowHeight = isDesktop ? 3 : 4 // Larger touch targets on mobile
  const OneHoursInMinutes = 60

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

  // Mobile navigation handlers
  const nextDay = () => {
    setCurrentDayIndex(prev => (prev + 1) % days.length)
  }

  const previousDay = () => {
    setCurrentDayIndex(prev => (prev - 1 + days.length) % days.length)
  }

  // Mobile view component
  const MobileView = () => (
    <div className="flex flex-col h-full">
      {/* Mobile Day Navigation */}
      <div className="flex items-center justify-between p-2 bg-background sticky top-0 z-20 border-b">
        <Button variant="ghost" size="icon" onClick={previousDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium capitalize">{days[currentDayIndex]}</h2>
        <Button variant="ghost" size="icon" onClick={nextDay}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Time Slots with Events */}
      <div className="flex flex-1">
        {/* Time Column */}
        <div className="w-16 flex flex-col border-r sticky left-0 bg-background z-10">
          {timeSlots.map(slot => (
            <div
              key={slot.minutes}
              className="text-xs font-medium flex items-center justify-center border-b"
              style={{ height: `${rowHeight}rem` }}
            >
              {slot.label}
            </div>
          ))}
        </div>

        {/* Events Column */}
        <div className="flex-1 relative">
          {/* Time Slots Background */}
          {timeSlots.map(slot => (
            <div key={slot.minutes} style={{ height: `${rowHeight}rem` }} className="border-b" />
          ))}

          {/* Events */}
          {events[days[currentDayIndex]]?.map(event => {
            const startMinutes =
              ensureDate(event.startTime).getHours() * OneHoursInMinutes +
              ensureDate(event.startTime).getMinutes()
            const endMinutes =
              ensureDate(event.endTime).getHours() * OneHoursInMinutes +
              ensureDate(event.endTime).getMinutes()

            const startSlot = (startMinutes - startsFrom * OneHoursInMinutes) / timeSlot
            const duration = (endMinutes - startMinutes) / timeSlot

            return (
              <div
                key={event.id}
                className={cn(
                  'absolute rounded-lg shadow-md p-3',
                  'w-[95%] left-[2.5%]',
                  getBackgroundColor(days[currentDayIndex])
                )}
                style={{
                  top: `${startSlot * rowHeight}rem`,
                  height: `${duration * rowHeight}rem`,
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">{event.name}</span>
                  <span className="text-xs flex items-center">
                    <Timer size={16} className="mr-1" />
                    {differenceInMinutes(
                      ensureDate(event.endTime),
                      ensureDate(event.startTime)
                    )}{' '}
                    mins
                  </span>
                </div>
                {event.type && <div className="text-xs mt-1">{event.type}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // Desktop view component
  const DesktopView = () => (
    <>
      {/* Header with Days */}
      <div className="flex sticky top-0 bg-background z-10 border-b">
        <div className="w-16 text-center self-center">Time</div>
        {days.map(day => (
          <div key={day} className="flex-1 text-center py-2 font-medium capitalize">
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
              className="text-xs font-medium flex items-center justify-center border-b"
              style={{ height: `${rowHeight}rem` }}
            >
              {slot.label}
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {days.map(day => (
          <div key={day} className="flex-1 border-r relative">
            {timeSlots.map(slot => (
              <div key={slot.minutes} style={{ height: `${rowHeight}rem` }} className="border-b" />
            ))}

            {events[day]?.map(event => {
              const startMinutes =
                ensureDate(event.startTime).getHours() * OneHoursInMinutes +
                ensureDate(event.startTime).getMinutes()
              const endMinutes =
                ensureDate(event.endTime).getHours() * OneHoursInMinutes +
                ensureDate(event.endTime).getMinutes()

              const startSlot = (startMinutes - startsFrom * OneHoursInMinutes) / timeSlot
              const duration = (endMinutes - startMinutes) / timeSlot

              return (
                <div
                  key={event.id}
                  className={cn(
                    'absolute rounded shadow-md text-xs p-2',
                    'w-[95%] left-[2.5%]',
                    getBackgroundColor(day)
                  )}
                  style={{
                    top: `${startSlot * rowHeight}rem`,
                    height: `${duration * rowHeight}rem`,
                  }}
                >
                  <div className="flex justify-between">
                    <span>{event.name}</span>
                    <span className="flex items-center">
                      <Timer size={16} className="mr-1" />
                      {differenceInMinutes(
                        ensureDate(event.endTime),
                        ensureDate(event.startTime)
                      )}{' '}
                      mins
                    </span>
                  </div>
                  {event.type && <div className="mt-1">{event.type}</div>}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </>
  )

  return (
    <ScrollArea className="w-full h-[calc(100vh-200px)] bg-background text-foreground sm:rounded-lg shadow-md">
      {isDesktop ? <DesktopView /> : <MobileView />}
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default TimeTableEvents
