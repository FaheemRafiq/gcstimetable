import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Actions } from './actions'
import { Program } from '@/types/database'

const columns: ColumnDef<Program>[] = [
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
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => row.original.duration + ' Years',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      return (
        <Badge variant={'secondary'} className="capitalize">
          {row.original.type}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'shifts_name',
    header: 'Shifts',
    cell: ({ row }) => {
      const shifts = row.original.shifts
      return (
        <div className="space-x-1">
          {shifts?.map(shift => (
            <Badge variant={'secondary'} className="capitalize">
              {shift.name}
            </Badge>
          ))}
        </div>
      )
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
