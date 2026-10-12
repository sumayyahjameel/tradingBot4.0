import React, { useState, useEffect } from 'react'
import {
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  Shield,
  Sliders,
  Download,
  Wifi,
  Sparkles,
  TrendingUp,
  Crosshair,
} from 'lucide-react'
import { PortfolioPosition, PageId } from '../types'
import { mockPositions } from '../data/mockData'
import { useApp } from '../context/AppContext'

interface PositionsProps {
  onNavigate: (page: PageId) => void
}

export const Positions: React.FC<PositionsProps> = ({ onNavigate }) => {
  const { selectStockBySymbol, closePositionSimulated, addToast } = useApp()
  const [positions, setPositions] = useState<PortfolioPosition[]>(mockPositions)
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set())
  const [tick, setTick] = useState(0)

  // Real-time market tick simulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1)
    }, 80)
    return () => clearInterval(timer)
  }, [])

  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 2 })
  }

  const handleClosePosition = (pos: PortfolioPosition) => {
    setClosedIds((prev) => new Set([...prev, pos.id]))
    closePositionSimulated(pos.symbol, pos.unrealizedPnl)
  }

  const handleExportCSV = () => {
    const active = positions.filter((p) => !closedIds.has(p.id))
    const headers = 'Symbol,Side,Quantity,EntryPrice,LTP,CurrentValue,UnrealizedPnL,WeightPct\n'
    const rows = active
      .map(
        (p) =>
          `${p.symbol},${p.side},${p.quantity},${p.avgEntryPrice},${p.ltp},${p.currentValue},${p.unrealizedPnl},${p.portfolioWeight}%`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `apex_positions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    addToast({
      title: 'POSITIONS EXPORTED',
      description: `Downloaded ${active.length} active positions as CSV.`,
      type: 'info',
    })
  }

  const activePositions = positions.filter((p) => !closedIds.has(p.id))

  const totalUnrealized = activePositions.reduce((sum, p) => sum + p.unrealizedPnl, 0)
  const totalValue = activePositions.reduce((sum, p) => sum + p.currentValue, 0)
  const totalRealized = positions.reduce((sum, p) => sum + p.realizedPnl, 0)

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
              REALTIME INTRADAY BOOK // TRAILING RISK GATES
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-normal flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                NSE Live Fills
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-lg font-bold tracking-tight text-white uppercase">
                ACTIVE TRADING <span className="text-emerald-400">POSITIONS MATRIX</span>
              </h1>
              <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800/90 border border-slate-700/80 text-emerald-300">
                {activePositions.length} IN TRANSIT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded text-[11px] font-medium bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              Export CSV
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className="px-3 py-1.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Portfolio Overview
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Open Positions</span>
            <span className="text-[10px] text-emerald-400 font-semibold">{activePositions.length}/8 Max</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {activePositions.length} Active
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Execution Slot Nominal</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Active Capital</span>
            <span className="text-[10px] text-slate-400">In Trades</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {formatINR(totalValue)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Net Position Exposure</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Net Unrealized P&L</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5 animate-pulse">
              <TrendingUp className="w-2.5 h-2.5" /> +3.62%
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            +{formatINR(totalUnrealized)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Mark-To-Market Value</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Realized Session</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
              Booked
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            +{formatINR(totalRealized)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Cumulative Session P&L</p>
        </div>
      </div>

      {/* Positions Table */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-3.5 border-b border-slate-800/70 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase tracking-wider font-semibold text-slate-300 text-[11px]">
              PORTFOLIO BOOK: {activePositions.length} ACTIVE POSITIONS
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Execution Venue: NSE Cash Terminal</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 text-[10px] uppercase bg-[#070b14]/70">
                <th className="p-3 font-semibold">INSTRUMENT</th>
                <th className="p-3 font-semibold">SIDE</th>
                <th className="p-3 font-semibold text-right">QTY</th>
                <th className="p-3 font-semibold text-right">AVG ENTRY</th>
                <th className="p-3 font-semibold text-right">LTP (INR)</th>
                <th className="p-3 font-semibold text-right">CURRENT VALUE</th>
                <th className="p-3 font-semibold text-right">UNREALIZED P&L</th>
                <th className="p-3 font-semibold text-right">WEIGHT %</th>
                <th className="p-3 font-semibold text-right">STOP LOSS</th>
                <th className="p-3 font-semibold text-right">TRAILING SL</th>
                <th className="p-3 font-semibold text-right">TARGET</th>
                <th className="p-3 font-semibold text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {activePositions.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-slate-500 font-mono text-xs">
                    NO ACTIVE POSITIONS CURRENTLY OPEN.
                  </td>
                </tr>
              ) : (
                activePositions.map((pos) => {
                  const isLong = pos.side === 'LONG'
                  const pnlPositive = pos.unrealizedPnl >= 0
                  const liveLtp = pos.ltp + Math.sin(tick * 0.1) * 0.4

                  return (
                    <tr
                      key={pos.id}
                      className="hover:bg-slate-800/30 transition-all duration-150 cursor-pointer group"
                      onClick={() => selectStockBySymbol(pos.symbol)}
                    >
                      <td className="p-3">
                        <span className="text-white font-bold text-xs group-hover:text-emerald-400 transition-colors block">
                          {pos.symbol}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block max-w-[140px]">
                          {pos.name}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${
                            isLong
                              ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-950/70 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {pos.side}
                        </span>
                      </td>
                      <td className="p-3 text-right text-slate-300">{pos.quantity}</td>
                      <td className="p-3 text-right text-slate-400">{formatINR(pos.avgEntryPrice)}</td>
                      <td className="p-3 text-right text-white font-bold text-xs">{formatINR(liveLtp)}</td>
                      <td className="p-3 text-right text-slate-200">{formatINR(pos.currentValue)}</td>
                      <td className="p-3 text-right">
                        <span
                          className={`font-bold block text-xs ${
                            pnlPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {pnlPositive ? `+${formatINR(pos.unrealizedPnl)}` : formatINR(pos.unrealizedPnl)}
                        </span>
                        <span
                          className={`text-[10px] block mt-0.5 ${
                            pnlPositive ? 'text-emerald-500/80' : 'text-rose-400/80'
                          }`}
                        >
                          {pos.unrealizedPnlPercent >= 0
                            ? `+${pos.unrealizedPnlPercent.toFixed(2)}%`
                            : `${pos.unrealizedPnlPercent.toFixed(2)}%`}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300">
                          {pos.portfolioWeight}%
                        </span>
                      </td>
                      <td className="p-3 text-right text-rose-400/80">{formatINR(pos.stopLoss)}</td>
                      <td className="p-3 text-right text-amber-300/90 font-medium">
                        {formatINR(pos.trailingSl)}
                      </td>
                      <td className="p-3 text-right text-emerald-400 font-semibold">{formatINR(pos.takeProfit)}</td>
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleClosePosition(pos)}
                          className="px-2.5 py-1 rounded text-[10px] font-bold bg-rose-950/40 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-400 shadow-sm transition-all"
                        >
                          CLOSE
                        </button>
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