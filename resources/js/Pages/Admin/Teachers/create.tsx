import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps } from '@/types'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { useEffect } from 'react'
import TeacherForm from './components/TeacherForm'

interface CreateTeacherProps extends Record<string, unknown> {
  ranks: { [key: string]: string }
  positions: { [key: string]: string }
  departments: { [key: string]: string }
  qualifications: { [key: string]: string }
}

export default function Teachers({
  auth,
  ranks,
  positions,
  departments,
  qualifications,
}: PageProps<CreateTeacherProps>) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Create Teacher',
      backItems: [{ title: 'Teachers', url: route('teachers.index') }],
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Create Teacher" />

      <TeacherForm
        ranks={ranks}
        positions={positions}
        departments={departments}
        qualifications={qualifications}
      />
    </AuthenticatedLayout>
  )
}
