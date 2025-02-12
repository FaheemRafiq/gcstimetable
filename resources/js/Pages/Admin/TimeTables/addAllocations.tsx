import { useState, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps, Shift, TimeStamp, TimeTable } from '@/types'
import { router, useForm, Link } from '@inertiajs/react'
import { ArrowUpRight, Plus } from 'lucide-react'
import Tooltip from '@/components/ui/tooltip'
import { getRomanNumber } from '@/utils/helper'
import { Allocation, Section, Slot } from '@/types/database'
import { AllocationCell } from './Partials/AllocationCell'
import { Button } from '@/components/ui/button'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'

export default function AddAllocationsTimeTable({
  auth,
  timetable,
  sections,
}: PageProps<{ timetable: TimeTable; sections: Section[] }>) {
  const { setBreadcrumb } = useBreadcrumb()

  // state
  const [allocations, setAllocations] = useState<Allocation[]>([])

  useEffect(() => {
    if (timetable?.allocations?.length) {
      setAllocations(timetable.allocations)
    }

    setBreadcrumb({
      title: timetable?.title ?? 'Add Allocations',
      backItems: [
        {
          title: 'Time Tables',
          url: route('timetables.index'),
        },
      ],
    })
  }, [timetable])

  function getAllocations(slotId: number, sectionId: number) {
    let arrayOfAllocations = allocations.filter(
      allocation => allocation.slot_id === slotId && allocation.section_id === sectionId
    )

    if (arrayOfAllocations.length > 0) {
      arrayOfAllocations.sort((acc, curr) => Number(acc.day?.number) - Number(curr.day?.number))
    }

    return arrayOfAllocations
  }

  function handleCreateAllocation(slot_id: number, section_id = null as any) {
    let params: any = {
      time_table_id: timetable.id,
      slot_id: slot_id,
    }

    if (section_id) {
      params['section_id'] = section_id
    }

    router.get(route('allocations.create', params))
  }

  function editTimeTableCell(slot_id: number, section_id: number) {
    router.get(
      route('allocations.create', {
        time_table_id: timetable.id,
        slot_id,
        section_id,
      })
    )
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Add Allocations" />

      <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
        <div className="p-6 pb-10 flex flex-col">
          {/* Timetable Information */}
          <div className="w-full text-center relative">
            <div className="flex gap-4 justify-center items-center">
              <h2 className="text-lg font-bold">{timetable.title}</h2>
              <Tooltip title="Shift" className="cursor-default">
                <span className="text-sm self-end">{timetable.shift?.name}</span>
              </Tooltip>
            </div>
            <p className="text-sm mt-2">{timetable.description}</p>
            <Link
              href={route('timetables.edit', timetable.id)}
              className="absolute top-0 right-0 p-2"
            >
              <Tooltip title="Edit Time Table">
                <ArrowUpRight className="text-gray-700 dark:text-foreground" size={20} />
              </Tooltip>
            </Link>
          </div>

          <div className="my-4" />

          {/* Timetable Grid */}
          <div className="overflow-x-auto overflow-y-auto bg-background text-foreground rounded-lg p-3 shadow-md">
            <div className="grid grid-cols-12 gap-2">
              {/* Shift Slots Header */}
              <div className="col-span-12 flex h-10">
                <p className="flex-1 font-bold text-card-foreground dark:text-foreground text-center h-[50px] w-[150px] min-w-[200px] flex items-center justify-center border-l border-t">
                  Period
                </p>
                {timetable.shift?.slots?.map((slot, index) => (
                  <p
                    key={`period-${index}`}
                    className="flex-1 font-bold text-card-foreground dark:text-foreground text-center h-[50px] w-[150px] min-w-[300px] flex items-center justify-center border-l border-t"
                  >
                    {getRomanNumber(index + 1)}
                  </p>
                ))}
              </div>

              {/* Time Header */}
              <div className="col-span-12 flex h-10">
                <p className="flex-1 font-bold text-card-foreground dark:text-foreground text-center h-[50px] w-[150px] min-w-[200px] flex items-center justify-center border-l">
                  Time
                </p>
                {timetable.shift?.slots?.map(slot => (
                  <p
                    key={slot.id}
                    className="flex-1 font-bold text-card-foreground dark:text-foreground text-center h-[50px] w-[150px] min-w-[300px] flex items-center justify-center border-l"
                  >
                    {slot.name}
                  </p>
                ))}
              </div>
            </div>

            {/* Action Rows */}
            <div className="grid grid-cols-12 gap-2">
              {/* Allocations With Sections */}
              {sections.length > 0 &&
                sections.map(section => (
                  <div key={section.id} className="col-span-12 flex text-center">
                    <p className="text-sm flex-1 text-center h-auto min-h-[100px] w-[150px] min-w-[200px] flex justify-center items-center border-l">
                      {section?.semester?.name} ({section.name})
                    </p>

                    {timetable.shift?.slots?.map(slot => {
                      let allocs = getAllocations(slot.id, section.id)

                      return allocs.length > 0 ? (
                        <p
                          key={slot.id}
                          className="flex-1 text-center h-auto min-h-[100px] w-[150px] min-w-[300px] flex flex-col items-center justify-center border-l py-5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                          onClick={() => editTimeTableCell(slot.id, section.id)}
                        >
                          {allocs.map(alloc => (
                            <AllocationCell key={alloc.id} allocation={alloc} />
                          ))}
                        </p>
                      ) : (
                        <p
                          key={slot.id}
                          className="flex-1 text-center h-auto min-h-[100px] w-[150px] min-w-[300px] flex items-center justify-center border-l"
                        >
                          <Tooltip title="Add Allocation">
                            <Button
                              variant={'ghost'}
                              onClick={() => handleCreateAllocation(slot.id, section.id)}
                            >
                              <Plus size={16} />
                            </Button>
                          </Tooltip>
                        </p>
                      )
                    })}
                  </div>
                ))}

              {/* Empty Section */}
              <div className="col-span-12 flex text-center">
                <p className="flex-1 text-center h-auto min-h-[100px] w-[150px] min-w-[200px]"></p>
                {timetable.shift?.slots?.map(slot => (
                  <p
                    key={slot.id}
                    className="flex-1 text-center h-auto min-h-[100px] w-[150px] min-w-[300px] flex items-center justify-center border-l"
                  >
                    <Tooltip title="Add Allocation">
                      <Button variant={'ghost'} onClick={() => handleCreateAllocation(slot.id)}>
                        <Plus size={16} />
                      </Button>
                    </Tooltip>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
