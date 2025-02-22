import { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'

// Types
import { PageProps } from '@/types'
import { Department } from '@/types/database'

// Components
import { DataTable } from '@/Components/Table/DataTable'
import columns from './_components/columns'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { Button } from '@/components/ui/button'
import { DepartmentForm } from './_components/DepartmentForm'
import { ResourcePaginator } from '@/types/data-table'
import SearchInput from '@/components/inputs/search-input'

export default function Departments({
  auth,
  departments,
}: PageProps<{ departments: ResourcePaginator<Department> }>) {
  // state
  const [openCreate, setOpenCreate] = useState(false)
  const [search, setSearch] = useState({
    value: '',
    from: 'initial',
  })

  // Constants
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setSearch({
      value: searchParams.get('s') || '',
      from: 'url-first',
    })

    setBreadcrumb({
      title: 'Departments',
    })
  }, [setBreadcrumb])

  useEffect(() => {
    if (search.from === 'search') {
      handleSearch()
    }
  }, [search.value, search.from])

  const handleSearch = () => {
    const queryParams: Record<string, any> = {}
    if (search.value) queryParams.s = search.value

    router.get(route('departments.index'), queryParams, {
      preserveState: true,
      only: ['departments'],
    })
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Departments" />
      <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4">
            <div className="relative max-w-md w-full">
              <SearchInput
                value={search.value}
                setValue={value => setSearch({ value, from: 'search' })}
                placeholder="Search course by name, code, institution..."
                autoSearch={true}
                debounceDelay={500}
                className="md:shadow-md"
                autoFocus={true}
              />
            </div>

            <div className="self-end">
              <Button size={'sm'} onClick={() => setOpenCreate(true)}>
                Create Department
              </Button>
            </div>
          </div>
          <DataTable
            data={departments.data}
            columns={columns}
            pageLinks={departments.meta.links}
            from={departments.meta.from}
            to={departments.meta.to}
            totalCount={departments.meta.total}
            inputProps={{
              searchFilter: false,
              pagination: false,
            }}
          />
        </div>
      </div>

      <DepartmentForm open={openCreate} onClose={() => setOpenCreate(false)} />
    </AuthenticatedLayout>
  )
}
