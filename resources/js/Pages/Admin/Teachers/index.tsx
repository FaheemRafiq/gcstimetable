import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import { ResourcePaginator } from '@/types/data-table'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { useEffect } from 'react'
import { DataTable } from '@/Components/Table/FeaturedTable'
import columns from './components/columns'
import { Teacher } from '@/types/database'
import useTeacherStore from '@/store/Admin/useTeacherStore'
import { TeacherToolbar } from './components/TableToolbar'

interface TeachersProps extends Record<string, unknown> {
  teachers: ResourcePaginator<Teacher>
  ranks: { [key: string]: string }
  positions: { [key: string]: string }
  departments: { [key: string]: string }
  qualifications: { [key: string]: string }
}

export default function Teachers({
  auth,
  teachers,
  ranks,
  positions,
  departments,
}: PageProps<TeachersProps>) {
  const setRanks = useTeacherStore(state => state.setRanks)
  const setPositions = useTeacherStore(state => state.setPositions)
  const setDepartments = useTeacherStore(state => state.setDepartments)

  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Teachers',
    })
  }, [setBreadcrumb])

  useEffect(() => {
    setRanks(ranks)
    setPositions(positions)
    setDepartments(departments)
  }, [ranks, setRanks])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Teachers" />

      <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
        <div className="p-6">
          <DataTable
            data={teachers.data}
            columns={columns}
            pinnedColumns={{ right: ['actions'] }}
            DataTableToolbar={TeacherToolbar}
            pagination="server"
            currentPage={teachers.meta.current_page}
            totalItems={teachers.meta.total}
            pageSize={teachers.meta.per_page}
            navigationLinks={teachers.links}
            from={teachers.meta.from}
            to={teachers.meta.to}
            pageSizeOptions={[15, 30, 50, 100]}
            onPageSizeChange={pageSize => {
              router.replace({
                url: route('teachers.index', { page: 1, perPage: pageSize })
              })
            }}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
