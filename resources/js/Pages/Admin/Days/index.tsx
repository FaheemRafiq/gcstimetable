import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import { DataTable } from '@/Components/Table/DataTable'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import { useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Actions } from './_components/actions'
import { IsActiveBadge } from '@/Components/IsActive'
import { Day, Institution } from '@/types/database'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SuperAdminWrapper } from '@/Components/AdminWrapper'
import { Label } from '@/components/ui/label'

export default function Days({
  auth,
  days,
  institutions,
}: PageProps<{ days: Day[]; institutions: Institution[] }>) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({ title: 'Days' })
  }, [setBreadcrumb])

  const columns: ColumnDef<Day>[] = [
    {
      accessorKey: 'index',
      header: '#',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.code}
        </Badge>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Is Active',
      cell: ({ row }) => <IsActiveBadge isActive={row.original.pivot.is_active === 'active'} />,
    },
    {
      accessorKey: 'id',
      header: 'Actions',
      cell: ({ row }) => <Actions row={row.original} />,
    },
  ]

  const handleOnValueChange = (value: string) => {
    router.get(
      route('days.index'),
      { institution_id: value },
      {
        preserveState: true,
      }
    )
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Days" />
      <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
        <div className="p-6">
          <SuperAdminWrapper>
            <div className="mb-4 md:w-1/2">
              <Label aria-label="Select Institution">Select Institution</Label>
              <Select onValueChange={handleOnValueChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select institution" />
                </SelectTrigger>
                <SelectContent>
                  {institutions.map(institution => (
                    <SelectItem key={institution.id} value={institution.id.toString()}>
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SuperAdminWrapper>
          <DataTable
            data={days}
            columns={columns}
            inputProps={{
              searchFilter: false,
              // filterColumn: 'name',
              pagination: true,
            }}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
