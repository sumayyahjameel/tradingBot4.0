import React, { useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  ExternalLink,
  Zap,
} from 'lucide-react'
import { PageId, TradingSignal } from '../types'
import {
  mockPortfolioSummary,
  mockEquityCurve,
  mockIndices,
  mockSignals,
  mockSystemLogs,
  mockSystemState,
} from '../data/mockData'
import { StatCard } from '../components/ui/StatCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { MonochromeAreaChart } from '../components/charts/MonochromeAreaChart'
import { useApp } from '../context/AppContext'

interface DashboardProps {
  onNavigate: (page: PageId) => void
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { selectStockBySymbol, executeSignal } = useApp()
  const [chartTimeframe, setChartTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1Y')

  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 2 })
  }

  const chartData = mockEquityCurve.map((pt) => ({
    label: pt.date,
    value: pt.equity,
    secondaryValue: pt.benchmark,
  }))

  const activeSignals = mockSignals.filter((s) => s.status === 'ACTIVE').slice(0, 5)

  return (
    <div className="space-y-6 bg-slate-950 min-h-screen p-6 text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-mono font-bold tracking-wider text-white uppercase">
              EXECUTIVE PORTFOLIO & ALPHA DASHBOARD
            </h1>
            <Badge variant="buy" size="sm">
              LIVE SIMULATION
            </Badge>
          </div>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Indian Equity Universe (NIFTY 500) • Institutional Execution • Point-in-Time Alpha
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('signals')}>
            View All Signals ({mockSignals.length})
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('positions')}>
            Manage Positions
          </Button>
        </div>
      </div>

      {/* Top 6 KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Portfolio Value"
          value={formatINR(mockPortfolioSummary.portfolioValue)}
          delta="+3.56%"
          deltaType="positive"
          subtext="Total Net Equity"
          sparkline={[5100000, 5150000, 5190000, 5230000, 5271565]}
        />
        <StatCard
          title="Today's P&L"
          value={formatINR(mockPortfolioSummary.todayPnl)}
          delta="+0.73%"
          deltaType="positive"
          subtext="Session Change"
        />
        <StatCard
          title="Overall P&L"
          value={formatINR(mockPortfolioSummary.overallPnl)}
          delta="+₹1.81 L"
          deltaType="positive"
          subtext="Since Inception"
        />
        <StatCard
          title="Available Cash"
          value={formatINR(mockPortfolioSummary.availableCapital)}
          subtext="Free Margin"
        />
        <StatCard
          title="Total Exposure"
          value={`${mockPortfolioSummary.exposurePct}%`}
          subtext="₹43.6L Invested"
        />
        <StatCard
          title="Win Rate"
          value={`${mockPortfolioSummary.winRatePct}%`}
          delta="142 Trades"
          subtext="Profit Factor: 2.14"
        />
      </div>

      {/* Main Grid: Chart & Risk Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Performance Equity Chart */}
        <div className="lg:col-span-2 bg-surface border border-zinc-800 p-4 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Portfolio Net Asset Value vs NIFTY 50 Benchmark
              </div>
              <div className="text-xl font-mono font-semibold text-white mt-0.5">
                {formatINR(mockPortfolioSummary.portfolioValue)}{' '}
                <span className="text-xs font-normal text-zinc-400 font-mono">
                  (+17.14% Alpha Spread)
                </span>
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="inline-flex bg-zinc-950 border border-zinc-800 p-0.5 text-xs font-mono">
              {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`px-2.5 py-1 transition-colors ${
                    chartTimeframe === tf
                      ? 'bg-white text-black font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <MonochromeAreaChart
            data={chartData}
            height={260}
            primaryLabel="APEX NAV"
            secondaryLabel="NIFTY 50"
          />

          <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-zinc-900 text-xs font-mono">
            <div>
              <span className="text-zinc-500 text-[10px] block">SHARPE RATIO</span>
              <span className="text-white font-medium num">{mockPortfolioSummary.sharpeRatio}</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block">MAX DRAWDOWN</span>
              <span className="text-zinc-300 font-medium num">-{mockPortfolioSummary.maxDrawdownPct}%</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block">BETA (VS NIFTY)</span>
              <span className="text-white font-medium num">{mockPortfolioSummary.betaNifty}</span>
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block">DAILY VAR (95%)</span>
              <span className="text-white font-medium num">{mockPortfolioSummary.var95Pct}%</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Market Overview & Risk Monitor */}
        <div className="space-y-4">
          {/* Market Overview Box */}
          <div className="bg-surface border border-zinc-800 p-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3 pb-2 border-b border-zinc-900">
              <span className="uppercase tracking-wider">MARKET OVERVIEW</span>
              <button
                onClick={() => onNavigate('market')}
                className="text-white hover:underline flex items-center gap-1 text-[11px]"
              >
                Full Market <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {mockIndices.map((idx) => (
                <div
                  key={idx.id}
                  className="flex items-center justify-between text-xs font-mono p-1.5 hover:bg-zinc-900/40 border-b border-zinc-900/60 last:border-0"
                >
                  <div>
                    <span className="text-white font-medium block">{idx.name}</span>
                    <span className="text-[10px] text-zinc-500">{idx.volume} vol</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-medium block num">
                      {idx.current.toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`text-[10px] ${
                        idx.changePercent >= 0 ? 'text-zinc-200' : 'text-zinc-500'
                      }`}
                    >
                      {idx.changePercent >= 0 ? `+${idx.changePercent}%` : `${idx.changePercent}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bot Execution & Health Monitor */}
          <div className="bg-surface border border-zinc-800 p-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3 pb-2 border-b border-zinc-900">
              <span className="uppercase tracking-wider">BOT ENGINE TELEMETRY</span>
              <span className="text-zinc-300 text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-white" /> HEALTHY
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-400">Execution Mode:</span>
                <span className="text-white font-semibold">{mockSystemState.executionMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Active Signals:</span>
                <span className="text-white num">{activeSignals.length} opportunities</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Daily Trades Done:</span>
                <span className="text-white num">
                  {mockSystemState.dailyTradeCount} / {mockSystemState.maxDailyTrades} max
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Engine Uptime:</span>
                <span className="text-zinc-300">{mockSystemState.uptime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: Live Signals & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Signals Preview Table */}
        <div className="lg:col-span-2 bg-surface border border-zinc-800 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3 pb-2 border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-white" />
              <span className="uppercase tracking-wider text-white">LIVE QUANTITATIVE SIGNALS</span>
              <Badge variant="subtle" size="sm">
                ZERO LOOKAHEAD
              </Badge>
            </div>
            <button
              onClick={() => onNavigate('signals')}
              className="text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1"
            >
              View All ({mockSignals.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                  <th className="pb-2 font-medium">SYMBOL</th>
                  <th className="pb-2 font-medium">ACTION</th>
                  <th className="pb-2 font-medium">PRICE</th>
                  <th className="pb-2 font-medium">CONFIDENCE</th>
                  <th className="pb-2 font-medium">TARGET / SL</th>
                  <th className="pb-2 font-medium">STRATEGY</th>
                  <th className="pb-2 font-medium">TIME</th>
                  <th className="pb-2 font-medium text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {activeSignals.map((sig) => (
                  <tr
                    key={sig.id}
                    className="hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                    onClick={() => selectStockBySymbol(sig.symbol)}
                  >
                    <td className="py-2.5">
                      <span className="text-white font-semibold group-hover:underline block">{sig.symbol}</span>
                      <span className="text-[10px] text-zinc-500">{sig.name}</span>
                    </td>
                    <td className="py-2.5">
                      <Badge
                        variant={
                          sig.action === 'BUY'
                            ? 'buy'
                            : sig.action === 'SELL'
                            ? 'sell'
                            : 'hold'
                        }
                        size="sm"
                      >
                        {sig.action}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-white num">{formatINR(sig.entryPrice)}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-zinc-900 h-1.5 overflow-hidden">
                          <div
                            className="bg-white h-full"
                            style={{ width: `${sig.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-zinc-300 num">
                          {(sig.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className="text-white num block">T: {formatINR(sig.targetPrice)}</span>
                      <span className="text-[10px] text-zinc-500 num">SL: {formatINR(sig.stopLoss)}</span>
                    </td>
                    <td className="py-2.5 text-zinc-400 text-[11px]">{sig.strategy}</td>
                    <td className="py-2.5 text-zinc-500 text-[11px]">{sig.timeAgo}</td>
                    <td className="py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => executeSignal(sig)}
                      >
                        SIMULATE
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Recent Execution Audit Feed */}
        <div className="bg-surface border border-zinc-800 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3 pb-2 border-b border-zinc-900">
            <span className="uppercase tracking-wider">SYSTEM LOGS & ACTIVITY</span>
            <button
              onClick={() => onNavigate('system')}
              className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
            >
              Terminal <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {mockSystemLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="text-xs font-mono border-l border-zinc-800 pl-2.5 py-0.5">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-0.5">
                  <span className="text-zinc-300 font-semibold">{log.module}</span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{log.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
