import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Actions } from './actions'
import { Semester } from '@/types/database'
import { getNumberWithOrdinal } from '@/utils/helper'
import { IsActiveBadge } from '../IsActive'

const columns: ColumnDef<Semester>[] = [
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
    accessorKey: 'number',
    header: 'No.',
    cell: ({ row }) => getNumberWithOrdinal(row.original.number),
  },
  {
    accessorKey: 'is_active',
    header: 'Is Active',
    cell: ({ row }) => {
      const isActive = row.original.is_active === 'active'

      return <IsActiveBadge isActive={isActive} />
    },
  },
  {
    accessorKey: 'id',
    header: 'Actions',
    cell: ({ row }) => {
      return <Actions row={row.original} />
    },
  },
]

export default columns
