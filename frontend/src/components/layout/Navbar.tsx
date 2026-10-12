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
  TrendingUp,
  TrendingDown,
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

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
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
    <header className="h-14 bg-[#080d19]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg flex items-center justify-between px-4 select-none z-30 sticky top-0 transition-all">
      {/* Left: Branding & Market Ticker */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="group flex items-center gap-2.5 pr-4 border-r border-slate-800/80 text-left transition-all"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="font-mono text-xs font-bold tracking-widest text-white uppercase group-hover:text-emerald-400 transition-colors">
            APEX<span className="text-slate-500 group-hover:text-emerald-500/70 transition-colors">-QUANT</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            IN-EQ
          </span>
        </button>

        {/* Live Market Pulse Indicator & IST Clock */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isHalted ? 'bg-rose-500' : 'bg-emerald-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isHalted ? 'bg-rose-500' : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]'
              }`}
            />
          </span>
          <span className="text-slate-300 text-[11px] uppercase tracking-wider font-semibold">
            NSE LIVE
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-300 text-[11px] flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/60 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-emerald-400" />
            {timeString || '15:30:00'} IST
          </span>
          <span className="text-slate-700">|</span>
        </div>

        {/* Streaming index tickers with glowing badges */}
        <div className="hidden xl:flex items-center gap-4 text-xs font-mono">
          {mockIndices.map((idx) => {
            const isPositive = idx.changePercent >= 0
            return (
              <div
                key={idx.id}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/40 border border-slate-800/40 hover:border-slate-700/80 transition-colors cursor-default"
              >
                <span className="text-slate-400 text-[11px]">{idx.name}:</span>
                <span className="text-white font-medium">₹{idx.current.toLocaleString('en-IN')}</span>
                <span
                  className={`text-[10px] font-semibold flex items-center gap-0.5 px-1 py-0.2 rounded ${
                    isPositive
                      ? 'text-emerald-400 bg-emerald-950/60'
                      : 'text-rose-400 bg-rose-950/60'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {isPositive ? `+${idx.changePercent}%` : `${idx.changePercent}%`}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right: Telemetry, Search, Controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick Search Trigger */}
        <button
          onClick={onOpenCommand}
          className="group flex items-center gap-2 px-3 py-1.5 bg-[#0d1322]/90 border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono rounded-lg transition-all shadow-sm"
        >
          <Search className="w-3.5 h-3.5 group-hover:text-emerald-400 transition-colors" />
          <span className="hidden sm:inline text-[11px]">SEARCH ASSETS / CMDS</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] bg-slate-800/90 text-slate-300 border border-slate-700/80 rounded font-mono shadow-inner">
            ⌘K
          </kbd>
        </button>

        {/* Mode Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#0d1322]/90 border border-slate-800/80 rounded-lg text-[11px] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">MODE:</span>
          <span className="text-emerald-300 font-semibold uppercase">{mockSystemState.executionMode}</span>
        </div>

        {/* Bot Execution Toggle */}
        <button
          onClick={togglePauseBot}
          className={`px-3 py-1.5 text-xs font-mono flex items-center gap-1.5 rounded-lg border transition-all shadow-sm ${
            isHalted
              ? 'bg-rose-950/40 text-rose-400 border-rose-800/60 cursor-not-allowed'
              : isPaused
              ? 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-semibold'
          }`}
          title={isHalted ? 'System Halted' : isPaused ? 'Resume Autonomous Execution' : 'Pause Trading Loop'}
        >
          {isHalted ? (
            <>
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[10px] hidden sm:inline">HALTED</span>
            </>
          ) : isPaused ? (
            <>
              <PlayCircle className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[10px] hidden sm:inline">RESUME</span>
            </>
          ) : (
            <>
              <PauseCircle className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[10px] hidden sm:inline">ACTIVE</span>
            </>
          )}
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="p-2 rounded-lg border border-slate-800/80 bg-[#0d1322]/60 text-slate-400 hover:text-white hover:border-slate-700/80 hover:bg-slate-800/50 transition-all"
          title="Keyboard shortcuts (?)"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>

        {/* System Terminal Shortcut */}
        <button
          onClick={() => onNavigate('system')}
          className={`p-2 rounded-lg border transition-all ${
            currentPage === 'system'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              : 'text-slate-400 border-slate-800/80 bg-[#0d1322]/60 hover:text-white hover:border-slate-700/80 hover:bg-slate-800/50'
          }`}
          title="Open System Terminal & Logs"
        >
          <Terminal className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  )
}