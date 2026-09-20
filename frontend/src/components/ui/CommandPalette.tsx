import React, { useState, useEffect } from 'react'
import {
  Search,
  LayoutDashboard,
  TrendingUp,
  Activity,
  PieChart,
  Layers,
  History,
  Cpu,
  Database,
  Terminal,
  Sliders,
  X,
  ArrowRight,
} from 'lucide-react'
import { PageId } from '../../types'
import { mockStocks } from '../../data/mockData'
import { Badge } from './Badge'
import { useApp } from '../../context/AppContext'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: PageId) => void
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { setSelectedStock } = useApp()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else setQuery('')
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const pages: { id: PageId; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, desc: 'Executive overview, NAV chart, live signals' },
    { id: 'market', label: 'Market Screener', icon: <TrendingUp className="w-4 h-4" />, desc: 'NIFTY 50, sector breakdown, live quotes' },
    { id: 'signals', label: 'Quantitative Signals', icon: <Activity className="w-4 h-4" />, desc: 'Model predictions, conviction thresholds' },
    { id: 'portfolio', label: 'Portfolio Allocation', icon: <PieChart className="w-4 h-4" />, desc: 'Holdings, sector limits, risk constraints' },
    { id: 'positions', label: 'Active Positions', icon: <Layers className="w-4 h-4" />, desc: 'Open trades, trailing stops, unrealized P&L' },
    { id: 'backtests', label: 'Backtesting Engine', icon: <History className="w-4 h-4" />, desc: 'Historical simulations, drawdown, trade log' },
    { id: 'models', label: 'Model Registry', icon: <Cpu className="w-4 h-4" />, desc: 'Feature importances, Spearman Rank IC' },
    { id: 'data', label: 'Data Lakehouse', icon: <Database className="w-4 h-4" />, desc: 'Parquet storage, PIT universe health' },
    { id: 'system', label: 'System Telemetry', icon: <Terminal className="w-4 h-4" />, desc: 'Daemon logs, engine circuit limits' },
    { id: 'settings', label: 'Settings & Risk', icon: <Sliders className="w-4 h-4" />, desc: 'Position sizing, stop loss, appearance' },
  ]

  const filteredPages = pages.filter(
    (p) =>
      p.label.toLowerCase().includes(query.toLowerCase()) ||
      p.desc.toLowerCase().includes(query.toLowerCase())
  )

  const filteredStocks = mockStocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelectPage = (pageId: PageId) => {
    onNavigate(pageId)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-start justify-center pt-20 p-4 select-none">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-700 shadow-2xl overflow-hidden font-mono">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-surface">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            autoFocus
            type="text"
            placeholder="Type a page name or stock symbol (e.g. RELIANCE, signals, backtest)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-3">
          {/* Navigation Section */}
          {filteredPages.length > 0 && (
            <div>
              <div className="text-[10px] text-zinc-500 px-2 py-1 uppercase tracking-widest font-semibold">
                PAGES & VIEWS
              </div>
              <div className="space-y-0.5">
                {filteredPages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPage(p.id)}
                    className="w-full text-left flex items-center justify-between p-2 hover:bg-zinc-900/70 border border-transparent hover:border-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-zinc-400 group-hover:text-white">{p.icon}</span>
                      <div>
                        <span className="text-white text-xs font-semibold block">{p.label}</span>
                        <span className="text-[10px] text-zinc-500">{p.desc}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Equities Section */}
          {filteredStocks.length > 0 && (
            <div>
              <div className="text-[10px] text-zinc-500 px-2 py-1 uppercase tracking-widest font-semibold">
                NIFTY EQUITIES
              </div>
              <div className="space-y-0.5">
                {filteredStocks.map((s) => (
                  <button
                    key={s.symbol}
                    onClick={() => {
                      setSelectedStock(s)
                      onClose()
                    }}
                    className="w-full text-left flex items-center justify-between p-2 hover:bg-zinc-900/70 border border-transparent hover:border-zinc-800 transition-colors group"
                  >
                    <div>
                      <span className="text-white text-xs font-bold">{s.symbol}</span>
                      <span className="text-[10px] text-zinc-500 ml-2">{s.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white text-xs font-medium num">₹{s.price.toFixed(2)}</span>
                      <span
                        className={`text-[10px] ml-2 num ${
                          s.changePercent >= 0 ? 'text-zinc-200' : 'text-zinc-500'
                        }`}
                      >
                        {s.changePercent >= 0 ? `+${s.changePercent}%` : `${s.changePercent}%`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPages.length === 0 && filteredStocks.length === 0 && (
            <div className="p-8 text-center text-xs text-zinc-600">
              NO MATCHING COMMANDS OR EQUITIES FOUND FOR "{query.toUpperCase()}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-3 py-1.5 border-t border-zinc-900 bg-zinc-950 flex items-center justify-between text-[10px] text-zinc-500">
          <span>Press ESC to close</span>
          <span>APEX-QUANT TERMINAL v3.2</span>
        </div>
      </div>
    </div>
  )
}
