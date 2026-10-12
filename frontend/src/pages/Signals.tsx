import React, { useState } from 'react'
import {
  Activity,
  Filter,
  Search,
  ArrowUpDown,
  Zap,
  CheckCircle2,
  Info,
  Sparkles,
  ShieldCheck,
  Cpu,
} from 'lucide-react'
import { TradingSignal, SignalAction, PageId } from '../types'
import { mockSignals } from '../data/mockData'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useApp } from '../context/AppContext'

interface SignalsProps {
  onNavigate: (page: PageId) => void
}

export const Signals: React.FC<SignalsProps> = ({ onNavigate }) => {
  const { selectStockBySymbol, executeSignal } = useApp()
  const [signals, setSignals] = useState<TradingSignal[]>(mockSignals)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('ALL')
  const [strategyFilter, setStrategyFilter] = useState<string>('ALL')
  const [minConfidence, setMinConfidence] = useState<number>(0.50)
  const [executedIds, setExecutedIds] = useState<Set<string>>(new Set(['sig-007']))

  const strategies = ['ALL', 'CrossSectionalRank_v3', 'MomentumBreakout_20d', 'RegimeSwitching_Trend', 'MeanReversion_VolAdjusted']

  const filteredSignals = signals.filter((sig) => {
    const matchesSearch =
      sig.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sig.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === 'ALL' || sig.action === actionFilter
    const matchesStrategy = strategyFilter === 'ALL' || sig.strategy === strategyFilter
    const matchesConf = sig.confidence >= minConfidence
    return matchesSearch && matchesAction && matchesStrategy && matchesConf
  })

  const handleExecute = (id: string) => {
    setExecutedIds((prev) => new Set([...prev, id]))
  }

  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 2 })
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
              QUANTITATIVE ALPHA SIGNALS // STATISTICAL CONVICTION
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-lg font-bold tracking-tight text-white uppercase">
                CROSS-SECTIONAL <span className="text-emerald-400">OPPORTUNITY MATRIX</span>
              </h1>
              <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800/90 border border-slate-700/80 text-emerald-300">
                OUT-OF-SAMPLE RANKED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('models')}
              className="px-3 py-1.5 rounded text-[11px] font-medium bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              Model Diagnostics
            </button>
            <button
              onClick={() => onNavigate('positions')}
              className="px-3 py-1.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              View Open Positions
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 space-y-3 shadow-lg">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="w-full lg:w-72">
            <Input
              icon={<Search className="w-3.5 h-3.5 text-slate-400" />}
              placeholder="Search ticker (e.g. RELIANCE)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">ACTION:</span>
            {(['ALL', 'BUY', 'SELL', 'HOLD'] as const).map((act) => (
              <button
                key={act}
                onClick={() => setActionFilter(act)}
                className={`px-3 py-1 text-[11px] rounded-md transition-all border ${
                  actionFilter === act
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm font-semibold'
                    : 'bg-[#070b14] text-slate-400 border-slate-800/80 hover:text-white hover:border-slate-700'
                }`}
              >
                {act}
              </button>
            ))}
          </div>

          {/* Strategy Filter */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">STRATEGY:</span>
            <select
              value={strategyFilter}
              onChange={(e) => setStrategyFilter(e.target.value)}
              className="bg-[#070b14] border border-slate-800/80 text-[11px] rounded-md text-slate-200 px-3 py-1.5 focus:outline-none focus:border-emerald-500/50"
            >
              {strategies.map((st) => (
                <option key={st} value={st}>
                  {st === 'ALL' ? 'ALL STRATEGIES' : st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Confidence Threshold Slider */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="uppercase text-[10px] tracking-wider text-slate-400">Min Model Conviction:</span>
            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-32 accent-emerald-400 cursor-pointer"
            />
            <span className="text-emerald-400 font-bold text-xs">{(minConfidence * 100).toFixed(0)}%</span>
          </div>
          <span className="text-slate-500 text-[10px]">
            Showing <strong className="text-slate-300">{filteredSignals.length}</strong> of {signals.length} generated signals
          </span>
        </div>
      </div>

      {/* Signals Table */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 text-[10px] uppercase bg-[#070b14]/70">
                <th className="p-3 font-semibold">SYMBOL</th>
                <th className="p-3 font-semibold">ACTION</th>
                <th className="p-3 font-semibold text-right">LTP (INR)</th>
                <th className="p-3 font-semibold">MODEL CONVICTION</th>
                <th className="p-3 font-semibold text-right">ENTRY</th>
                <th className="p-3 font-semibold text-right">STOP LOSS</th>
                <th className="p-3 font-semibold text-right">TARGET</th>
                <th className="p-3 font-semibold text-right">EXP. RETURN</th>
                <th className="p-3 font-semibold">STRATEGY</th>
                <th className="p-3 font-semibold text-right">TIMESTAMP</th>
                <th className="p-3 font-semibold text-center">EXECUTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredSignals.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 font-mono text-xs">
                    NO ACTIVE SIGNALS MATCHING CURRENT FILTER PARAMETERS.
                  </td>
                </tr>
              ) : (
                filteredSignals.map((sig) => {
                  const isExecuted = executedIds.has(sig.id)
                  const riskReward = Math.abs((sig.targetPrice - sig.entryPrice) / (sig.entryPrice - sig.stopLoss)).toFixed(2)
                  const isBuy = sig.action === 'BUY'
                  const isSell = sig.action === 'SELL'

                  return (
                    <tr
                      key={sig.id}
                      className="hover:bg-slate-800/30 transition-all duration-150 cursor-pointer group"
                      onClick={() => selectStockBySymbol(sig.symbol)}
                    >
                      <td className="p-3">
                        <span className="text-white font-bold text-xs group-hover:text-emerald-400 transition-colors block">
                          {sig.symbol}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block max-w-[150px]">
                          {sig.name}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${
                            isBuy
                              ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30'
                              : isSell
                              ? 'bg-rose-950/70 text-rose-400 border-rose-500/30'
                              : 'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          {sig.action}
                        </span>
                      </td>
                      <td className="p-3 text-right text-white font-semibold text-xs">
                        {formatINR(sig.entryPrice)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                              style={{ width: `${sig.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-emerald-300 font-bold text-[11px]">
                            {(sig.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        {sig.spreadRatio && (
                          <span className="text-[9px] text-slate-500 block mt-0.5">
                            Spread: {(sig.spreadRatio * 100).toFixed(0)}%
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right text-slate-300">{formatINR(sig.entryPrice)}</td>
                      <td className="p-3 text-right text-rose-400/80">{formatINR(sig.stopLoss)}</td>
                      <td className="p-3 text-right text-emerald-400 font-semibold">{formatINR(sig.targetPrice)}</td>
                      <td className="p-3 text-right">
                        <span
                          className={`font-bold text-xs ${
                            sig.expectedReturnPct > 0 ? 'text-emerald-400' : 'text-slate-400'
                          }`}
                        >
                          {sig.expectedReturnPct > 0 ? `+${sig.expectedReturnPct}%` : `${sig.expectedReturnPct}%`}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">R:R {riskReward}</span>
                      </td>
                      <td className="p-3 text-slate-300 text-[10px]">{sig.strategy}</td>
                      <td className="p-3 text-right text-slate-500 text-[10px] whitespace-nowrap">
                        {sig.timeAgo}
                      </td>
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {isExecuted ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> EXECUTED
                          </span>
                        ) : sig.action === 'HOLD' ? (
                          <span className="text-slate-600 text-[10px]">OBSERVE</span>
                        ) : (
                          <button
                            onClick={() => {
                              handleExecute(sig.id)
                              executeSignal(sig)
                            }}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all flex items-center gap-1 mx-auto ${
                              isBuy
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
                            }`}
                          >
                            <Zap className="w-2.5 h-2.5" />
                            {sig.action === 'BUY' ? 'BUY' : 'SHORT'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}