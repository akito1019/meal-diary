'use client'

import Header from './Header'
import Sidebar from './Sidebar'
import BottomNavigation from './BottomNavigation'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop layout with sidebar */}
      <div className="hidden md:flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile layout with header and bottom navigation */}
      <div className="md:hidden">
        <Header />
        <main className="pb-16">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              {children}
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  )
}