import { Icon } from '@/components/app-sidebar'
import React from 'react'

type InformationProps = {
  icon: Icon
  title: string
  value: string
  jsxValue?: JSX.Element
}

const Information = ({ icon: Icon, title, value, jsxValue }: InformationProps) => {
  return (
    <div className="flex items-start space-x-3 mb-4">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        {jsxValue || <p className="font-medium">{value}</p>}
      </div>
    </div>
  )
}
export default Information
