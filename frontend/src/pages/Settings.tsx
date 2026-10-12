import React, { useState } from 'react'
import {
  Sliders,
  Shield,
  Bell,
  Monitor,
  CheckCircle2,
  RefreshCw,
  Save,
  Wifi,
  Zap,
} from 'lucide-react'
import { AppSettings, PageId } from '../types'
import { mockSettings } from '../data/mockData'
import { Input } from '../components/ui/Input'
import { useApp } from '../context/AppContext'

interface SettingsProps {
  onNavigate: (page: PageId) => void
}

export const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const { settings: globalSettings, updateSettings } = useApp()
  const [settings, setSettings] = useState<AppSettings>(globalSettings)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = () => {
    updateSettings(settings)
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false),
    }, 2500)
  }

  const handleReset = () => {
    setSettings(mockSettings)
    updateSettings(mockSettings)
  }

  return (
    <div className="p-4 md:p-6 space-y-4 font-mono select-none antialiased bg-[#060810] min-h-screen text-slate-200 max-w-5xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              </span>
              QUANT ENGINE PARAMETERS // CIRCUIT INVARIANTS
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-normal flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                Live Kernel Config
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-lg font-bold tracking-tight text-white uppercase">
                ENGINE CONFIGURATION & <span className="text-emerald-400">SETTINGS</span>
              </h1>
              <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800/90 border border-slate-700/80 text-emerald-300">
                STRICT RISK GATED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" /> SAVED!
              </span>
            )}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded text-[11px] font-medium bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            >
              Reset Defaults
            </button>
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              Save Config
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: Trading Settings */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 space-y-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider pb-2 border-b border-slate-800/60">
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>Trading & Sizing Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Execution Mode:</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    trading: { ...settings.trading, executionMode: 'PAPER' },
                  })
                }
                className={`px-3 py-1.5 rounded text-[11px] font-bold border w-full transition-all ${
                  settings.trading.executionMode === 'PAPER'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-[#070b14] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                PAPER SIMULATION
              </button>
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    trading: { ...settings.trading, executionMode: 'LIVE' },
                  })
                }
                className={`px-3 py-1.5 rounded text-[11px] font-bold border w-full transition-all ${
                  settings.trading.executionMode === 'LIVE'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                    : 'bg-[#070b14] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                LIVE MARKET
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Max Concurrent Positions:</label>
            <Input
              type="number"
              value={settings.trading.maxOpenPositions}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  trading: { ...settings.trading, maxOpenPositions: parseInt(e.target.value) || 1 },
                })
              }
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Max Capital Per Trade (%):</label>
            <Input
              type="number"
              suffixText="%"
              value={settings.trading.capitalPerTradePct}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  trading: { ...settings.trading, capitalPerTradePct: parseFloat(e.target.value) || 0 },
                })
              }
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Min Conviction Threshold:</label>
            <Input
              type="number"
              step="0.05"
              min="0.5"
              max="0.95"
              value={settings.trading.minConfidenceThreshold}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  trading: {
                    ...settings.trading,
                    minConfidenceThreshold: parseFloat(e.target.value) || 0.6,
                  },
                })
              }
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Default Stop Loss (%):</label>
            <Input
              type="number"
              step="0.5"
              suffixText="%"
              value={settings.trading.defaultStopLossPct}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  trading: { ...settings.trading, defaultStopLossPct: parseFloat(e.target.value) || 0 },
                })
              }
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Take Profit Target (%):</label>
            <Input
              type="number"
              step="0.5"
              suffixText="%"
              value={settings.trading.defaultTakeProfitPct}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  trading: { ...settings.trading, defaultTakeProfitPct: parseFloat(e.target.value) || 0 },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Section 2: Risk Management Settings */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 space-y-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider pb-2 border-b border-slate-800/60">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Risk Limits & Circuit Guards</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Max Daily Drawdown Halt (%):</label>
            <Input
              type="number"
              step="0.5"
              suffixText="%"
              value={settings.risk.maxDailyLossPct}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  risk: { ...settings.risk, maxDailyLossPct: parseFloat(e.target.value) || 0 },
                })
              }
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Max Portfolio Exposure (%):</label>
            <Input
              type="number"
              suffixText="%"
              value={settings.risk.maxPortfolioExposurePct}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  risk: { ...settings.risk, maxPortfolioExposurePct: parseFloat(e.target.value) || 0 },
                })
              }
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Max Single Sector Limit (%):</label>
            <Input
              type="number"
              suffixText="%"
              value={settings.risk.maxSectorExposurePct}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  risk: { ...settings.risk, maxSectorExposurePct: parseFloat(e.target.value) || 0 },
                })
              }
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Max Single Stock Weight (%):</label>
            <Input
              type="number"
              suffixText="%"
              value={settings.risk.maxSingleStockWeightPct}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  risk: { ...settings.risk, maxSingleStockWeightPct: parseFloat(e.target.value) || 0 },
                })
              }
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={settings.risk.enableTrailingStop}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  risk: { ...settings.risk, enableTrailingStop: e.target.checked },
                })
              }
              className="accent-emerald-400 w-4 h-4 rounded"
            />
            <span className="text-[11px]">Enable Automatic Trailing Stop Loss</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={settings.risk.autoHaltOnBreach}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  risk: { ...settings.risk, autoHaltOnBreach: e.target.checked },
                })
              }
              className="accent-emerald-400 w-4 h-4 rounded"
            />
            <span className="text-[11px]">Auto-Halt Bot on Circuit Breach</span>
          </label>
        </div>
      </div>

      {/* Section 3: Notification Settings */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 space-y-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider pb-2 border-b border-slate-800/60">
          <Bell className="w-3.5 h-3.5 text-emerald-400" />
          <span>Telemetry & Alert Notifications</span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Webhook Endpoint URL:</label>
            <Input
              type="url"
              value={settings.notifications.webhookUrl}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, webhookUrl: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={settings.notifications.signalAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, signalAlerts: e.target.checked },
                  })
                }
                className="accent-emerald-400 w-4 h-4 rounded"
              />
              <span className="text-[11px]">Signal Alerts</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={settings.notifications.executionAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, executionAlerts: e.target.checked },
                  })
                }
                className="accent-emerald-400 w-4 h-4 rounded"
              />
              <span className="text-[11px]">Order Fills</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={settings.notifications.riskAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, riskAlerts: e.target.checked },
                  })
                }
                className="accent-emerald-400 w-4 h-4 rounded"
              />
              <span className="text-[11px]">Risk Breaches</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={settings.notifications.emailAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailAlerts: e.target.checked },
                  })
                }
                className="accent-emerald-400 w-4 h-4 rounded"
              />
              <span className="text-[11px]">Daily Digest</span>
            </label>
          </div>
        </div>
      </div>

      {/* Section 4: Appearance */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 space-y-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider pb-2 border-b border-slate-800/60">
          <Monitor className="w-3.5 h-3.5 text-emerald-400" />
          <span>Terminal Display & Layout Density</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Table & Card Density:</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, density: 'compact' },
                  })
                }
                className={`px-3 py-1.5 rounded text-[11px] font-bold border w-full transition-all ${
                  settings.appearance.density === 'compact'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-[#070b14] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                COMPACT (HIGH DENSITY)
              </button>
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, density: 'comfortable' },
                  })
                }
                className={`px-3 py-1.5 rounded text-[11px] font-bold border w-full transition-all ${
                  settings.appearance.density === 'comfortable'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-[#070b14] text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                COMFORTABLE
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800/80 text-[10px] text-slate-400">
              <span className="text-emerald-400 font-bold block mb-0.5">DARK QUANT MATRIX ENFORCED:</span>
              High-contrast neon emerald & charcoal frosted theme active across all telemetry views.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}