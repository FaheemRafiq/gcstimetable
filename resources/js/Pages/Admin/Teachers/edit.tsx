import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps } from '@/types'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { useEffect } from 'react'
import TeacherForm from './components/TeacherForm'
import { Teacher } from '@/types/database'

interface CreateTeacherProps extends Record<string, unknown> {
  teacher: Teacher
  ranks: { [key: string]: string }
  positions: { [key: string]: string }
  departments: { [key: string]: string }
  qualifications: { [key: string]: string }
}

export default function Teachers({
  auth,
  teacher,
  ranks,
  positions,
  departments,
  qualifications,
}: PageProps<CreateTeacherProps>) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Edit ' + teacher.name,
      backItems: [{ title: 'Teachers', url: route('teachers.index') }],
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Teacher" />

      <TeacherForm
        initialData={teacher}
        ranks={ranks}
        positions={positions}
        departments={departments}
        qualifications={qualifications}
      />
    </AuthenticatedLayout>
  )
}
