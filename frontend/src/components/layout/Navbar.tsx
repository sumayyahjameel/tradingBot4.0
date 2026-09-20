import React, { useState, useEffect } from 'react'
import {
  Activity,
  AlertTriangle,
  Search,
  Bell,
  Cpu,
  Terminal,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  AlertOctagon,
  Keyboard,
  Clock,
} from 'lucide-react'
import { PageId } from '../../types'
import { mockIndices, mockSystemState } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

interface NavbarProps {
  currentPage: PageId
  onNavigate: (page: PageId) => void
  onOpenCommand?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenCommand,
}) => {
  const {
    botStatus,
    togglePauseBot,
    setIsShortcutsOpen,
    selectStockBySymbol,
  } = useApp()

  const [timeString, setTimeString] = useState<string>('')

  // IST Clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // format as IST HH:mm:ss
      setTimeString(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const isPaused = botStatus === 'PAUSED'
  const isHalted = botStatus === 'HALTED'

  return (
    <header className="h-12 bg-background border-b border-zinc-800 flex items-center justify-between px-4 select-none z-30 sticky top-0">
      {/* Left: Branding & Market Ticker */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 pr-3 border-r border-zinc-800 hover:opacity-80 transition-opacity text-left"
        >
          <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
            APEX<span className="text-zinc-500">-QUANT</span>
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 bg-zinc-900 border border-zinc-800 text-zinc-300">
            IN-EQ
          </span>
        </button>

        {/* Live Market Pulse Indicator & IST Clock */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isHalted ? 'bg-zinc-600' : 'bg-zinc-400'} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isHalted ? 'bg-zinc-600' : 'bg-white'}`} />
          </span>
          <span className="text-zinc-400 text-[11px] uppercase tracking-wider">
            NSE LIVE
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300 text-[11px] num flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-500" />
            {timeString || '15:30:00'} IST
          </span>
          <span className="text-zinc-600">|</span>
        </div>

        {/* Streaming index tickers */}
        <div className="hidden xl:flex items-center gap-4 text-xs font-mono">
          {mockIndices.map((idx) => (
            <div key={idx.id} className="flex items-center gap-1.5 cursor-default">
              <span className="text-zinc-400 text-[11px]">{idx.name}:</span>
              <span className="text-white font-medium num">{idx.current.toLocaleString('en-IN')}</span>
              <span
                className={`text-[10px] num ${
                  idx.changePercent >= 0 ? 'text-zinc-200' : 'text-zinc-500'
                }`}
              >
                {idx.changePercent >= 0 ? `+${idx.changePercent}%` : `${idx.changePercent}%`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Telemetry, Search, Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Search Trigger */}
        <button
          onClick={onOpenCommand}
          className="flex items-center gap-2 px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs font-mono hover:border-zinc-700 hover:text-white transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">SEARCH ASSETS / CMDS</span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Mode Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-[11px] font-mono">
          <ShieldCheck className="w-3 h-3 text-zinc-400" />
          <span className="text-zinc-400">MODE:</span>
          <span className="text-white font-semibold">{mockSystemState.executionMode}</span>
        </div>

        {/* Bot Execution Toggle */}
        <button
          onClick={togglePauseBot}
          className={`px-2 py-1 text-xs font-mono flex items-center gap-1.5 transition-colors border ${
            isHalted
              ? 'bg-zinc-900 text-zinc-500 border-zinc-700 cursor-not-allowed'
              : isPaused
              ? 'bg-zinc-900 text-zinc-300 border-zinc-600'
              : 'bg-white text-black border-white font-medium'
          }`}
          title={isHalted ? 'System Halted' : isPaused ? 'Resume Autonomous Execution' : 'Pause Trading Loop'}
        >
          {isHalted ? (
            <>
              <AlertOctagon className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] hidden sm:inline">HALTED</span>
            </>
          ) : isPaused ? (
            <>
              <PlayCircle className="w-3 h-3" />
              <span className="text-[10px] hidden sm:inline">RESUME</span>
            </>
          ) : (
            <>
              <PauseCircle className="w-3 h-3" />
              <span className="text-[10px] hidden sm:inline">ACTIVE</span>
            </>
          )}
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="p-1.5 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
          title="Keyboard shortcuts (?)"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>

        {/* System Terminal Shortcut */}
        <button
          onClick={() => onNavigate('system')}
          className={`p-1.5 border transition-colors ${
            currentPage === 'system'
              ? 'bg-zinc-800 text-white border-zinc-600'
              : 'text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
          }`}
          title="Open System Terminal & Logs"
        >
          <Terminal className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  )
}
