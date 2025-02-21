import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Permission {
  id: number
  name: string
}

interface PermissionCheckboxListProps {
  permissions: Permission[]
  selectedPermissions: number[]
  onToggle: (newSelected: number[]) => void
}

const GROUPS = ['create', 'edit', 'view', 'delete', 'others']

const getGroupName = (name: string) => {
  const lowerName = name.toLowerCase()
  const matchedGroup = GROUPS.find(group => lowerName.includes(group.toLowerCase()))
  return matchedGroup || 'Others'
}

const groupPermissions = (permissions: Permission[]) => {
  return permissions.reduce<Record<string, Permission[]>>((groupedData, perm) => {
    const category = getGroupName(perm.name)
    if (!groupedData[category]) groupedData[category] = []
    groupedData[category].push(perm)
    return groupedData
  }, {})
}

export const PermissionCheckboxList: React.FC<PermissionCheckboxListProps> = ({
  permissions,
  selectedPermissions,
  onToggle,
}) => {
  const groupedPermissions = groupPermissions(
    [...permissions].sort((a, b) => a.name.localeCompare(b.name))
  )

  const allPermissionIds = permissions.map(p => p.id)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant={isAllSelected ? 'destructive' : 'default'}
          onClick={handleSelectAll}
          className="mb-4"
          type="button"
        >
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </Button>
      </div>

      {Object.entries(groupedPermissions).map(([category, perms]) => {
        const categoryIds = perms.map(p => p.id)
        const isCategorySelected = categoryIds.every(id => selectedPermissions.includes(id))

        return (
          <Card key={category} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold capitalize">{category}</h2>
              <Checkbox
                checked={isCategorySelected}
                onCheckedChange={() => handleCategoryToggle(categoryIds)}
              />
            </div>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {perms.map(permission => (
                <label key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                  />
                  <span>{permission.name}</span>
                </label>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

interface PermissionViewListProps {
  permissions: Permission[]
  selectedPermissions: number[]
}

export const PermissionViewList: React.FC<PermissionViewListProps> = ({
  permissions,
  selectedPermissions,
}) => {
  const groupedPermissions = groupPermissions(
    [...permissions].sort((a, b) => a.name.localeCompare(b.name))
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedPermissions).map(([category, perms]) => (
        <Card key={category} className="p-4">
          <h2 className="text-lg font-semibold mb-2 capitalize">{category}</h2>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {perms.map(permission => {
              const isSelected = selectedPermissions.includes(permission.id)
              return (
                <label
                  key={permission.id}
                  className={`flex items-center space-x-2 transition-opacity ${
                    isSelected ? 'opacity-100 font-semibold' : 'opacity-50'
                  }`}
                >
                  <Checkbox checked={isSelected} disabled={isSelected} />
                  <span>{permission.name}</span>
                </label>
              )
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
