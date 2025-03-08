import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'

interface MobileViewProps {
  children: React.ReactNode
}

const MobileView: React.FC<MobileViewProps> = ({ children }) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <>{children}</>
  }

  return null
}

export default MobileView
