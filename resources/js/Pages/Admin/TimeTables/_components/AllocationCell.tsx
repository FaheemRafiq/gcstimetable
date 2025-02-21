import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Allocation, Day } from '@/types/database'
import { getBackgroundColor } from '@/utils/dayHelper'
import { formatNumberRange } from '@/utils/helper'


export const AllocationCell = ({ allocation }: { allocation: Allocation }) => {
  return (
    <div className="flex flex-col gap-1 p-1 w-full">
      <div className="flex items-center gap-2 justify-center flex-wrap">
        {allocation?.course?.code && (
          <span className="font-medium">{allocation?.course?.display_code}</span>
        )}
        {allocation?.teacher?.name && (
          <span className="text-muted-foreground">{allocation?.teacher?.name}</span>
        )}
      </div>
      <div className="flex items-center gap-2 justify-center flex-wrap">
        {allocation?.room?.name && (
          <span className="text-sm text-muted-foreground">{allocation?.room?.name}</span>
        )}
        {allocation.day?.number}
      </div>
    </div>
  )
}



export const GroupAllocationCell = ({ allocation }: { allocation: Allocation & { days: Day[] } }) => {
  return (
    <div className="flex flex-col gap-1 p-1 w-full">
      <div className="flex items-center gap-2 justify-center flex-wrap">
        {allocation?.course?.display_code && (
          <span className="font-medium">{allocation?.course?.display_code}</span>
        )}
        {allocation?.teacher?.name && (
          <span className="text-muted-foreground">{allocation?.teacher?.name}</span>
        )}
      </div>
      <div className="flex items-center gap-2 justify-center flex-wrap">
        {allocation?.room?.name && (
          <span className="text-sm text-muted-foreground">{allocation?.room?.name}</span>
        )}
        ({formatNumberRange(allocation.days?.map((day) => day.number))})
      </div>
    </div>
  );
};