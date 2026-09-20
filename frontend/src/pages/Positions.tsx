import React, { useState } from 'react'
import {
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  Shield,
  Sliders,
} from 'lucide-react'
import { PortfolioPosition, PageId } from '../types'
import { mockPositions } from '../data/mockData'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { StatCard } from '../components/ui/StatCard'
import { Download } from 'lucide-react'
import { useApp } from '../context/AppContext'

interface PositionsProps {
  onNavigate: (page: PageId) => void
}

export const Positions: React.FC<PositionsProps> = ({ onNavigate }) => {
  const { selectStockBySymbol, closePositionSimulated, addToast } = useApp()
  const [positions, setPositions] = useState<PortfolioPosition[]>(mockPositions)
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set())

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold tracking-wider text-white uppercase">
            OPEN TRADING POSITIONS
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Real-Time Position Tracking, Trailing Stops, and Risk-Weighted Limits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-3.5 h-3.5 mr-1" />
            Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('portfolio')}>
            Portfolio Overview
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Positions"
          value={`${activePositions.length} Active`}
          subtext="Max Allowed: 8 Positions"
        />
        <StatCard
          title="Active Capital in Trades"
          value={formatINR(totalValue)}
          subtext="Net Position Value"
        />
        <StatCard
          title="Net Unrealized P&L"
          value={`+${formatINR(totalUnrealized)}`}
          delta="+3.62%"
          deltaType="positive"
          subtext="Mark to Market"
        />
        <StatCard
          title="Closed Trade Realized P&L"
          value={`+${formatINR(totalRealized)}`}
          delta="Session Realized"
          deltaType="positive"
          subtext="Cumulative P&L"
        />
      </div>

      {/* Positions Table */}
      <div className="bg-surface border border-zinc-800">
        <div className="flex items-center justify-between p-3 border-b border-zinc-800 text-xs font-mono text-zinc-400">
          <span className="uppercase tracking-wider">
            PORTFOLIO BOOK: {activePositions.length} ACTIVE POSITIONS
          </span>
          <span className="text-[11px] text-zinc-500">Execution Venue: NSE Cash Market</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] bg-zinc-950/50">
                <th className="p-3 font-medium">INSTRUMENT</th>
                <th className="p-3 font-medium">SIDE</th>
                <th className="p-3 font-medium text-right">QTY</th>
                <th className="p-3 font-medium text-right">AVG ENTRY</th>
                <th className="p-3 font-medium text-right">LTP (INR)</th>
                <th className="p-3 font-medium text-right">CURRENT VALUE</th>
                <th className="p-3 font-medium text-right">UNREALIZED P&L</th>
                <th className="p-3 font-medium text-right">WEIGHT %</th>
                <th className="p-3 font-medium text-right">STOP LOSS</th>
                <th className="p-3 font-medium text-right">TRAILING SL</th>
                <th className="p-3 font-medium text-right">TARGET</th>
                <th className="p-3 font-medium text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {activePositions.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-zinc-500 font-mono">
                    NO ACTIVE POSITIONS CURRENTLY OPEN.
                  </td>
                </tr>
              ) : (
                activePositions.map((pos) => (
                  <tr
                    key={pos.id}
                    className="hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                    onClick={() => selectStockBySymbol(pos.symbol)}
                  >
                    <td className="p-3">
                      <span className="text-white font-bold text-sm block group-hover:underline">{pos.symbol}</span>
                      <span className="text-[10px] text-zinc-500 truncate block max-w-[140px]">
                        {pos.name}
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge variant={pos.side === 'LONG' ? 'buy' : 'sell'} size="sm">
                        {pos.side}
                      </Badge>
                    </td>
                    <td className="p-3 text-right text-white font-medium num">{pos.quantity}</td>
                    <td className="p-3 text-right text-zinc-300 num">{formatINR(pos.avgEntryPrice)}</td>
                    <td className="p-3 text-right text-white font-semibold text-sm num">{formatINR(pos.ltp)}</td>
                    <td className="p-3 text-right text-white num">{formatINR(pos.currentValue)}</td>
                    <td className="p-3 text-right">
                      <span
                        className={`font-semibold num block ${
                          pos.unrealizedPnl >= 0 ? 'text-white' : 'text-zinc-400'
                        }`}
                      >
                        {pos.unrealizedPnl >= 0 ? `+${formatINR(pos.unrealizedPnl)}` : formatINR(pos.unrealizedPnl)}
                      </span>
                      <span className="text-[10px] text-zinc-400 block num">
                        {pos.unrealizedPnlPercent >= 0
                          ? `+${pos.unrealizedPnlPercent.toFixed(2)}%`
                          : `${pos.unrealizedPnlPercent.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="p-3 text-right text-white font-medium num">{pos.portfolioWeight}%</td>
                    <td className="p-3 text-right text-zinc-400 num">{formatINR(pos.stopLoss)}</td>
                    <td className="p-3 text-right text-zinc-300 num font-medium">{formatINR(pos.trailingSl)}</td>
                    <td className="p-3 text-right text-white num font-medium">{formatINR(pos.takeProfit)}</td>
                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleClosePosition(pos)}
                      >
                        CLOSE
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
