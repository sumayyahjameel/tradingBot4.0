import React, { useState } from 'react'
import {
  X,
  Star,
  TrendingUp,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  BarChart3,
  CheckCircle2,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { MiniSparkline } from '../charts/MiniSparkline'
import { Button } from './Button'
import { Badge } from './Badge'

export const StockDetailModal: React.FC = () => {
  const {
    selectedStock,
    setSelectedStock,
    watchlist,
    toggleWatchlist,
    isWatchlisted,
    addToast,
    executeSignal,
  } = useApp()

  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D')
  const [orderQty, setOrderQty] = useState<number>(50)

  if (!selectedStock) return null

  const isFavorite = isWatchlisted(selectedStock.symbol)

  // Calculate position on 52W range: 0 to 100%
  const rangeSpan = selectedStock.high52w - selectedStock.low52w || 1
  const currentRangePct = Math.min(
    100,
    Math.max(0, Math.round(((selectedStock.price - selectedStock.low52w) / rangeSpan) * 100))
  )

  const handleSimulateOrder = (action: 'BUY' | 'SELL') => {
    executeSignal({
      id: `man-${Date.now()}`,
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      action: action,
      confidence: 0.88,
      strategy: 'MANUAL_DISPATCH',
      entryPrice: selectedStock.price,
      stopLoss: Math.round(action === 'BUY' ? selectedStock.price * 0.98 : selectedStock.price * 1.02),
      targetPrice: Math.round(action === 'BUY' ? selectedStock.price * 1.04 : selectedStock.price * 0.96),
      expectedReturnPct: action === 'BUY' ? 4.0 : -4.0,
      timestamp: 'Just now',
      timeAgo: '0m',
      status: 'ACTIVE',
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-700 shadow-2xl overflow-hidden font-mono flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-surface flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wider">
                  {selectedStock.symbol}
                </h2>
                <Badge variant="outline">{selectedStock.sector}</Badge>
                <button
                  onClick={() => toggleWatchlist(selectedStock.symbol)}
                  className={`p-1 transition-colors ${
                    isFavorite ? 'text-white' : 'text-zinc-600 hover:text-zinc-300'
                  }`}
                  title={isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{selectedStock.name} • NSE</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xl font-bold text-white num">
                ₹{selectedStock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div
                className={`text-xs font-semibold num flex items-center justify-end gap-1 ${
                  selectedStock.changePercent >= 0 ? 'text-zinc-100' : 'text-zinc-500'
                }`}
              >
                {selectedStock.changePercent >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>
                  {selectedStock.changePercent >= 0 ? '+' : ''}
                  {selectedStock.change.toFixed(2)} ({selectedStock.changePercent}%)
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStock(null)}
              className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Sparkline & Timeframe Selector */}
          <div className="bg-zinc-900/40 border border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
                PRICE ACTION TRAJECTORY
              </span>
              <div className="flex items-center gap-1">
                {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2 py-0.5 text-[10px] font-mono border transition-colors ${
                      timeframe === tf
                        ? 'bg-white text-black border-white font-bold'
                        : 'text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-20 w-full flex items-center justify-center">
              <MiniSparkline data={selectedStock.sparkline} width={500} height={70} strokeWidth={2} />
            </div>
          </div>

          {/* 52-Week Range Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>52W Low: ₹{selectedStock.low52w.toLocaleString('en-IN')}</span>
              <span className="text-zinc-200 font-semibold">
                RANGE POSITION: {currentRangePct}%
              </span>
              <span>52W High: ₹{selectedStock.high52w.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-none overflow-hidden relative">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${currentRangePct}%` }}
              />
            </div>
          </div>

          {/* Key Quantitative Factors Matrix */}
          <div>
            <div className="text-[11px] text-zinc-400 uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              STATISTICAL & FACTOR TELEMETRY
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 bg-zinc-900/50 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase">P/E RATIO (TTM)</div>
                <div className="text-sm font-bold text-white num mt-0.5">{selectedStock.pe.toFixed(1)}x</div>
                <div className="text-[10px] text-zinc-400 mt-1">Sector Median: 24.2x</div>
              </div>

              <div className="p-3 bg-zinc-900/50 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase">RSI (14-DAY)</div>
                <div className="text-sm font-bold text-white num mt-0.5">{selectedStock.rsi.toFixed(1)}</div>
                <div className="text-[10px] text-zinc-400 mt-1">
                  {selectedStock.rsi > 70 ? 'OVERBOUGHT' : selectedStock.rsi < 30 ? 'OVERSOLD' : 'NEUTRAL ZONE'}
                </div>
              </div>

              <div className="p-3 bg-zinc-900/50 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase">20D HIST VOL</div>
                <div className="text-sm font-bold text-white num mt-0.5">{selectedStock.volatility20d}%</div>
                <div className="text-[10px] text-zinc-400 mt-1">NIFTY 50 Vol: 13.2%</div>
              </div>

              <div className="p-3 bg-zinc-900/50 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase">24H TURNOVER</div>
                <div className="text-sm font-bold text-white num mt-0.5">₹{selectedStock.turnoverCr.toFixed(1)} Cr</div>
                <div className="text-[10px] text-zinc-400 mt-1">Vol: {(selectedStock.volume / 100000).toFixed(2)}L</div>
              </div>
            </div>
          </div>

          {/* Technical Moving Average Regime */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 bg-zinc-900/30 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-500">20-DMA</div>
                <div className="text-xs font-semibold text-white num">
                  ₹{(selectedStock.price * 0.985).toFixed(2)}
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 font-mono">
                ABOVE
              </span>
            </div>

            <div className="p-2.5 bg-zinc-900/30 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-500">50-DMA</div>
                <div className="text-xs font-semibold text-white num">
                  ₹{(selectedStock.price * 0.96).toFixed(2)}
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 font-mono">
                ABOVE
              </span>
            </div>

            <div className="p-2.5 bg-zinc-900/30 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-500">200-DMA</div>
                <div className="text-xs font-semibold text-white num">
                  ₹{(selectedStock.price * 0.91).toFixed(2)}
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 font-mono">
                BULLISH
              </span>
            </div>
          </div>

          {/* Simulated Order Dispatch Drawer */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                SIMULATE DIRECT EXECUTION
              </span>
              <span className="text-[10px] text-zinc-400">PAPER BROKER ROUTER: NSE_OMS</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-[10px] text-zinc-400 block mb-1">ORDER QUANTITY (SHARES)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={orderQty}
                    onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-28 bg-zinc-950 border border-zinc-800 px-3 py-1 text-xs text-white num focus:outline-none focus:border-zinc-500"
                  />
                  <span className="text-xs text-zinc-400">
                    Est. Value: ₹{(orderQty * selectedStock.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSimulateOrder('BUY')}
                >
                  SIMULATE BUY
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSimulateOrder('SELL')}
                >
                  SIMULATE SELL
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-surface flex items-center justify-between text-[11px] text-zinc-500">
          <span>APEX QUANT TICKER TELEMETRY</span>
          <Button variant="ghost" size="xs" onClick={() => setSelectedStock(null)}>
            CLOSE (ESC)
          </Button>
        </div>
      </div>
    </div>
  )
}
