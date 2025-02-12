import { router } from '@inertiajs/react'
import { Table } from '@tanstack/react-table'
import TeacherFilters from './TeacherFilters'
import { Button } from '@/components/ui/button'
import { DataTableViewOptions } from '@/Components/Table/FeaturedTable'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function TeacherToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  function handleAddNew() {
    router.get(route('teachers.create'))
  }

  return (
    <div className="flex items-center justify-between">
      {/* Teachers Filter */}
      <TeacherFilters />

      <div className="flex self-end">
        {/* Hide / Show Table columns */}
        <DataTableViewOptions table={table} />

        {/* Create a new Button here */}
        <div className="ml-4">
          <Button variant="default" className="h-8 px-2 lg:px-3" onClick={() => handleAddNew()}>
            Create New
          </Button>
        </div>
      </div>
    </div>
  )
}
