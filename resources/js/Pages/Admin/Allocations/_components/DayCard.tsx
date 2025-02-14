import React from 'react'
import { cn } from '@/lib/utils'
import { Day } from '@/types/database'
import {
  getBackgroundColor
} from '@/utils/dayHelper'
import { Badge } from '@/components/ui/badge'

type DayCardProps = {
  day: Day
  selected: boolean
  children: React.ReactNode
  onClick: () => void
}

const DayCard = ({ day, selected, children, onClick }: DayCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative h-full min-h-[150px] rounded-lg border transition-all duration-200",
        "hover:shadow-md hover:border-primary/50",
        selected ? "border-primary bg-primary/5" : "border-border bg-background"
      )}
    >
      <div className="absolute top-2 left-2">
        <Badge
          variant="outline"
          className={cn("font-semibold", getBackgroundColor(day.name))}
        >
          {day.name}
        </Badge>
      </div>
      {children}
    </div>
  )
}

export default DayCard
