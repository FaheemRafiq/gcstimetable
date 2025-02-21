import { useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps, Shift, TimeTable } from '@/types'
import { getNumberWithOrdinal } from '@/utils/helper'
import {
  Allocation,
  Course,
  Day,
  Institution,
  Room,
  Semester,
  Slot,
  Teacher,
} from '@/types/database'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import SingleCreateForm from './_components/SingleCreateForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MultipleCreateForm from './_components/MultipleCreateForm'
import useLocalStorage from '@/hooks/useLocalStorage'

export type ModifiedSection = {
  SemesterName: string
  SemesterNo: number
  SemesterId: number
  ProgramType: string
  id: number
  name: string
}

export interface CreateAllocationProps {
  props: {
    timetable: TimeTable & {
      shift: Shift & {
        institution: Institution & {
          days?: Day[]
          rooms?: Room[]
          teachers?: Teacher[]
          semesters?: Semester[]
        }
      }
    }
    slot: Slot
    sections: ModifiedSection[]
    courses: Course[]
    allocations: Allocation[]
    haveSection: boolean
  }
}

export function getSectionLabel(section: ModifiedSection) {
  return `${section?.SemesterName ?? ''} - (${section?.name ?? ''})`
}

function CreateAllocation({ auth, props }: PageProps & CreateAllocationProps) {
  const [selectedTab, setSelectedTab] = useLocalStorage(
    'create_allocation_tab',
    'single_allocation'
  )
  const BACK_ROUTE = route('timetables.add.allocations', props.timetable.id)
  const { setBreadcrumb } = useBreadcrumb()

  // Life Cycle Hooks
  useEffect(() => {
    setBreadcrumb({
      title:
        (props.sections.length > 1 ? null : getSectionLabel(props.sections[0])) ?? 'Allocation',
      backItems: [
        {
          title: 'Time Tables',
          url: route('timetables.index'),
        },
        {
          title: props.timetable.title ?? 'Add Allocations',
          url: BACK_ROUTE,
        },
      ],
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Manage Allocation" />
      <Tabs defaultValue={selectedTab} onValueChange={value => setSelectedTab(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single_allocation">Single Allocation</TabsTrigger>
          <TabsTrigger value="bulk_allocation">Bulk Allocation</TabsTrigger>
        </TabsList>
        <TabsContent value="single_allocation">
          <SingleCreateForm props={props} />
        </TabsContent>
        <TabsContent value="bulk_allocation">
          <MultipleCreateForm props={props} />
        </TabsContent>
      </Tabs>
    </AuthenticatedLayout>
  )
}

export default CreateAllocation
