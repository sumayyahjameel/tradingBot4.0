import React, { useState, useEffect } from 'react'
import { PageId } from './types'
import { AppProvider, useApp } from './context/AppContext'
import { AppLayout } from './components/layout/AppLayout'
import { CommandPalette } from './components/ui/CommandPalette'
import { StockDetailModal } from './components/ui/StockDetailModal'
import { KeyboardShortcutsModal } from './components/ui/KeyboardShortcutsModal'
import { ToastContainer } from './components/ui/ToastContainer'
import Dashboard from './pages/DashBoardTemplate'
import { Market } from './pages/Market'
import { Signals } from './pages/Signals'
import { Portfolio } from './pages/Portfolio'
import { Positions } from './pages/Positions'
import { Backtests } from './pages/Backtests'
import { Models } from './pages/Models'
import { Data } from './pages/Data'
import { System } from './pages/System'
import { Settings } from './pages/Settings'

const pageKeyMap: Record<string, PageId> = {
  '1': 'dashboard',
  '2': 'market',
  '3': 'signals',
  '4': 'portfolio',
  '5': 'positions',
  '6': 'backtests',
  '7': 'models',
  '8': 'data',
  '9': 'system',
  '0': 'settings',
}

function AppInner() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard')
  const {
    isCommandOpen,
    setIsCommandOpen,
    togglePauseBot,
  } = useApp()

  // Numeric navigation shortcuts (1=Dashboard ... 0=Settings) and Space to toggle bot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }

      if (e.key in pageKeyMap) {
        e.preventDefault()
        setCurrentPage(pageKeyMap[e.key])
      } else if (e.code === 'Space') {
        e.preventDefault()
        togglePauseBot()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePauseBot])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'market':
        return <Market onNavigate={setCurrentPage} />
      case 'signals':
        return <Signals onNavigate={setCurrentPage} />
      case 'portfolio':
        return <Portfolio onNavigate={setCurrentPage} />
      case 'positions':
        return <Positions onNavigate={setCurrentPage} />
      case 'backtests':
        return <Backtests onNavigate={setCurrentPage} />
      case 'models':
        return <Models onNavigate={setCurrentPage} />
      case 'data':
        return <Data onNavigate={setCurrentPage} />
      case 'system':
        return <System onNavigate={setCurrentPage} />
      case 'settings':
        return <Settings onNavigate={setCurrentPage} />
      default:
        return <Dashboard onNavigate={setCurrentPage} />
    }
  }

  return (
    <>
      <AppLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenCommand={() => setIsCommandOpen(true)}
      >
        {renderPage()}
      </AppLayout>

      {/* 21st.dev Style Floating Primitives & Overlays */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={setCurrentPage}
      />

      <StockDetailModal />
      <KeyboardShortcutsModal onNavigate={setCurrentPage} />
      <ToastContainer />
    </>
  )
}

export function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}

export default App
