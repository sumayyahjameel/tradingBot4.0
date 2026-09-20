import React from 'react'
import { X, Command, Keyboard } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PageId } from '../../types'

interface KeyboardShortcutsModalProps {
  onNavigate: (page: PageId) => void
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onNavigate }) => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useApp()

  if (!isShortcutsOpen) return null

  const navigationShortcuts: { key: string; label: string; page: PageId }[] = [
    { key: '1', label: 'Dashboard Overview', page: 'dashboard' },
    { key: '2', label: 'Market Screener', page: 'market' },
    { key: '3', label: 'Quantitative Signals', page: 'signals' },
    { key: '4', label: 'Portfolio Allocation', page: 'portfolio' },
    { key: '5', label: 'Active Positions & Orders', page: 'positions' },
    { key: '6', label: 'Backtesting Engine', page: 'backtests' },
    { key: '7', label: 'Model Registry & Rank IC', page: 'models' },
    { key: '8', label: 'Data Lakehouse & PIT Feeds', page: 'data' },
    { key: '9', label: 'System Telemetry & Logs', page: 'system' },
    { key: '0', label: 'Settings & Risk Controls', page: 'settings' },
  ]

  const actionsShortcuts = [
    { keys: ['⌘', 'K'], label: 'Open Command Palette / Search' },
    { keys: ['?'], label: 'Toggle this keyboard shortcut guide' },
    { keys: ['ESC'], label: 'Dismiss active dialog / drawer / palette' },
    { keys: ['SPACE'], label: 'Pause / Resume bot execution loop' },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-700 shadow-2xl overflow-hidden font-mono">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-surface flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">
              TERMINAL KEYBOARD CHEAT SHEET
            </h3>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="text-zinc-500 hover:text-white p-1 hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* General Actions */}
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">
              GLOBAL COMMANDS
            </div>
            <div className="space-y-1.5">
              {actionsShortcuts.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-zinc-900/40 border border-zinc-800/80 text-xs"
                >
                  <span className="text-zinc-300">{s.label}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-white text-[11px] font-semibold"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Navigation */}
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">
              DIRECT PAGE NAVIGATION
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {navigationShortcuts.map((n) => (
                <button
                  key={n.key}
                  onClick={() => {
                    onNavigate(n.page)
                    setIsShortcutsOpen(false)
                  }}
                  className="flex items-center justify-between p-2 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-colors text-xs text-left group"
                >
                  <span className="text-zinc-400 group-hover:text-white transition-colors truncate">
                    {n.label}
                  </span>
                  <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 text-white text-[11px] font-semibold group-hover:border-zinc-500 transition-colors">
                    {n.key}
                  </kbd>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-surface flex items-center justify-between text-[10px] text-zinc-500">
          <span>PRO-TIP: Press ESC to close any open modal</span>
          <span>APEX-QUANT TERMINAL</span>
        </div>
      </div>
    </div>
  )
}
