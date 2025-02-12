import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Actions } from './actions'
import { Role } from '@/types'

const columns: ColumnDef<Role>[] = [
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
    accessorKey: 'guard_name',
    header: 'Guard Name',
  },
  {
    accessorKey: 'permissions_count',
    header: 'Permissions',
    cell: ({ row }) => {
      return <Badge className="capitalize">{row.original.permissions_count}</Badge>
    },
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ row }) => {
      return <Actions row={row.original} />
    },
  },
]

export default columns
