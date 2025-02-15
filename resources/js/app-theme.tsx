import { ThemeProvider } from '@/components/theme-provider'
import { ToastContainer as Toaster } from 'react-toastify';
import React from 'react'

function AppTheme({ children }: React.PropsWithChildren<{}>) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      {children}
      <Toaster position='top-center' />
    </ThemeProvider>
  )
}

export default AppTheme
