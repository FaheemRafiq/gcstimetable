import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, WhenVisible } from '@inertiajs/react'
import { PageProps, Statistics } from '@/types'
import SimpleStats from '@/Components/SimpleStats'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { useEffect } from 'react'
import { UsersIcon, GraduationCap, UserIcon } from 'lucide-react'
import { TeacherWorkloadChart } from './_component/TeacherWorkload'

interface TeacherWorkload {
  id: number
  teacher: string
  allocations: number
}

interface DashboardProps {
  statistics: Statistics
  teacherWorkload: TeacherWorkload[]
  [key: string]: unknown
}

export default function Dashboard({
  auth,
  statistics,
  teacherWorkload,
}: PageProps<DashboardProps>) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Dashboard',
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Dashboard" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SimpleStats
          title="Total Users"
          value={statistics.users}
          navigation={route('users.index')}
          icon={UsersIcon}
        />
        <SimpleStats
          title="Total Students"
          value={statistics.students}
          navigation={route('students.index')}
          icon={GraduationCap}
        />
        <SimpleStats
          title="Total Teachers"
          value={statistics.teachers}
          navigation={route('teachers.index')}
          icon={UserIcon}
        />

        {/* Teacher Workload */}
        <TeacherWorkloadChart teacherWorkload={teacherWorkload} />
      </div>
    </AuthenticatedLayout>
  )
}
