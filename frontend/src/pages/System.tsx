import React, { useState } from 'react'
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
} from 'lucide-react'
import { LogLevel, PageId, SystemLog } from '../types'
import { mockSystemLogs, mockSystemState } from '../data/mockData'
import { StatCard } from '../components/ui/StatCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useApp } from '../context/AppContext'

interface SystemProps {
  onNavigate: (page: PageId) => void
}

export const System: React.FC<SystemProps> = ({ onNavigate }) => {
  const { botStatus, setBotStatus, emergencyHalt, addToast } = useApp()
  const [logs, setLogs] = useState<SystemLog[]>(mockSystemLogs)
  const [logFilter, setLogFilter] = useState<string>('ALL')
  const [searchLog, setSearchLog] = useState<string>('')

  const isHalted = botStatus === 'HALTED'

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold tracking-wider text-white uppercase">
            SYSTEM ENGINE TELEMETRY & AUDIT LOGS
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Daemon Orchestrator, Subsystem Health Monitors, and Live Diagnostic Terminal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleInjectHeartbeat}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Test Pulse
          </Button>
          <Button
            variant={isHalted ? 'primary' : 'destructive'}
            size="sm"
            onClick={handleToggleHalt}
          >
            {isHalted ? (
              <>
                <Play className="w-3.5 h-3.5" /> RESUME EXECUTION
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" /> EMERGENCY HALT BOT
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('settings')}>
            Configure Limits
          </Button>
        </div>
      </div>

      {/* Top 4 System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Bot Status"
          value={isHalted ? 'HALTED' : mockSystemState.botStatus}
          delta={isHalted ? 'Manual Halt' : 'Autonomous'}
          deltaType={isHalted ? 'negative' : 'positive'}
          subtext={`Uptime: ${mockSystemState.uptime}`}
        />
        <StatCard
          title="Execution Venue"
          value={mockSystemState.executionMode}
          subtext="Simulated Market Fills"
        />
        <StatCard
          title="CPU & Memory"
          value={`${mockSystemState.cpuUsagePct}%`}
          subtext={`${mockSystemState.memoryUsageMb} MB Allocated`}
        />
        <StatCard
          title="Daily Trades Capacity"
          value={`${mockSystemState.dailyTradeCount} / ${mockSystemState.maxDailyTrades}`}
          subtext="Circuit Limit Protected"
        />
      </div>

      {/* Subsystem Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-surface border border-zinc-800 p-3 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-[10px] block">DATA PIPELINE</span>
            <span className="text-white font-medium">Bhavcopy / WS</span>
          </div>
          <Badge variant="buy" size="sm">
            ONLINE
          </Badge>
        </div>
        <div className="bg-surface border border-zinc-800 p-3 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-[10px] block">ALPHA MODEL</span>
            <span className="text-white font-medium">Ridge CS v3.2</span>
          </div>
          <Badge variant="buy" size="sm">
            LOADED
          </Badge>
        </div>
        <div className="bg-surface border border-zinc-800 p-3 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-[10px] block">RISK MANAGER</span>
            <span className="text-white font-medium">Limits Enforced</span>
          </div>
          <Badge variant="buy" size="sm">
            PASSING
          </Badge>
        </div>
        <div className="bg-surface border border-zinc-800 p-3 flex items-center justify-between">
          <div>
            <span className="text-zinc-500 text-[10px] block">HEARTBEAT</span>
            <span className="text-white font-medium">{mockSystemState.lastHeartbeat}</span>
          </div>
          <Badge variant="subtle" size="sm">
            HEALTHY
          </Badge>
        </div>
      </div>

      {/* Live System Log Terminal */}
      <div className="bg-surface border border-zinc-800">
        {/* Terminal Header */}
        <div className="p-3 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-white" />
            <span className="text-white font-semibold uppercase tracking-wider">
              REAL-TIME LOG STREAM (TERMINAL)
            </span>
            <span className="text-zinc-500 text-[11px]">({filteredLogs.length} events)</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Level Filter */}
            <div className="flex items-center gap-1">
              {(['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-2 py-0.5 text-[10px] font-mono border transition-colors ${
                    logFilter === lvl
                      ? 'bg-white text-black border-white font-medium'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={handleClearLogs}>
              <Trash2 className="w-3 h-3 text-zinc-400" /> Clear
            </Button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-3 bg-black font-mono text-xs max-h-[420px] overflow-y-auto space-y-1.5 selection:bg-zinc-800">
          {filteredLogs.length === 0 ? (
            <div className="text-zinc-600 p-4 text-center">NO LOGS AVAILABLE TO DISPLAY.</div>
          ) : (
            filteredLogs.map((log) => {
              const levelBadge =
                log.level === 'WARN'
                  ? 'text-zinc-200 font-bold border border-zinc-500 px-1'
                  : log.level === 'ERROR'
                  ? 'text-white font-bold bg-zinc-800 px-1'
                  : log.level === 'DEBUG'
                  ? 'text-zinc-600'
                  : 'text-zinc-400'

              return (
                <div key={log.id} className="flex items-baseline gap-2 leading-relaxed hover:bg-zinc-900/30 px-1 py-0.5">
                  <span className="text-zinc-600 text-[11px] whitespace-nowrap">{log.timestamp}</span>
                  <span className={`text-[10px] uppercase ${levelBadge}`}>[{log.level}]</span>
                  <span className="text-white font-medium text-[11px]">[{log.module}]:</span>
                  <span className="text-zinc-300 text-[11px] flex-1">{log.message}</span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
