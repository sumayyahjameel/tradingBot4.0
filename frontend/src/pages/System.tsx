import React, { useState, useEffect } from 'react'
import {
  Terminal,
  ShieldAlert,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Cpu,
  Database,
  CheckCircle2,
  Trash2,
  Wifi,
  Sparkles,
  Sliders,
  Activity,
} from 'lucide-react'
import { LogLevel, PageId, SystemLog } from '../types'
import { mockSystemLogs, mockSystemState } from '../data/mockData'
import { useApp } from '../context/AppContext'

interface SystemProps {
  onNavigate: (page: PageId) => void
}

export const System: React.FC<SystemProps> = ({ onNavigate }) => {
  const { botStatus, setBotStatus, emergencyHalt, addToast } = useApp()
  const [logs, setLogs] = useState<SystemLog[]>(mockSystemLogs)
  const [logFilter, setLogFilter] = useState<string>('ALL')
  const [searchLog, setSearchLog] = useState<string>('')
  const [tick, setTick] = useState(0)

  // Real-time telemetry oscillation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1)
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const isHalted = botStatus === 'HALTED'
  const liveCpu = (mockSystemState.cpuUsagePct + Math.sin(tick * 0.1) * 1.8).toFixed(1)
  const liveMem = mockSystemState.memoryUsageMb + Math.floor(Math.sin(tick * 0.05) * 6)

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = logFilter === 'ALL' || log.level === logFilter
    const matchesSearch =
      log.message.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.module.toLowerCase().includes(searchLog.toLowerCase())
    return matchesLevel && matchesSearch
  })

  const handleClearLogs = () => {
    setLogs([])
    addToast({
      title: 'TELEMETRY BUFFER CLEARED',
      description: 'Diagnostic terminal stream reset.',
      type: 'info',
    })
  }

  const handleToggleHalt = () => {
    if (isHalted) {
      setBotStatus('ACTIVE_PAPER')
      addToast({
        title: 'TRADING ENGINE RESTORED',
        description: 'Daemon status set to ACTIVE_PAPER. Risk filters validated.',
        type: 'success',
      })
      const newLog: SystemLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        level: 'INFO',
        module: 'EXEC_DAEMON',
        message: 'System resumed by manual operator override from Diagnostic Console.',
      }
      setLogs((prev) => [newLog, ...prev])
    } else {
      emergencyHalt()
      const newLog: SystemLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        level: 'ERROR',
        module: 'SAFETY_HALT',
        message: 'EMERGENCY SHUTDOWN INITIATED. Order queue cleared and broker API disconnected.',
      }
      setLogs((prev) => [newLog, ...prev])
    }
  }

  const handleInjectHeartbeat = () => {
    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      level: 'INFO',
      module: 'ALPHA_ENGINE',
      message: 'Self-test heartbeat verified. Zero lookahead invariant passed across 500 equities. Latency: 1.4ms.',
    }
    setLogs((prev) => [newLog, ...prev])
    addToast({
      title: 'PULSE VERIFIED',
      description: 'Pipeline heartbeat latency: 1.4ms.',
      type: 'info',
    })
  }

  return (
    <div className="p-4 md:p-6 space-y-4 font-mono select-none antialiased bg-[#060810] min-h-screen text-slate-200">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              </span>
              DAEMON ORCHESTRATOR // SUBSYSTEM TELEMETRY
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-normal flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                Live Kernel Probe
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-lg font-bold tracking-tight text-white uppercase">
                SYSTEM ENGINE TELEMETRY & <span className="text-emerald-400">AUDIT LOGS</span>
              </h1>
              <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800/90 border border-slate-700/80 text-emerald-300">
                REALTIME AUDIT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInjectHeartbeat}
              className="px-3 py-1.5 rounded text-[11px] font-medium bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              Test Pulse
            </button>
            <button
              onClick={handleToggleHalt}
              className={`px-3 py-1.5 rounded text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                isHalted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse'
              }`}
            >
              {isHalted ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> RESUME EXECUTION
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" /> EMERGENCY HALT BOT
                </>
              )}
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="px-3 py-1.5 rounded text-[11px] font-medium bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              Configure Limits
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Bot Status</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                isHalted
                  ? 'bg-rose-950/70 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30 animate-pulse'
              }`}
            >
              {isHalted ? 'HALTED' : 'AUTONOMOUS'}
            </span>
          </div>
          <div
            className={`mt-2 text-xl font-bold tracking-tight ${
              isHalted ? 'text-rose-400' : 'text-emerald-400 group-hover:text-emerald-300'
            } transition-colors`}
          >
            {isHalted ? 'HALTED' : mockSystemState.botStatus}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Uptime: {mockSystemState.uptime}</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Execution Venue</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Simulated</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {mockSystemState.executionMode}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Simulated Market Fills</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">CPU & Memory</span>
            <span className="text-[10px] text-emerald-400 font-semibold">{liveMem} MB</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {liveCpu}%
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1.5 border border-slate-800">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              style={{ width: `${liveCpu}%` }}
            />
          </div>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Daily Trades Capacity</span>
            <span className="text-[10px] text-slate-400">Protected</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {mockSystemState.dailyTradeCount} / {mockSystemState.maxDailyTrades}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Circuit Limit Nominal</p>
        </div>
      </div>

      {/* Subsystem Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-3 flex items-center justify-between shadow-md">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase">Data Pipeline</span>
            <span className="text-white font-bold text-[11px]">Bhavcopy / WS</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> ONLINE
          </span>
        </div>

        <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-3 flex items-center justify-between shadow-md">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase">Alpha Model</span>
            <span className="text-white font-bold text-[11px]">Ridge CS v3.2</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> LOADED
          </span>
        </div>

        <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-3 flex items-center justify-between shadow-md">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase">Risk Manager</span>
            <span className="text-white font-bold text-[11px]">Limits Enforced</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> PASSING
          </span>
        </div>

        <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-3 flex items-center justify-between shadow-md">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase">Heartbeat</span>
            <span className="text-white font-bold text-[11px]">{mockSystemState.lastHeartbeat}</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/70 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> HEALTHY
          </span>
        </div>
      </div>

      {/* Live System Log Terminal */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 overflow-hidden shadow-xl">
        {/* Terminal Header */}
        <div className="p-3 border-b border-slate-800/70 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold uppercase tracking-wider text-[11px]">
              REAL-TIME LOG STREAM (TERMINAL)
            </span>
            <span className="text-slate-500 text-[10px]">({filteredLogs.length} events)</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Level Filter */}
            <div className="flex items-center gap-1">
              {(['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-2 py-0.5 text-[10px] rounded transition-all border ${
                    logFilter === lvl
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm font-semibold'
                      : 'bg-[#070b14] text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              onClick={handleClearLogs}
              className="px-2 py-1 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-all flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-3.5 bg-[#05070d] text-xs max-h-[420px] overflow-y-auto space-y-1.5 border-t border-slate-900/60 font-mono">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-600 p-4 text-center">NO LOGS AVAILABLE TO DISPLAY.</div>
          ) : (
            filteredLogs.map((log) => {
              const isError = log.level === 'ERROR'
              const isWarn = log.level === 'WARN'
              const isInfo = log.level === 'INFO'

              return (
                <div
                  key={log.id}
                  className="flex items-baseline gap-2 leading-relaxed hover:bg-slate-800/20 px-1.5 py-0.5 rounded transition-colors"
                >
                  <span className="text-slate-500 text-[10px] whitespace-nowrap">{log.timestamp}</span>
                  <span
                    className={`text-[9px] uppercase font-bold px-1 py-0.2 rounded border ${
                      isError
                        ? 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                        : isWarn
                        ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                        : isInfo
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-slate-300 font-bold text-[10px]">[{log.module}]:</span>
                  <span
                    className={`text-[11px] flex-1 ${
                      isError ? 'text-rose-300 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {log.message}
                  </span>
                </div>
              )
            })
          )}
          <div className="flex items-center gap-1 text-emerald-400 text-[10px] pt-1">
            <span>apex-daemon@kernel:~$</span>
            <span className="w-2 h-3.5 bg-emerald-400 animate-pulse inline-block" />
          </div>
        </div>
      </div>
    </div>
  )
}