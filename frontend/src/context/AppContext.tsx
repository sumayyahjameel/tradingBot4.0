import React, { createContext, useContext, useState, useEffect } from 'react'
import { StockQuote, TradingSignal, AppSettings } from '../types'
import { mockSettings, mockStocks } from '../data/mockData'

export interface ToastItem {
  id: string
  title: string
  description?: string
  timestamp: string
  type?: 'info' | 'success' | 'warning' | 'error'
}

interface AppContextType {
  // Bot control
  botStatus: 'ACTIVE_PAPER' | 'ACTIVE_LIVE' | 'PAUSED' | 'HALTED'
  setBotStatus: (status: 'ACTIVE_PAPER' | 'ACTIVE_LIVE' | 'PAUSED' | 'HALTED') => void
  togglePauseBot: () => void
  emergencyHalt: () => void

  // Modals & Panels
  isCommandOpen: boolean
  setIsCommandOpen: (open: boolean) => void
  isShortcutsOpen: boolean
  setIsShortcutsOpen: (open: boolean) => void
  selectedStock: StockQuote | null
  setSelectedStock: (stock: StockQuote | null) => void
  selectStockBySymbol: (symbol: string) => void

  // Watchlist
  watchlist: string[]
  toggleWatchlist: (symbol: string) => void
  isWatchlisted: (symbol: string) => boolean

  // Toasts
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id' | 'timestamp'>) => void
  dismissToast: (id: string) => void

  // Settings
  settings: AppSettings
  updateSettings: (newSettings: Partial<AppSettings>) => void

  // Simulated Execution
  executeSignal: (signal: TradingSignal) => void
  closePositionSimulated: (symbol: string, pnl: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [botStatus, setBotStatus] = useState<'ACTIVE_PAPER' | 'ACTIVE_LIVE' | 'PAUSED' | 'HALTED'>('ACTIVE_PAPER')
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState<StockQuote | null>(null)
  const [watchlist, setWatchlist] = useState<string[]>(['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'])
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('apex_settings')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback to mock
    }
    return mockSettings
  })

  const addToast = (toast: Omit<ToastItem, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    const now = new Date()
    const timestamp = now.toLocaleTimeString('en-IN', { hour12: false })
    const newItem: ToastItem = { ...toast, id, timestamp }

    setToasts((prev) => [newItem, ...prev].slice(0, 5))

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      dismissToast(id)
    }, 4500)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const togglePauseBot = () => {
    if (botStatus === 'HALTED') {
      addToast({
        title: 'BOT SYSTEM HALTED',
        description: 'Manual system reset required from System Diagnostics page.',
        type: 'error',
      })
      return
    }

    if (botStatus === 'PAUSED') {
      setBotStatus('ACTIVE_PAPER')
      addToast({
        title: 'EXECUTION LOOP RESUMED',
        description: 'Alpha signals dispatching to paper broker gateway.',
        type: 'success',
      })
    } else {
      setBotStatus('PAUSED')
      addToast({
        title: 'EXECUTION LOOP PAUSED',
        description: 'All pending signal entries temporarily held.',
        type: 'warning',
      })
    }
  }

  const emergencyHalt = () => {
    setBotStatus('HALTED')
    addToast({
      title: 'EMERGENCY SHUTDOWN ENGAGED',
      description: 'Trading daemon halted. Open order queue canceled.',
      type: 'error',
    })
  }

  const selectStockBySymbol = (symbol: string) => {
    const found = mockStocks.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase())
    if (found) {
      setSelectedStock(found)
    } else {
      // Generate synthetic quote if missing
      setSelectedStock({
        symbol: symbol.toUpperCase(),
        name: `${symbol.toUpperCase()} Ltd.`,
        sector: 'EQUITY',
        price: 1540.2,
        change: 12.4,
        changePercent: 0.81,
        volume: 1240000,
        turnoverCr: 185.4,
        pe: 22.4,
        rsi: 54.2,
        volatility20d: 14.8,
        high52w: 1680.0,
        low52w: 1210.0,
        sparkline: [1510, 1515, 1528, 1520, 1535, 1540],
      })
    }
  }

  const toggleWatchlist = (symbol: string) => {
    const sym = symbol.toUpperCase()
    setWatchlist((prev) => {
      const exists = prev.includes(sym)
      const next = exists ? prev.filter((s) => s !== sym) : [...prev, sym]
      addToast({
        title: exists ? `REMOVED FROM WATCHLIST: ${sym}` : `ADDED TO WATCHLIST: ${sym}`,
        type: 'info',
      })
      return next
    })
  }

  const isWatchlisted = (symbol: string) => {
    return watchlist.includes(symbol.toUpperCase())
  }

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      try {
        localStorage.setItem('apex_settings', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
    addToast({
      title: 'SETTINGS UPDATED',
      description: 'New risk parameters active across trading engine.',
      type: 'success',
    })
  }

  const executeSignal = (signal: TradingSignal) => {
    addToast({
      title: `SIMULATED ${signal.action}: ${signal.symbol}`,
      description: `Target: ₹${signal.targetPrice} | SL: ₹${signal.stopLoss} | Strategy: ${signal.strategy}`,
      type: 'info',
    })
  }

  const closePositionSimulated = (symbol: string, pnl: number) => {
    const pnlFormatted = pnl >= 0 ? `+₹${pnl.toLocaleString('en-IN')}` : `-₹${Math.abs(pnl).toLocaleString('en-IN')}`
    addToast({
      title: `POSITION CLOSED: ${symbol}`,
      description: `Realized P&L: ${pnlFormatted} | Order filled via NSE Paper OMS`,
      type: pnl >= 0 ? 'success' : 'warning',
    })
  }

  // Global key bindings: ? for shortcuts, Esc to close modals, Cmd+K for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input / textarea
      const target = e.target as HTMLElement
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        if (e.key === 'Escape') {
          target.blur()
        }
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandOpen((prev) => !prev)
      } else if (e.key === '?') {
        e.preventDefault()
        setIsShortcutsOpen((prev) => !prev)
      } else if (e.key === 'Escape') {
        setIsCommandOpen(false)
        setIsShortcutsOpen(false)
        setSelectedStock(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <AppContext.Provider
      value={{
        botStatus,
        setBotStatus,
        togglePauseBot,
        emergencyHalt,
        isCommandOpen,
        setIsCommandOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        selectedStock,
        setSelectedStock,
        selectStockBySymbol,
        watchlist,
        toggleWatchlist,
        isWatchlisted,
        toasts,
        addToast,
        dismissToast,
        settings,
        updateSettings,
        executeSignal,
        closePositionSimulated,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
