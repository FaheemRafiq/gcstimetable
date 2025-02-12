import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { XIcon } from 'lucide-react'
import FilterModal from '@/components/filter-modal'
import SearchInput from '@/components/inputs/search-input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { StringObject } from '@/types/database'

// Define initial filter state
const initialFilters = {
  s: '',
  type: '',
  sFrom: '',
}

interface CourseFilterProps {
  types: StringObject
}

function CourseFilters({ types }: CourseFilterProps) {
  const [filters, setFilters] = useState(initialFilters)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setFilters({
      s: searchParams.get('s') || '',
      type: searchParams.get('type') || '',
      sFrom: 'url-first',
    })
  }, [])

  useEffect(() => {
    if (filters.sFrom === 'search') {
      handleSearch()
    }
  }, [filters.s, filters.sFrom])

  const handleSearch = () => {
    const queryParams: Record<string, any> = {}
    if (filters.s) queryParams.s = filters.s
    if (filters.type) queryParams.type = filters.type

    router.get(route('courses.index'), queryParams, { preserveState: true, only: ['courses'] })
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
    router.get(route('courses.index'))
  }

  const getFilterBadges = () => {
    const badges = []
    if (filters.type) {
      badges.push(
        <Badge
          key="course_type"
          variant="secondary"
          className="!text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => setFilters(prev => ({ ...prev, type: '' }))}
        >
          Type: {filters.type}
          <XIcon size={12} className="ml-1 inline" />
        </Badge>
      )
    }
    return badges
  }

  return (
    <div className="flex justify-between items-center gap-5">
      <div className="flex-1 lg:w-96">
        <SearchInput
          value={filters.s}
          setValue={value => setFilters({ ...filters, s: value, sFrom: 'search' })}
          placeholder="Search course by name, code..."
          autoSearch={true}
          debounceDelay={500}
        />
      </div>
      <div className="self-end">
        <FilterModal
          title="Course Filters"
          description="Adjust your filters to find specific courses."
          onSearch={handleSearch}
          hasFiltersApplied={!!filters.type}
        >
          {filters.type && (
            <>
              <div className="space-y-2">
                <div className="text-sm font-medium">Active Filters</div>
                <div className="flex flex-wrap gap-2">
                  {getFilterBadges()}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              <Separator className="my-4" />
            </>
          )}

          <div className="space-y-4">
            <Label className="text-sm font-medium">Select Type</Label>
            <Select
              value={filters.type}
              onValueChange={value => setFilters({ ...filters, type: value })}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(types).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FilterModal>
      </div>
    </div>
  )
}

export default CourseFilters
