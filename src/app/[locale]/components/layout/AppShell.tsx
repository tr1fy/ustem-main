'use client'

import React from 'react'

import { Header } from '@/app/[locale]/components/layout/Header'
import { Sidebar } from '@/app/[locale]/components/layout/sidebar'
import Navbar from '@/app/[locale]/components/layout/Navbar'
// import { useAuth } from '@/lib/Auth';
import { cn } from '@/app/[locale]/lib/utils'
import Footer from '@/app/[locale]/components/layout/Footer'
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  // const { user } = useAuth();
  const user = undefined

  const isAuthenticated = !!user
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh' }}>
        <Navbar />
        {children}
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Header className={'block lg:hidden'} toggle={toggleSidebar} />

      <div className='grid lg:grid-cols-6'>
        <Sidebar
          className={cn({
            'hidden lg:block': !isSidebarOpen,
            'bg-gray-800 fixed inset-y-0 left-0 z-50 w-64 overflow-hidden transition-all duration-500':
              isSidebarOpen
          })}
          isOpen={isSidebarOpen}
          close={() => setIsSidebarOpen(false)}
        />
        <div className='col-span-4 lg:col-span-5'>{children}</div>
      </div>
    </>
  )
}
