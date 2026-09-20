import React, { useState } from 'react'
import {
  Play,
  Calendar,
  Layers,
  Percent,
  TrendingUp,
  BarChart3,
  Sliders,
  CheckCircle2,
  RefreshCw,
  FileDown,
} from 'lucide-react'
import { BacktestResult, PageId } from '../types'
import { mockBacktestResult } from '../data/mockData'
import { StatCard } from '../components/ui/StatCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { MonochromeAreaChart } from '../components/charts/MonochromeAreaChart'
import { useApp } from '../context/AppContext'

interface BacktestsProps {
  onNavigate: (page: PageId) => void
}

export const Backtests: React.FC<BacktestsProps> = ({ onNavigate }) => {
  const { selectStockBySymbol, addToast } = useApp()
  const [strategy, setStrategy] = useState('CrossSectionalRank_v3')
  const [universe, setUniverse] = useState('NIFTY 500 Active PIT')
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2026-09-15')
  const [initialCapital, setInitialCapital] = useState('10000000')
  const [positionSizing, setPositionSizing] = useState('SCORE_WEIGHTED')
  const [slippagePct, setSlippagePct] = useState('0.05')
  const [feeRatePct, setFeeRatePct] = useState('0.08')
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<'equity' | 'drawdown' | 'trades'>('equity')
  const [result, setResult] = useState<BacktestResult>(mockBacktestResult)

  const handleRunBacktest = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      setResult({
        ...mockBacktestResult,
        strategy,
        universe,
        startDate,
        endDate,
        initialCapital: parseFloat(initialCapital) || 10000000,
      })
      addToast({
        title: 'WALK-FORWARD SIMULATION COMPLETE',
        description: `Model: ${strategy} | Sharpe: 2.14 | Total Return: +38.4% | Max DD: -11.4%`,
        type: 'success',
      })
    }, 800)
  }

  const handleExportCSV = () => {
    const headers = 'TradeID,Symbol,Side,EntryDate,ExitDate,EntryPrice,ExitPrice,Shares,PnL,PnLPct,ExitReason\n'
    const rows = result.trades
      .map(
        (t) =>
          `${t.id},${t.symbol},${t.side},${t.entryDate},${t.exitDate},${t.entryPrice},${t.exitPrice},${t.shares},${t.pnl},${t.pnlPct}%,${t.exitReason}`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `apex_backtest_trades_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)

    addToast({
      title: 'BACKTEST TRADES EXPORTED',
      description: `Downloaded ${result.trades.length} simulation trades as CSV.`,
      type: 'info',
    })
  }

  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 2 })
  }

  const chartData = result.equityCurve.map((pt) => ({
    label: pt.date,
    value: activeTab === 'drawdown' ? pt.drawdown : pt.equity,
    secondaryValue: activeTab === 'drawdown' ? undefined : pt.benchmark,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold tracking-wider text-white uppercase">
            HISTORICAL BACKTESTING ENGINE
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Walk-Forward Evaluation with Realistic Slippage, Exchange Fees & Zero Lookahead Invariants
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onNavigate('models')}>
            Inspect Model
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportCSV}>
            <FileDown className="w-3.5 h-3.5 mr-1" /> Export Teardown (CSV)
          </Button>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="bg-surface border border-zinc-800 p-4">
        <div className="text-xs font-mono text-zinc-400 mb-3 pb-2 border-b border-zinc-900 uppercase tracking-wider flex items-center justify-between">
          <span>SIMULATION PARAMETERS</span>
          <span className="text-[11px] text-zinc-500">Execution Frequency: Daily Bar Close</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Strategy */}
          <div>
            <label className="text-zinc-400 block mb-1">STRATEGY MODEL:</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white py-1.5 px-2 focus:outline-none focus:border-zinc-500"
            >
              <option value="CrossSectionalRank_v3">CrossSectionalRank_v3 (Ridge + Multi-Factor)</option>
              <option value="RandomForest_Ensemble_v2">RandomForest_Ensemble_v2 (Tree Regressor)</option>
              <option value="MomentumBreakout_20d">MomentumBreakout_20d (Rule-based Baseline)</option>
              <option value="NaiveMean_Baseline">NaiveMean_Baseline (Historical Zero)</option>
            </select>
          </div>

          {/* Universe */}
          <div>
            <label className="text-zinc-400 block mb-1">EQUITY UNIVERSE:</label>
            <select
              value={universe}
              onChange={(e) => setUniverse(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white py-1.5 px-2 focus:outline-none focus:border-zinc-500"
            >
              <option value="NIFTY 500 Active PIT">NIFTY 500 (Point-in-Time Verified)</option>
              <option value="NIFTY 50 Leaders">NIFTY 50 Bluechips (Top 50)</option>
              <option value="NIFTY Midcap 150">NIFTY Midcap 150 Active</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="text-zinc-400 block mb-1">START DATE:</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div>
            <label className="text-zinc-400 block mb-1">END DATE:</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Initial Capital */}
          <div>
            <label className="text-zinc-400 block mb-1">STARTING CAPITAL (INR):</label>
            <Input
              type="number"
              prefixText="₹"
              value={initialCapital}
              onChange={(e) => setInitialCapital(e.target.value)}
            />
          </div>

          {/* Position Sizing */}
          <div>
            <label className="text-zinc-400 block mb-1">ALLOCATION METHOD:</label>
            <select
              value={positionSizing}
              onChange={(e) => setPositionSizing(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white py-1.5 px-2 focus:outline-none focus:border-zinc-500"
            >
              <option value="SCORE_WEIGHTED">Score-Weighted (Rank Proportional)</option>
              <option value="INVERSE_VOLATILITY">Inverse-Volatility (Risk Parity)</option>
              <option value="EQUAL_WEIGHT">Equal-Weight (1 / N)</option>
              <option value="CONSTRAINED_OPTIMIZED">Mean-Variance Constrained (QP)</option>
            </select>
          </div>

          {/* Slippage */}
          <div>
            <label className="text-zinc-400 block mb-1">SIMULATED SLIPPAGE (%):</label>
            <Input
              type="number"
              step="0.01"
              suffixText="%"
              value={slippagePct}
              onChange={(e) => setSlippagePct(e.target.value)}
            />
          </div>

          {/* Fees */}
          <div>
            <label className="text-zinc-400 block mb-1">TRANSACTION COST + STT (%):</label>
            <Input
              type="number"
              step="0.01"
              suffixText="%"
              value={feeRatePct}
              onChange={(e) => setFeeRatePct(e.target.value)}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-end">
          <Button
            variant="primary"
            size="lg"
            isLoading={isRunning}
            onClick={handleRunBacktest}
          >
            <Play className="w-4 h-4 fill-current" /> RUN QUANTITATIVE BACKTEST
          </Button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Total Return"
          value={`+${result.totalReturnPct.toFixed(2)}%`}
          delta={`CAGR: ${result.annualizedReturnPct.toFixed(1)}%`}
          deltaType="positive"
          subtext={`vs NIFTY +${result.benchmarkReturnPct.toFixed(1)}%`}
        />
        <StatCard
          title="Sharpe Ratio"
          value={result.sharpeRatio.toFixed(2)}
          delta={`Sortino: ${result.sortinoRatio.toFixed(2)}`}
          deltaType="positive"
          subtext="Rf: 6.5% INR"
        />
        <StatCard
          title="Max Drawdown"
          value={`-${result.maxDrawdownPct.toFixed(2)}%`}
          delta="Low Tail Risk"
          deltaType="positive"
          subtext="Benchmark: -14.2%"
        />
        <StatCard
          title="Win Rate"
          value={`${result.winRatePct.toFixed(1)}%`}
          delta={`${result.winningTrades}W / ${result.losingTrades}L`}
          subtext="Trade Accuracy"
        />
        <StatCard
          title="Profit Factor"
          value={result.profitFactor.toFixed(2)}
          delta="Gross Win/Loss"
          deltaType="positive"
          subtext="Robust > 1.8"
        />
        <StatCard
          title="Total Trades"
          value={result.totalTrades}
          delta={`Avg: +${result.avgTradeReturnPct}%`}
          subtext="Executed Fills"
        />
      </div>

      {/* Chart & Results Tabs */}
      <div className="bg-surface border border-zinc-800 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('equity')}
              className={`px-3 py-1 text-xs font-mono transition-colors border ${
                activeTab === 'equity'
                  ? 'bg-white text-black border-white font-medium'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              CUMULATIVE EQUITY CURVE
            </button>
            <button
              onClick={() => setActiveTab('drawdown')}
              className={`px-3 py-1 text-xs font-mono transition-colors border ${
                activeTab === 'drawdown'
                  ? 'bg-white text-black border-white font-medium'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              UNDERWATER DRAWDOWN
            </button>
            <button
              onClick={() => setActiveTab('trades')}
              className={`px-3 py-1 text-xs font-mono transition-colors border ${
                activeTab === 'trades'
                  ? 'bg-white text-black border-white font-medium'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              TRADE AUDIT LOG ({result.trades.length})
            </button>
          </div>

          <span className="text-xs font-mono text-zinc-500">
            Final Capital: {formatINR(result.finalCapital)}
          </span>
        </div>

        {activeTab === 'equity' && (
          <MonochromeAreaChart
            data={chartData}
            height={280}
            primaryLabel="Strategy Equity"
            secondaryLabel="Nifty 50 Benchmark"
          />
        )}

        {activeTab === 'drawdown' && (
          <MonochromeAreaChart
            data={chartData}
            height={280}
            valueSuffix="%"
            valuePrefix=""
            primaryLabel="Portfolio Drawdown %"
          />
        )}

        {activeTab === 'trades' && (
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] bg-zinc-950/40">
                  <th className="p-2.5 font-medium">TRADE ID</th>
                  <th className="p-2.5 font-medium">SYMBOL</th>
                  <th className="p-2.5 font-medium">SIDE</th>
                  <th className="p-2.5 font-medium text-right">ENTRY DATE</th>
                  <th className="p-2.5 font-medium text-right">EXIT DATE</th>
                  <th className="p-2.5 font-medium text-right">ENTRY PRICE</th>
                  <th className="p-2.5 font-medium text-right">EXIT PRICE</th>
                  <th className="p-2.5 font-medium text-right">SHARES</th>
                  <th className="p-2.5 font-medium text-right">NET P&L (INR)</th>
                  <th className="p-2.5 font-medium text-right">RETURN %</th>
                  <th className="p-2.5 font-medium">EXIT REASON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {result.trades.map((tr) => (
                  <tr
                    key={tr.id}
                    className="hover:bg-zinc-900/40 transition-colors cursor-pointer group"
                    onClick={() => selectStockBySymbol(tr.symbol)}
                  >
                    <td className="p-2.5 text-zinc-400">{tr.id}</td>
                    <td className="p-2.5 text-white font-bold group-hover:underline">{tr.symbol}</td>
                    <td className="p-2.5">
                      <Badge variant={tr.side === 'BUY' ? 'buy' : 'sell'} size="sm">
                        {tr.side}
                      </Badge>
                    </td>
                    <td className="p-2.5 text-right text-zinc-400">{tr.entryDate}</td>
                    <td className="p-2.5 text-right text-zinc-400">{tr.exitDate}</td>
                    <td className="p-2.5 text-right text-zinc-300 num">{formatINR(tr.entryPrice)}</td>
                    <td className="p-2.5 text-right text-white num">{formatINR(tr.exitPrice)}</td>
                    <td className="p-2.5 text-right text-white num">{tr.shares}</td>
                    <td className="p-2.5 text-right">
                      <span
                        className={`font-semibold num block ${
                          tr.pnl >= 0 ? 'text-white' : 'text-zinc-400'
                        }`}
                      >
                        {tr.pnl >= 0 ? `+${formatINR(tr.pnl)}` : formatINR(tr.pnl)}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <span
                        className={`font-semibold num block ${
                          tr.pnlPct >= 0 ? 'text-white' : 'text-zinc-400'
                        }`}
                      >
                        {tr.pnlPct >= 0 ? `+${tr.pnlPct.toFixed(2)}%` : `${tr.pnlPct.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <Badge variant="subtle" size="sm">
                        {tr.exitReason}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
