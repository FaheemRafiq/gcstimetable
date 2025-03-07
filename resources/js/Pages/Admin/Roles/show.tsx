import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps, Permission, Role } from '@/types'
import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { useEffect } from 'react'
import { PermissionViewList } from '@/Components/PermissionList'
import { Institution, PermissionGroup } from '@/types/database'
import { SuperAdminWrapper } from '@/Components/AdminWrapper'

function ShowPage({
  auth,
  role,
  groups,
}: PageProps<{ role: Role & { institution: Institution | null }; groups: PermissionGroup[] }>) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: role.name,
      backItems: [
        {
          title: 'Roles',
          url: route('roles.index'),
        },
      ],
    })
  }, [setBreadcrumb])

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Show Role" />

      <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
        <div className="p-6 flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-xl font-semibold mb-6 text-card-foreground dark:text-foreground">
              {role.name} Details
            </h1>
            <Link href={route('roles.index')} className="flex items-center space-x-2">
              <Button variant={'outline'}>Back</Button>
            </Link>
          </div>

          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-background text-foreground p-6 sm:rounded-lg shadow-lg">
              <div>
                <h3 className="text-lg font-semibold mb-2">Name</h3>
                <p>{role.name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Guard</h3>
                <p>{role.guard_name}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Permissions</h3>
                <p>{(role?.permissions || []).length}</p>
              </div>
              <SuperAdminWrapper>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Institution</h3>
                  <p>{role?.institution?.name || 'All'}</p>
                </div>
              </SuperAdminWrapper>
            </div>

            <div className="bg-background text-foreground p-6 sm:rounded-lg shadow-lg">
              <div className="mb-4">
                <PermissionViewList
                  groups={groups}
                  selectedPermissions={role?.permissions?.map(p => p.id) || []}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default ShowPage
