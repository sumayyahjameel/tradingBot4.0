import React, { useState } from 'react'
import {
  Activity,
  Filter,
  Search,
  ArrowUpDown,
  Zap,
  CheckCircle2,
  Info,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-mono font-bold tracking-wider text-white uppercase">
              QUANTITATIVE ALPHA SIGNALS
            </h1>
            <Badge variant="subtle" size="sm">
              OUT-OF-SAMPLE RANKING
            </Badge>
          </div>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Machine Learning Probabilities & Multi-Factor Cross-Sectional Opportunity Rankings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('models')}>
            Model Diagnostics
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('positions')}>
            View Open Positions
          </Button>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="bg-surface border border-zinc-800 p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="w-full lg:w-72">
            <Input
              icon={<Search className="w-4 h-4" />}
              placeholder="Search ticker (e.g. RELIANCE)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto">
            <span className="text-[11px] font-mono text-zinc-500 uppercase mr-1">ACTION:</span>
            {(['ALL', 'BUY', 'SELL', 'HOLD'] as const).map((act) => (
              <button
                key={act}
                onClick={() => setActionFilter(act)}
                className={`px-3 py-1 text-xs font-mono border transition-colors ${
                  actionFilter === act
                    ? 'bg-white text-black border-white font-medium'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                {act}
              </button>
            ))}
          </div>

          {/* Strategy Filter */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto">
            <span className="text-[11px] font-mono text-zinc-500 uppercase mr-1">STRATEGY:</span>
            <select
              value={strategyFilter}
              onChange={(e) => setStrategyFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-xs font-mono text-white px-2.5 py-1 focus:outline-none focus:border-zinc-500"
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
        <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="uppercase text-[11px]">Min Model Conviction:</span>
            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-32 accent-white cursor-pointer"
            />
            <span className="text-white font-semibold num">{(minConfidence * 100).toFixed(0)}%</span>
          </div>
          <span className="text-zinc-500 text-[11px]">
            Showing {filteredSignals.length} of {signals.length} generated signals
          </span>
        </div>
      </div>

      {/* Signals Table */}
      <div className="bg-surface border border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] bg-zinc-950/50">
                <th className="p-3 font-medium">SYMBOL</th>
                <th className="p-3 font-medium">ACTION</th>
                <th className="p-3 font-medium text-right">LTP (INR)</th>
                <th className="p-3 font-medium">MODEL CONVICTION</th>
                <th className="p-3 font-medium text-right">ENTRY</th>
                <th className="p-3 font-medium text-right">STOP LOSS</th>
                <th className="p-3 font-medium text-right">TARGET</th>
                <th className="p-3 font-medium text-right">EXP. RETURN</th>
                <th className="p-3 font-medium">STRATEGY</th>
                <th className="p-3 font-medium text-right">TIMESTAMP</th>
                <th className="p-3 font-medium text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredSignals.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-zinc-500 font-mono">
                    NO ACTIVE SIGNALS MATCHING CURRENT FILTER PARAMETERS.
                  </td>
                </tr>
              ) : (
                filteredSignals.map((sig) => {
                  const isExecuted = executedIds.has(sig.id)
                  const riskReward = Math.abs((sig.targetPrice - sig.entryPrice) / (sig.entryPrice - sig.stopLoss)).toFixed(2)

                  return (
                    <tr
                      key={sig.id}
                      className="hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                      onClick={() => selectStockBySymbol(sig.symbol)}
                    >
                      <td className="p-3">
                        <span className="text-white font-bold text-sm block group-hover:underline">{sig.symbol}</span>
                        <span className="text-[10px] text-zinc-500 truncate block max-w-[150px]">
                          {sig.name}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            sig.action === 'BUY'
                              ? 'buy'
                              : sig.action === 'SELL'
                              ? 'sell'
                              : 'hold'
                          }
                          size="md"
                        >
                          {sig.action}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-white font-medium text-sm num">
                        {formatINR(sig.entryPrice)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-zinc-900 h-2 border border-zinc-800">
                            <div
                              className="bg-white h-full transition-all"
                              style={{ width: `${sig.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-medium num text-xs">
                            {(sig.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        {sig.spreadRatio && (
                          <span className="text-[10px] text-zinc-500 block">
                            Spread: {(sig.spreadRatio * 100).toFixed(0)}%
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right text-zinc-300 num">{formatINR(sig.entryPrice)}</td>
                      <td className="p-3 text-right text-zinc-400 num">{formatINR(sig.stopLoss)}</td>
                      <td className="p-3 text-right text-white font-medium num">{formatINR(sig.targetPrice)}</td>
                      <td className="p-3 text-right num">
                        <span
                          className={`font-semibold ${
                            sig.expectedReturnPct > 0 ? 'text-white' : 'text-zinc-400'
                          }`}
                        >
                          {sig.expectedReturnPct > 0 ? `+${sig.expectedReturnPct}%` : `${sig.expectedReturnPct}%`}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">R:R {riskReward}</span>
                      </td>
                      <td className="p-3 text-zinc-300 text-[11px]">{sig.strategy}</td>
                      <td className="p-3 text-right text-zinc-500 text-[11px] whitespace-nowrap">
                        {sig.timeAgo}
                      </td>
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {isExecuted ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400">
                            <CheckCircle2 className="w-3 h-3 text-white" /> EXECUTED
                          </span>
                        ) : sig.action === 'HOLD' ? (
                          <span className="text-zinc-600 text-[11px] font-mono">OBSERVE</span>
                        ) : (
                          <Button
                            variant={sig.action === 'BUY' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => {
                              handleExecute(sig.id)
                              executeSignal(sig)
                            }}
                          >
                            <Zap className="w-3 h-3" />
                            {sig.action === 'BUY' ? 'BUY' : 'SHORT'}
                          </Button>
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
