import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface PageBreadcrumsProps {
  title: string
  backItems?: { title: string; url: string }[]
}

interface BreadcrumbContextProps {
  breadcrumb: PageBreadcrumsProps | null
  setBreadcrumb: (breadcrumb: PageBreadcrumsProps) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextProps | undefined>(undefined)

export const BreadcrumbProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [breadcrumb, setBreadcrumb] = useState<PageBreadcrumsProps | null>(null)

  return (
    <BreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export const useBreadcrumb = (): BreadcrumbContextProps => {
  const context = useContext(BreadcrumbContext)
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider')
  }
  return context
}
