import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps, Role, Permission } from '@/types'
import { useEffect } from 'react'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import RoleForm from './_components/RoleForm'

interface RolePageProps
  extends PageProps<{
    role?: Role
    permissions: Permission[]
    institutions?: { key: number; value: string }[]
  }> {}

function RolePage({ auth, role, permissions, institutions }: RolePageProps) {
  const { setBreadcrumb } = useBreadcrumb()
  const isEditForm = !!role

  useEffect(() => {
    setBreadcrumb({
      title: isEditForm ? `Edit Role: ${role?.name}` : 'Create Role',
      backItems: [{ title: 'Roles', url: route('roles.index') }],
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={isEditForm ? 'Edit Role' : 'Create Role'} />

      <RoleForm role={role} permissions={permissions} institutions={institutions} />
    </AuthenticatedLayout>
  )
}

export default RolePage
