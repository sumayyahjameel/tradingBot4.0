import React from 'react'
import {
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
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { PageId } from '../../types'
import { mockSignals, mockPositions, mockSystemState } from '../../data/mockData'

interface SidebarProps {
  currentPage: PageId
  onNavigate: (page: PageId) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

interface NavEntry {
  id: PageId
  label: string
  icon: React.ReactNode
  badge?: string | number
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
}) => {
  const activeSignalsCount = mockSignals.filter((s) => s.status === 'ACTIVE').length
  const openPositionsCount = mockPositions.length

  const navEntries: NavEntry[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'market', label: 'Market', icon: <TrendingUp className="w-4 h-4" /> },
    {
      id: 'signals',
      label: 'Signals',
      icon: <Activity className="w-4 h-4" />,
      badge: activeSignalsCount > 0 ? activeSignalsCount : undefined,
    },
    { id: 'portfolio', label: 'Portfolio', icon: <PieChart className="w-4 h-4" /> },
    {
      id: 'positions',
      label: 'Positions',
      icon: <Layers className="w-4 h-4" />,
      badge: openPositionsCount > 0 ? openPositionsCount : undefined,
    },
    { id: 'backtests', label: 'Backtests', icon: <History className="w-4 h-4" /> },
    { id: 'models', label: 'Models', icon: <Cpu className="w-4 h-4" /> },
    { id: 'data', label: 'Data', icon: <Database className="w-4 h-4" /> },
    { id: 'system', label: 'System', icon: <Terminal className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> },
  ]

  return (
    <aside
      className={`bg-[#080d19]/95 backdrop-blur-xl border-r border-slate-800/80 shadow-2xl flex flex-col justify-between transition-all duration-300 ease-in-out select-none relative z-20 ${
        collapsed ? 'w-14' : 'w-60'
      }`}
    >
      {/* Top: Navigation Header & Entries */}
      <div className="flex flex-col py-3">
        <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/60 mb-2">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="tracking-widest uppercase font-semibold text-slate-300">Navigation</span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all ml-auto"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        <nav className="flex flex-col space-y-1 px-2">
          {navEntries.map((item) => {
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-wide rounded-lg transition-all duration-200 text-left relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent text-emerald-300 font-semibold border-l-2 border-emerald-400 shadow-[inset_0_0_12px_rgba(16,185,129,0.08)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border-l-2 border-transparent hover:border-slate-600 hover:translate-x-1'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    isActive
                      ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 shadow-sm animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom: System Telemetry & Risk Monitor */}
      {!collapsed ? (
        <div className="m-3 p-3.5 rounded-xl border border-slate-800/80 bg-[#0d1322]/80 backdrop-blur-md shadow-lg font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] mb-2.5 pb-2 border-b border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="uppercase tracking-wider font-semibold text-slate-300">Telemetry</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              ONLINE
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between items-center text-slate-400">
              <span>CPU:</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(mockSystemState.cpuUsagePct, 100)}%` }}
                  />
                </div>
                <span className="text-slate-200 font-bold">{mockSystemState.cpuUsagePct}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>RAM:</span>
              <span className="text-slate-200 font-bold">{mockSystemState.memoryUsageMb} MB</span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>RISK VA:</span>
              <span className="text-emerald-400 font-bold">1.42%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-800/80 flex flex-col items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" title="System Online" />
        </div>
      )}
    </aside>
  )
}