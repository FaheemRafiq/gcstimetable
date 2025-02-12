import { ColumnDef } from '@tanstack/react-table'
import { Department, Institution } from '@/types/database'
import { Actions } from './actions'

const columns: ColumnDef<Department>[] = [
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
    accessorKey: 'institution.name',
    header: 'Institution',
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ row }) => {
      return <Actions row={row.original} />
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
  },
]

export default columns
