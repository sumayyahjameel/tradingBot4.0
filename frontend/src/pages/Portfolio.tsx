import React, { useState } from 'react'
import {
  PieChart,
  Wallet,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  ExternalLink,
  Layers,
  Sparkles,
  Wifi,
  Scale,
} from 'lucide-react'
import { PageId } from '../types'
import { mockHoldings, mockPortfolioSummary } from '../data/mockData'
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
              QUANT ASSET DISPATCH // RISK OPTIMIZATION ENGINE
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-normal flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                MVO Active
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-lg font-bold tracking-tight text-white uppercase">
                PORTFOLIO ALLOCATION & <span className="text-emerald-400">HOLDINGS MATRIX</span>
              </h1>
              <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800/90 border border-slate-700/80 text-emerald-300">
                STEP-7 CONSTRAINED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('positions')}
              className="px-3 py-1.5 rounded text-[11px] font-medium bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Active Positions
            </button>
            <button
              onClick={() => onNavigate('signals')}
              className="px-3 py-1.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Rebalance Review
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Total Portfolio NAV</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> +3.56%
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {formatINR(mockPortfolioSummary.portfolioValue)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Net Asset Value</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Invested Capital</span>
            <span className="text-[10px] text-slate-400">{mockPortfolioSummary.exposurePct}% Deployed</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {formatINR(mockPortfolioSummary.investedCapital)}
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-800">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              style={{ width: `${mockPortfolioSummary.exposurePct}%` }}
            />
          </div>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Available Margin</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Liquid</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {formatINR(mockPortfolioSummary.availableCapital)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Unencumbered INR Balance</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Unrealized P&L</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
              +₹1.81 L
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            +{formatINR(mockPortfolioSummary.overallPnl)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">5 Active Holdings</p>
        </div>
      </div>

      {/* Allocation & Sector Weight Limit Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sector Allocation Breakdown */}
        <div className="lg:col-span-2 rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-emerald-400" />
              <span className="uppercase font-semibold tracking-wider text-slate-300 text-[11px]">
                Sector Concentration & Exposure
              </span>
            </div>
            <span className="text-slate-500 text-[10px]">Hard Ceiling: 25.0% Per Sector</span>
          </div>

          <div className="space-y-3">
            {sortedSectors.map(([sector, weight]) => {
              const isNearCeiling = weight >= 23.0

              return (
                <div key={sector} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-[11px]">{sector}</span>
                    <span className="text-emerald-400 font-bold text-[11px]">{weight.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full border border-slate-800 relative overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isNearCeiling
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]'
                          : 'bg-gradient-to-r from-teal-500 via-emerald-400 to-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                      }`}
                      style={{ width: `${(weight / 30) * 100}%` }}
                    />
                    {/* 25% guideline indicator */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-500/80 z-10"
                      style={{ left: `${(25 / 30) * 100}%` }}
                      title="25% Sector Risk Limit"
                    />
                  </div>
                  {isNearCeiling && (
                    <span className="text-[9px] text-rose-400 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-2.5 h-2.5" /> High Concentration Warning (near 25% hard limit)
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Portfolio Risk Limits Status */}
        <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span className="uppercase font-semibold tracking-wider text-slate-300 text-[11px]">
                  Portfolio Constraints
                </span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> COMPLIANT
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-slate-800/40">
                <span className="text-slate-400 text-[11px]">Total Stocks Held:</span>
                <span className="text-white font-bold">{mockHoldings.length} / 8 Max</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/40">
                <span className="text-slate-400 text-[11px]">Max Single Stock Weight:</span>
                <span className="text-emerald-400 font-bold">23.8% (Reliance)</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/40">
                <span className="text-slate-400 text-[11px]">Equity Beta to NIFTY:</span>
                <span className="text-white font-bold">{mockPortfolioSummary.betaNifty}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/40">
                <span className="text-slate-400 text-[11px]">1-Day VaR (95% CI):</span>
                <span className="text-white font-bold">{mockPortfolioSummary.var95Pct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Current Cash Drag:</span>
                <span className="text-slate-300 font-bold">14.7%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/60 mt-4 text-[10px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Adheres strictly to Mean-Variance & Inverse-Vol allocations.
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-3.5 border-b border-slate-800/70 text-xs text-slate-400">
          <span className="uppercase tracking-wider font-semibold text-slate-300 text-[11px]">
            CURRENT HOLDINGS ROSTER ({mockHoldings.length})
          </span>
          <span className="text-[10px] text-slate-500">Mark-to-market valuations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 text-[10px] uppercase bg-[#070b14]/70">
                <th className="p-3 font-semibold">INSTRUMENT</th>
                <th className="p-3 font-semibold text-right">SHARES</th>
                <th className="p-3 font-semibold text-right">AVG PRICE</th>
                <th className="p-3 font-semibold text-right">LTP (INR)</th>
                <th className="p-3 font-semibold text-right">INVESTED VALUE</th>
                <th className="p-3 font-semibold text-right">CURRENT VALUE</th>
                <th className="p-3 font-semibold text-right">UNREALIZED P&L</th>
                <th className="p-3 font-semibold text-right">WEIGHT %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {mockHoldings.map((h) => (
                <tr
                  key={h.symbol}
                  className="hover:bg-slate-800/30 transition-all duration-150 cursor-pointer group"
                  onClick={() => selectStockBySymbol(h.symbol)}
                >
                  <td className="p-3">
                    <span className="text-white font-bold text-xs group-hover:text-emerald-400 transition-colors block">
                      {h.symbol}
                    </span>
                    <span className="text-[10px] text-slate-500">{h.name} • {h.sector}</span>
                  </td>
                  <td className="p-3 text-right text-slate-300">{h.shares}</td>
                  <td className="p-3 text-right text-slate-400">{formatINR(h.averagePrice)}</td>
                  <td className="p-3 text-right text-white font-semibold text-xs">{formatINR(h.currentPrice)}</td>
                  <td className="p-3 text-right text-slate-400">{formatINR(h.investedValue)}</td>
                  <td className="p-3 text-right text-white font-bold">{formatINR(h.currentValue)}</td>
                  <td className="p-3 text-right">
                    <span className="text-emerald-400 font-bold block text-xs">
                      +{formatINR(h.pnl)}
                    </span>
                    <span className="text-[10px] text-emerald-500/80 block mt-0.5">
                      +{h.pnlPercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-900 border border-slate-800 text-slate-200">
                      {h.weight.toFixed(1)}%
                    </span>
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