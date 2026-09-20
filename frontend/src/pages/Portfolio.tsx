import React, { useState } from 'react'
import {
  PieChart,
  Wallet,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react'
import { PageId } from '../types'
import { mockHoldings, mockPortfolioSummary } from '../data/mockData'
import { StatCard } from '../components/ui/StatCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useApp } from '../context/AppContext'

interface PortfolioProps {
  onNavigate: (page: PageId) => void
}

export const Portfolio: React.FC<PortfolioProps> = ({ onNavigate }) => {
  const { selectStockBySymbol } = useApp()
  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 2 })
  }

  // Calculate sector breakdown
  const sectorWeights = mockHoldings.reduce((acc, h) => {
    acc[h.sector] = (acc[h.sector] || 0) + h.weight
    return acc
  }, {} as Record<string, number>)

  const sortedSectors = Object.entries(sectorWeights).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold tracking-wider text-white uppercase">
            PORTFOLIO ASSET ALLOCATION & HOLDINGS
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Cash Equity Long-Only Portfolio • Rebalanced per Step 7 Risk Optimization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('positions')}>
            Active Positions
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('signals')}>
            Rebalance Review
          </Button>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Portfolio NAV"
          value={formatINR(mockPortfolioSummary.portfolioValue)}
          delta="+3.56% Overall"
          deltaType="positive"
          subtext="Net Asset Value"
        />
        <StatCard
          title="Invested Capital"
          value={formatINR(mockPortfolioSummary.investedCapital)}
          subtext={`${mockPortfolioSummary.exposurePct}% of Total Capital`}
        />
        <StatCard
          title="Available Cash Margin"
          value={formatINR(mockPortfolioSummary.availableCapital)}
          subtext="Unencumbered INR Balance"
        />
        <StatCard
          title="Unrealized Holdings P&L"
          value={formatINR(mockPortfolioSummary.overallPnl)}
          delta="+₹1.81 L"
          deltaType="positive"
          subtext="5 Active Holdings"
        />
      </div>

      {/* Allocation & Sector Weight Limit Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sector Allocation Breakdown */}
        <div className="lg:col-span-2 bg-surface border border-zinc-800 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3 pb-2 border-b border-zinc-900">
            <span className="uppercase tracking-wider">SECTOR CONCENTRATION & EXPOSURE</span>
            <span className="text-zinc-500 text-[11px]">Hard Ceiling: 25.0% Per Sector</span>
          </div>

          <div className="space-y-3.5">
            {sortedSectors.map(([sector, weight]) => {
              const isNearCeiling = weight >= 23.0

              return (
                <div key={sector} className="space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{sector}</span>
                    <span className="text-zinc-300 num">{weight.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 border border-zinc-800 relative">
                    <div
                      className="bg-white h-full transition-all"
                      style={{ width: `${(weight / 30) * 100}%` }}
                    />
                    {/* 25% guideline indicator */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-zinc-600 z-10"
                      style={{ left: `${(25 / 30) * 100}%` }}
                      title="25% Sector Risk Limit"
                    />
                  </div>
                  {isNearCeiling && (
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" /> High Concentration Warning (near 25% limit)
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Portfolio Risk Limits Status */}
        <div className="bg-surface border border-zinc-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3 pb-2 border-b border-zinc-900">
              <span className="uppercase tracking-wider">PORTFOLIO CONSTRAINTS</span>
              <Badge variant="subtle" size="sm">
                COMPLIANT
              </Badge>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between pb-2 border-b border-zinc-900">
                <span className="text-zinc-400">Total Stocks Held:</span>
                <span className="text-white font-medium num">{mockHoldings.length} / 8 Max</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-900">
                <span className="text-zinc-400">Max Single Stock Weight:</span>
                <span className="text-white font-medium num">23.8% (Reliance)</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-900">
                <span className="text-zinc-400">Equity Beta to NIFTY:</span>
                <span className="text-white font-medium num">{mockPortfolioSummary.betaNifty}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-900">
                <span className="text-zinc-400">1-Day VaR (95% CI):</span>
                <span className="text-white font-medium num">{mockPortfolioSummary.var95Pct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Current Cash Drag:</span>
                <span className="text-zinc-300 num">14.7%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-900 mt-4 text-[11px] font-mono text-zinc-500">
            Portfolio optimization adheres strictly to Mean-Variance and Inverse-Volatility allocation modes.
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-surface border border-zinc-800">
        <div className="flex items-center justify-between p-3 border-b border-zinc-800 text-xs font-mono text-zinc-400">
          <span className="uppercase tracking-wider">CURRENT HOLDINGS ROSTER ({mockHoldings.length})</span>
          <span className="text-[11px] text-zinc-500">Mark-to-market valuations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] bg-zinc-950/50">
                <th className="p-3 font-medium">INSTRUMENT</th>
                <th className="p-3 font-medium text-right">SHARES</th>
                <th className="p-3 font-medium text-right">AVG PRICE</th>
                <th className="p-3 font-medium text-right">LTP (INR)</th>
                <th className="p-3 font-medium text-right">INVESTED VALUE</th>
                <th className="p-3 font-medium text-right">CURRENT VALUE</th>
                <th className="p-3 font-medium text-right">UNREALIZED P&L</th>
                <th className="p-3 font-medium text-right">WEIGHT %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {mockHoldings.map((h) => (
                <tr
                  key={h.symbol}
                  className="hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                  onClick={() => selectStockBySymbol(h.symbol)}
                >
                  <td className="p-3">
                    <span className="text-white font-bold text-sm block group-hover:underline">{h.symbol}</span>
                    <span className="text-[10px] text-zinc-500">{h.name} • {h.sector}</span>
                  </td>
                  <td className="p-3 text-right text-white num">{h.shares}</td>
                  <td className="p-3 text-right text-zinc-300 num">{formatINR(h.averagePrice)}</td>
                  <td className="p-3 text-right text-white font-medium text-sm num">{formatINR(h.currentPrice)}</td>
                  <td className="p-3 text-right text-zinc-400 num">{formatINR(h.investedValue)}</td>
                  <td className="p-3 text-right text-white font-semibold num">{formatINR(h.currentValue)}</td>
                  <td className="p-3 text-right">
                    <span className="text-white font-semibold num block">
                      +{formatINR(h.pnl)}
                    </span>
                    <span className="text-[10px] text-zinc-400 block num">
                      +{h.pnlPercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-3 text-right text-white font-medium num">
                    {h.weight.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
