import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import React, { Fragment } from 'react'
import InputError from '../InputError'
import { IsActive } from '@/types'

interface IsActiveSwitchProps {
  isActive: IsActive
  setIsActive: (value: IsActive) => void
  error?: string
}

const IsActiveSwitch: React.FC<IsActiveSwitchProps> = ({ isActive, setIsActive, error }) => {
  return (
    <Fragment>
      <Label htmlFor="is_active">Is Active</Label>
      <div className="flex items-center gap-2 mt-2">
        <Switch
          id="is_active"
          checked={isActive === 'active'}
          onCheckedChange={checked => setIsActive(checked ? 'active' : 'inactive')}
        />
        <span>{isActive === 'active' ? 'Yes' : 'No'}</span>
      </div>
      <InputError message={error} />
    </Fragment>
  )
}

export default IsActiveSwitch
