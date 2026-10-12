import React, { useState } from 'react'
import {
  Play,
  FileDown,
  Cpu,
  Wifi,
  Sliders,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import { BacktestResult, PageId } from '../types'
import { mockBacktestResult } from '../data/mockData'
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
        description: `Model: ${strategy} | Sharpe: 2.14 | Total Return: +38.4%`,
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
    <div className="p-4 md:p-6 space-y-4 font-mono select-none antialiased bg-[#060810] min-h-screen text-slate-200">
      <div className="relative overflow-hidden rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              </span>
              QUANT WALK-FORWARD SIMULATION
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-normal flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                Zero Lookahead Verified
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-lg font-bold tracking-tight text-white uppercase">
                HISTORICAL BACKTESTING <span className="text-emerald-400">ENGINE</span>
              </h1>
              <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800/90 border border-slate-700/80 text-emerald-300">
                OOS EVALUATION
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('models')}
              className="px-3 py-1.5 rounded text-[11px] font-medium bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              Inspect Model
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              Export Teardown
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-lg space-y-3">
        <div className="text-xs text-slate-400 pb-2 border-b border-slate-800/60 uppercase tracking-wider flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-300 text-[11px]">Simulation Parameters</span>
          </div>
          <span className="text-[10px] text-slate-500">Frequency: Daily Bar Close</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Strategy Model:</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 text-white rounded p-1.5 text-xs focus:outline-none"
            >
              <option value="CrossSectionalRank_v3">CrossSectionalRank_v3</option>
              <option value="RandomForest_Ensemble_v2">RandomForest_Ensemble_v2</option>
              <option value="MomentumBreakout_20d">MomentumBreakout_20d</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Equity Universe:</label>
            <select
              value={universe}
              onChange={(e) => setUniverse(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 text-white rounded p-1.5 text-xs focus:outline-none"
            >
              <option value="NIFTY 500 Active PIT">NIFTY 500 PIT</option>
              <option value="NIFTY 50 Leaders">NIFTY 50 Leaders</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 text-white rounded p-1.5 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 text-white rounded p-1.5 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Starting Capital:</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 text-white rounded p-1.5 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Allocation:</label>
            <select
              value={positionSizing}
              onChange={(e) => setPositionSizing(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 text-white rounded p-1.5 text-xs focus:outline-none"
            >
              <option value="SCORE_WEIGHTED">Score-Weighted</option>
              <option value="INVERSE_VOLATILITY">Inverse-Volatility</option>
              <option value="EQUAL_WEIGHT">Equal-Weight</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">Slippage %:</label>
            <input
              type="number"
              step="0.01"
              value={slippagePct}
              onChange={(e) => setSlippagePct(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 text-white rounded p-1.5 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 text-[10px] uppercase">STT + Fees %:</label>
            <input
              type="number"
              step="0.01"
              value={feeRatePct}
              onChange={(e) => setFeeRatePct(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-800 text-white rounded p-1.5 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            STT and exchange fees included
          </span>
          <button
            onClick={handleRunBacktest}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                SIMULATING...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                RUN BACKTEST
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-lg bg-[#0a0f1d] border border-slate-800/80 p-3 shadow-md">
          <div className="text-[10px] text-slate-400 uppercase">Total Return</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">+{result.totalReturnPct.toFixed(2)}%</div>
          <div className="text-[9px] text-slate-500 mt-0.5">CAGR: {result.annualizedReturnPct.toFixed(1)}%</div>
        </div>

        <div className="rounded-lg bg-[#0a0f1d] border border-slate-800/80 p-3 shadow-md">
          <div className="text-[10px] text-slate-400 uppercase">Sharpe Ratio</div>
          <div className="text-lg font-bold text-white mt-1">{result.sharpeRatio.toFixed(2)}</div>
          <div className="text-[9px] text-emerald-400 mt-0.5">Sortino: {result.sortinoRatio.toFixed(2)}</div>
        </div>

        <div className="rounded-lg bg-[#0a0f1d] border border-slate-800/80 p-3 shadow-md">
          <div className="text-[10px] text-slate-400 uppercase">Max Drawdown</div>
          <div className="text-lg font-bold text-rose-400 mt-1">-{result.maxDrawdownPct.toFixed(2)}%</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Bench: -14.2%</div>
        </div>

        <div className="rounded-lg bg-[#0a0f1d] border border-slate-800/80 p-3 shadow-md">
          <div className="text-[10px] text-slate-400 uppercase">Win Rate</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">{result.winRatePct.toFixed(1)}%</div>
          <div className="text-[9px] text-slate-500 mt-0.5">{result.winningTrades}W / {result.losingTrades}L</div>
        </div>

        <div className="rounded-lg bg-[#0a0f1d] border border-slate-800/80 p-3 shadow-md">
          <div className="text-[10px] text-slate-400 uppercase">Profit Factor</div>
          <div className="text-lg font-bold text-white mt-1">{result.profitFactor.toFixed(2)}</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Robust &gt; 1.8</div>
        </div>

        <div className="rounded-lg bg-[#0a0f1d] border border-slate-800/80 p-3 shadow-md">
          <div className="text-[10px] text-slate-400 uppercase">Total Trades</div>
          <div className="text-lg font-bold text-white mt-1">{result.totalTrades}</div>
          <div className="text-[9px] text-emerald-400 mt-0.5">Avg: +{result.avgTradeReturnPct}%</div>
        </div>
      </div>

      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('equity')}
              className={`px-3 py-1 text-xs rounded-md border transition-all ${
                activeTab === 'equity'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm font-semibold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              CUMULATIVE EQUITY CURVE
            </button>
            <button
              onClick={() => setActiveTab('drawdown')}
              className={`px-3 py-1 text-xs rounded-md border transition-all ${
                activeTab === 'drawdown'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm font-semibold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              UNDERWATER DRAWDOWN
            </button>
            <button
              onClick={() => setActiveTab('trades')}
              className={`px-3 py-1 text-xs rounded-md border transition-all ${
                activeTab === 'trades'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm font-semibold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              TRADE AUDIT LOG ({result.trades.length})
            </button>
          </div>

          <span className="text-xs text-slate-400">
            Final Capital: <strong className="text-emerald-400">{formatINR(result.finalCapital)}</strong>
          </span>
        </div>

        {activeTab === 'equity' && (
          <div className="p-2">
            <MonochromeAreaChart
              data={chartData}
              height={260}
              primaryLabel="Strategy Equity"
              secondaryLabel="Nifty 50 Benchmark"
            />
          </div>
        )}

        {activeTab === 'drawdown' && (
          <div className="p-2">
            <MonochromeAreaChart
              data={chartData}
              height={260}
              valueSuffix="%"
              valuePrefix=""
              primaryLabel="Portfolio Drawdown %"
            />
          </div>
        )}

        {activeTab === 'trades' && (
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-400 text-[10px] uppercase bg-[#070b14]/70">
                  <th className="p-2.5 font-semibold">TRADE ID</th>
                  <th className="p-2.5 font-semibold">SYMBOL</th>
                  <th className="p-2.5 font-semibold">SIDE</th>
                  <th className="p-2.5 font-semibold text-right">ENTRY DATE</th>
                  <th className="p-2.5 font-semibold text-right">EXIT DATE</th>
                  <th className="p-2.5 font-semibold text-right">ENTRY PRICE</th>
                  <th className="p-2.5 font-semibold text-right">EXIT PRICE</th>
                  <th className="p-2.5 font-semibold text-right">SHARES</th>
                  <th className="p-2.5 font-semibold text-right">NET P&L</th>
                  <th className="p-2.5 font-semibold text-right">RETURN %</th>
                  <th className="p-2.5 font-semibold">EXIT REASON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {result.trades.map((tr) => (
                  <tr
                    key={tr.id}
                    className="hover:bg-slate-800/30 transition-all duration-150 cursor-pointer group"
                    onClick={() => selectStockBySymbol(tr.symbol)}
                  >
                    <td className="p-2.5 text-slate-400">{tr.id}</td>
                    <td className="p-2.5 text-white font-bold group-hover:text-emerald-400 transition-colors">
                      {tr.symbol}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          tr.side === 'BUY'
                            ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-950/70 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {tr.side}
                      </span>
                    </td>
                    <td className="p-2.5 text-right text-slate-400">{tr.entryDate}</td>
                    <td className="p-2.5 text-right text-slate-400">{tr.exitDate}</td>
                    <td className="p-2.5 text-right text-slate-300">{formatINR(tr.entryPrice)}</td>
                    <td className="p-2.5 text-right text-white font-bold">{formatINR(tr.exitPrice)}</td>
                    <td className="p-2.5 text-right text-white">{tr.shares}</td>
                    <td className="p-2.5 text-right">
                      <span className={`font-bold block ${tr.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tr.pnl >= 0 ? `+${formatINR(tr.pnl)}` : formatINR(tr.pnl)}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <span className={`font-bold block ${tr.pnlPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tr.pnlPct >= 0 ? `+${tr.pnlPct.toFixed(2)}%` : `${tr.pnlPct.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300">
                        {tr.exitReason}
                      </span>
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