import { useState, useRef } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Info, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { PermissionGroup } from '@/types/database'
import { motion, AnimatePresence } from 'framer-motion'

interface PermissionCheckboxListProps {
  groups: PermissionGroup[]
  selectedPermissions: number[]
  onToggle: (newSelected: number[]) => void
}

// Animation variants for smooth expansion
const contentVariants = {
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
}

export const PermissionCheckboxList: React.FC<PermissionCheckboxListProps> = ({
  groups,
  selectedPermissions,
  onToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<number[]>(groups.map(g => g.id))
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const allPermissionIds = groups.flatMap(group => group.permissions || [])?.map(p => p?.id) ?? []
  const isAllSelected =
    allPermissionIds.length > 0 && allPermissionIds.every(id => selectedPermissions.includes(id))

  const handleSelectAll = () => {
    if (isAllSelected) {
      onToggle([])
    } else {
      onToggle(allPermissionIds)
    }
  }

  const handleCategoryToggle = (categoryIds: number[]) => {
    const allSelected = categoryIds.every(id => selectedPermissions.includes(id))
    if (allSelected) {
      onToggle(selectedPermissions.filter(id => !categoryIds.includes(id)))
    } else {
      onToggle([...new Set([...selectedPermissions, ...categoryIds])])
    }
  }

  const handlePermissionToggle = (id: number) => {
    const newSelected = selectedPermissions.includes(id)
      ? selectedPermissions.filter(selectedId => selectedId !== id)
      : [...selectedPermissions, id]
    onToggle(newSelected)
  }

  const toggleGroupExpansion = (groupId: number) => {
    const cardRef = cardRefs.current.get(groupId)
    const scrollPosition = cardRef?.getBoundingClientRect().top ?? 0
    const scrollOffset = window.scrollY

    setExpandedGroups(prev => {
      const newExpanded = prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]

      // Maintain scroll position after animation
      requestAnimationFrame(() => {
        const newPosition = cardRef?.getBoundingClientRect().top ?? 0
        window.scrollTo({
          top: scrollOffset + (newPosition - scrollPosition),
          behavior: 'instant',
        })
      })

      return newExpanded
    })
  }

  const filteredGroups = groups
    .reduce((acc: PermissionGroup[], group: PermissionGroup) => {
      // First, try to match by group name
      const groupNameMatch = group.name.toLowerCase().includes(searchTerm.toLowerCase())

      if (groupNameMatch) {
        // If group name matches, include all permissions
        return [...acc, { ...group }]
      }

      // If no group name match, filter permissions by name or description
      const filteredPermissions =
        group.permissions?.filter(
          permission =>
            permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (permission.description &&
              permission.description.toLowerCase().includes(searchTerm.toLowerCase()))
        ) || []

      // Only include group if it has matching permissions
      if (filteredPermissions.length > 0) {
        return [
          ...acc,
          {
            ...group,
            permissions: filteredPermissions,
          },
        ]
      }

      return acc
    }, [])
    // Final filter to ensure we only keep groups with permissions
    .filter(group => (group.permissions?.length || 0) > 0)

  return (
    <div className="space-y-6">
      {/* Search and controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <div className="flex gap-2">
          <Badge className="flex items-center h-9">{selectedPermissions.length} Selected</Badge>
          <Button
            variant={isAllSelected ? 'destructive' : 'default'}
            onClick={handleSelectAll}
            type="button"
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      </div>

      {filteredGroups.map(group => {
        const categoryIds = group?.permissions?.map(p => p.id) || []
        const isCategorySelected =
          categoryIds.length > 0 && categoryIds?.every(id => selectedPermissions.includes(id))
        const isPartiallySelected =
          categoryIds.some(id => selectedPermissions.includes(id)) && !isCategorySelected
        const isExpanded = expandedGroups.includes(group.id)

        return (
          <Card
            key={group.id}
            className="overflow-hidden transition-all duration-200"
            ref={el => {
              if (el) cardRefs.current.set(group.id, el)
            }}
          >
            <CardHeader
              className="py-3 px-4 cursor-pointer"
              onClick={e => {
                if ((e.target as HTMLElement).tagName === 'INPUT') return

                toggleGroupExpansion(group.id)
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                  <CardTitle className="text-lg font-semibold capitalize flex items-center gap-2">
                    {group.name}
                    <Badge variant="secondary" className="ml-2">
                      {group.permissions?.length || 0}
                    </Badge>
                  </CardTitle>
                </div>
                <Checkbox
                  checked={isPartiallySelected ? 'indeterminate' : isCategorySelected}
                  onCheckedChange={() => handleCategoryToggle(categoryIds)}
                  onClick={e => e.stopPropagation()}
                  aria-label={`Select all permissions in ${group.name}`}
                />
              </div>
            </CardHeader>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="overflow-hidden"
                >
                  <CardContent className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pt-0 px-4 pb-4">
                    {group?.permissions?.map(permission => (
                      <div
                        key={permission.id}
                        className="flex items-start p-3 rounded-md transition-colors"
                      >
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <label
                            htmlFor={`permission-${permission.id}`}
                            className="font-medium cursor-pointer block"
                          >
                            {permission.name}
                          </label>
                          {permission.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )
      })}

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No permissions found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  )
}

interface PermissionViewListProps {
  groups: PermissionGroup[]
  selectedPermissions: number[]
}

export const PermissionViewList: React.FC<PermissionViewListProps> = ({
  groups,
  selectedPermissions,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<number[]>(groups.map(g => g.id))
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const toggleGroupExpansion = (groupId: number) => {
    const cardRef = cardRefs.current.get(groupId)
    const scrollPosition = cardRef?.getBoundingClientRect().top ?? 0
    const scrollOffset = window.scrollY

    setExpandedGroups(prev => {
      const newExpanded = prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]

      // Maintain scroll position after animation
      requestAnimationFrame(() => {
        const newPosition = cardRef?.getBoundingClientRect().top ?? 0
        window.scrollTo({
          top: scrollOffset + (newPosition - scrollPosition),
          behavior: 'instant',
        })
      })

      return newExpanded
    })
  }

  const filteredGroups = groups
    .map(group => ({
      ...group,
      permissions: group.permissions?.filter(
        permission =>
          (permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (permission.description &&
              permission.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
          selectedPermissions.includes(permission.id)
      ),
    }))
    .filter(group => (group.permissions?.length || 0) > 0)

  const totalSelected = selectedPermissions.length

  return (
    <div className="space-y-6">
      {/* Search and controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Search assigned permissions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <Badge className="flex items-center h-9">
          {totalSelected} Permission{totalSelected !== 1 ? 's' : ''} Assigned
        </Badge>
      </div>

      {filteredGroups.map(group => {
        const isExpanded = expandedGroups.includes(group.id)
        const groupSelectedCount = group.permissions?.length || 0

        return (
          <Card
            key={group.id}
            className="overflow-hidden transition-all duration-200"
            ref={el => {
              if (el) cardRefs.current.set(group.id, el)
            }}
          >
            <CardHeader
              className="py-3 px-4 cursor-pointer"
              onClick={() => toggleGroupExpansion(group.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                  <CardTitle className="text-lg font-semibold capitalize flex items-center gap-2">
                    {group.name}
                    <Badge variant="outline" className="ml-2">
                      {groupSelectedCount}
                    </Badge>
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="overflow-hidden"
                >
                  <CardContent className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pt-0 px-4 pb-4">
                    {group?.permissions?.map(permission => (
                      <div key={permission.id} className="flex items-start p-3 rounded-md">
                        <Checkbox checked={true} disabled={true} className="mt-1" />
                        <div className="ml-3">
                          <p className="font-medium">{permission.name}</p>
                          {permission.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )
      })}

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Info className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No permissions assigned</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm
              ? 'No matching permissions found.'
              : 'This role has no permissions assigned.'}
          </p>
        </div>
      )}
    </div>
  )
}
