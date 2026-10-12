import React, { useState } from 'react'
import { PageId } from '../../types'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  currentPage: PageId
  onNavigate: (page: PageId) => void
  onOpenCommand?: () => void
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPage,
  onNavigate,
  onOpenCommand,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
<div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.06),rgba(255,255,255,0))]">      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={onNavigate}
        onOpenCommand={onOpenCommand}
      />

      {/* Body: Sidebar + Main Area */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-background">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
