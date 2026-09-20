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
  ShieldAlert,
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
      className={`bg-background border-r border-zinc-800 flex flex-col justify-between transition-all duration-150 select-none ${
        collapsed ? 'w-14' : 'w-56'
      }`}
    >
      {/* Top: Nav entries */}
      <div className="flex flex-col py-2">
        <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-zinc-900 mb-1">
          {!collapsed && <span className="tracking-widest">NAVIGATION</span>}
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors ml-auto"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        <nav className="flex flex-col space-y-0.5 px-2">
          {navEntries.map((item) => {
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 px-2.5 py-2 text-xs font-mono tracking-wider transition-all text-left relative ${
                  isActive
                    ? 'bg-zinc-900 text-white font-medium border-l-2 border-white'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border-l-2 border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className={`${isActive ? 'text-white' : 'text-zinc-400'}`}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.2 bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono">
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
        <div className="p-3 border-t border-zinc-900 text-xs font-mono bg-zinc-950/40">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
            <span className="uppercase tracking-widest">TELEMETRY</span>
            <span className="text-zinc-300">ONLINE</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between text-zinc-400">
              <span>CPU:</span>
              <span className="text-zinc-200 num">{mockSystemState.cpuUsagePct}%</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>RAM:</span>
              <span className="text-zinc-200 num">{mockSystemState.memoryUsageMb} MB</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>RISK VA:</span>
              <span className="text-zinc-200 num">1.42%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-zinc-900 flex justify-center">
          <span className="w-2 h-2 rounded-full bg-white opacity-80" title="System Online" />
        </div>
      )}
    </aside>
  )
}
