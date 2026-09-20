import React, { useState } from 'react'
import {
  Sliders,
  Shield,
  Bell,
  Monitor,
  CheckCircle2,
  RefreshCw,
  Save,
} from 'lucide-react'
import { AppSettings, PageId } from '../types'
import { mockSettings } from '../data/mockData'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
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
      setSavedSuccess(false)
    }, 2500)
  }

  const handleReset = () => {
    setSettings(mockSettings)
    updateSettings(mockSettings)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold tracking-wider text-white uppercase">
            QUANTITATIVE ENGINE CONFIGURATION & SETTINGS
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Risk Parameters, Trading Constraints, Execution Mode, and Appearance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs font-mono text-white flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Settings Saved!
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset Defaults
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save className="w-3.5 h-3.5" /> Save Configuration
          </Button>
        </div>
      </div>

      {/* Section 1: Trading Settings */}
      <div className="bg-surface border border-zinc-800 p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-white uppercase tracking-wider pb-2 border-b border-zinc-900">
          <Sliders className="w-4 h-4 text-white" />
          <span>TRADING & SIZING PARAMETERS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-zinc-400 block mb-1">EXECUTION MODE:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    trading: { ...settings.trading, executionMode: 'PAPER' },
                  })
                }
                className={`px-3 py-1.5 border w-full transition-colors ${
                  settings.trading.executionMode === 'PAPER'
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                PAPER SIMULATION
              </button>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    trading: { ...settings.trading, executionMode: 'LIVE' },
                  })
                }
                className={`px-3 py-1.5 border w-full transition-colors ${
                  settings.trading.executionMode === 'LIVE'
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                LIVE MARKET
              </button>
            </div>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">MAX OPEN CONCURRENT POSITIONS:</label>
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
            <label className="text-zinc-400 block mb-1">MAX CAPITAL PER TRADE (%):</label>
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
            <label className="text-zinc-400 block mb-1">MIN SIGNAL CONVICTION THRESHOLD:</label>
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
            <label className="text-zinc-400 block mb-1">DEFAULT STOP LOSS (%):</label>
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
            <label className="text-zinc-400 block mb-1">DEFAULT TAKE PROFIT TARGET (%):</label>
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
      <div className="bg-surface border border-zinc-800 p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-white uppercase tracking-wider pb-2 border-b border-zinc-900">
          <Shield className="w-4 h-4 text-white" />
          <span>RISK LIMITS & CIRCUIT GUARDS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-zinc-400 block mb-1">MAX DAILY DRAWDOWN HALT (%):</label>
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
            <label className="text-zinc-400 block mb-1">MAX PORTFOLIO EXPOSURE (%):</label>
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
            <label className="text-zinc-400 block mb-1">MAX SINGLE SECTOR LIMIT (%):</label>
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
            <label className="text-zinc-400 block mb-1">MAX SINGLE STOCK WEIGHT (%):</label>
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

        <div className="pt-2 border-t border-zinc-900 flex flex-col sm:flex-row gap-4 text-xs font-mono">
          <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
            <input
              type="checkbox"
              checked={settings.risk.enableTrailingStop}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  risk: { ...settings.risk, enableTrailingStop: e.target.checked },
                })
              }
              className="accent-white"
            />
            <span>Enable Automatic Trailing Stop Loss</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
            <input
              type="checkbox"
              checked={settings.risk.autoHaltOnBreach}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  risk: { ...settings.risk, autoHaltOnBreach: e.target.checked },
                })
              }
              className="accent-white"
            />
            <span>Auto-Halt Bot on Circuit Breach</span>
          </label>
        </div>
      </div>

      {/* Section 3: Notification Settings */}
      <div className="bg-surface border border-zinc-800 p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-white uppercase tracking-wider pb-2 border-b border-zinc-900">
          <Bell className="w-4 h-4 text-white" />
          <span>TELEMETRY & ALERT NOTIFICATIONS</span>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div>
            <label className="text-zinc-400 block mb-1">WEBHOOK ENDPOINT URL:</label>
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={settings.notifications.signalAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, signalAlerts: e.target.checked },
                  })
                }
                className="accent-white"
              />
              <span>Signal Alerts</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={settings.notifications.executionAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, executionAlerts: e.target.checked },
                  })
                }
                className="accent-white"
              />
              <span>Order Fills</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={settings.notifications.riskAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, riskAlerts: e.target.checked },
                  })
                }
                className="accent-white"
              />
              <span>Risk Breaches</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
              <input
                type="checkbox"
                checked={settings.notifications.emailAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailAlerts: e.target.checked },
                  })
                }
                className="accent-white"
              />
              <span>Daily Digest</span>
            </label>
          </div>
        </div>
      </div>

      {/* Section 4: Appearance */}
      <div className="bg-surface border border-zinc-800 p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-white uppercase tracking-wider pb-2 border-b border-zinc-900">
          <Monitor className="w-4 h-4 text-white" />
          <span>TERMINAL APPEARANCE & DISPLAY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-zinc-400 block mb-1">TABLE & CARD DENSITY:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, density: 'compact' },
                  })
                }
                className={`px-3 py-1.5 border w-full transition-colors ${
                  settings.appearance.density === 'compact'
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                COMPACT (HIGH DENSITY)
              </button>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, density: 'comfortable' },
                  })
                }
                className={`px-3 py-1.5 border w-full transition-colors ${
                  settings.appearance.density === 'comfortable'
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                COMFORTABLE
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="p-2.5 bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
              <span className="text-white font-semibold block mb-0.5">MINIMALIST BLACK-AND-WHITE:</span>
              High-contrast institutional grayscale is permanently enforced for financial focus.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
