import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Actions } from './actions'
import { Permission, Role } from '@/types'

const columns: ColumnDef<Permission>[] = [
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
    accessorKey: 'roles_count',
    header: 'Roles',
    cell: ({ row }) => {
      return <Badge className="capitalize">{row.original.roles_count}</Badge>
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
