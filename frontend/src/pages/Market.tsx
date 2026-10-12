import React, { useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpDown,
  Filter,
  Star,
  ExternalLink,
  Wifi,
  Sparkles
} from 'lucide-react'
import { StockQuote, PageId } from '../types'
import { mockIndices, mockStocks } from '../data/mockData'
import { StatCard } from '../components/ui/StatCard'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { MiniSparkline } from '../components/charts/MiniSparkline'
import { FilterPopover } from '../components/ui/FilterPopover'
import { useApp } from '../context/AppContext'

interface MarketProps {
  onNavigate: (page: PageId) => void
}

export const Market: React.FC<MarketProps> = ({ onNavigate }) => {
  const { setSelectedStock, watchlist, toggleWatchlist, isWatchlisted } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'ALL' | 'WATCHLIST'>('ALL')
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof StockQuote>('turnoverCr')
  const [sortAsc, setSortAsc] = useState(false)

  const availableSectors = Array.from(new Set(mockStocks.map((s) => s.sector)))

  const filteredStocks = mockStocks
    .filter((stock) => {
      if (activeTab === 'WATCHLIST' && !isWatchlisted(stock.symbol)) {
        return false
      }
      const matchesSearch =
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSector =
        selectedSectors.length === 0 || selectedSectors.includes(stock.sector)
      return matchesSearch && matchesSector
    })
    .sort((a, b) => {
      const valA = a[sortField]
      const valB = b[sortField]
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA
      }
      return 0
    })

  const handleSort = (field: keyof StockQuote) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const formatINR = (val: number) => {
    return '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 2 })
  }

  return (
    <div className="p-4 md:p-6 space-y-5 font-mono select-none antialiased bg-[#060810] min-h-screen text-slate-200">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              </span>
              LIVE NSE & BSE MARKET SURVEILLANCE
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-normal flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                Zero-Latency Tick
              </span>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white mt-1">
              INDIAN EQUITY <span className="text-emerald-400">RADAR</span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              FEED: ACTIVE
            </span>
            <button
              onClick={() => onNavigate('signals')}
              className="px-3 py-1.5 rounded text-[11px] font-medium bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Scan Signals
            </button>
          </div>
        </div>
      </div>

      {/* Index Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {mockIndices.map((idx) => {
          const isPositive = idx.changePercent >= 0
          return (
            <div
              key={idx.id}
              className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md backdrop-blur-xl"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span className="text-slate-300">{idx.name}</span>
                <span
                  className={`flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                    isPositive
                      ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-950/70 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {isPositive ? `+${idx.changePercent}%` : `${idx.changePercent}%`}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  ₹{idx.current.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Range: ₹{idx.low.toLocaleString()} - ₹{idx.high.toLocaleString()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* View Tab Selector */}
          <div className="flex items-center border border-slate-800 bg-[#070b14] p-0.5 rounded-lg">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1 text-[11px] rounded-md transition-all ${
                activeTab === 'ALL'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ALL EQUITIES ({mockStocks.length})
            </button>
            <button
              onClick={() => setActiveTab('WATCHLIST')}
              className={`px-3 py-1 text-[11px] rounded-md flex items-center gap-1.5 transition-all ${
                activeTab === 'WATCHLIST'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3 h-3 text-amber-400 fill-amber-400/30" />
              WATCHLIST ({watchlist.length})
            </button>
          </div>

          <FilterPopover
            sectors={availableSectors}
            selectedSectors={selectedSectors}
            onSectorChange={setSelectedSectors}
            onReset={() => setSelectedSectors([])}
          />
        </div>

        <div className="w-full md:w-80">
          <Input
            icon={<Search className="w-3.5 h-3.5 text-slate-400" />}
            placeholder="Search symbol or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stock Screener Table */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-3.5 border-b border-slate-800/70 text-xs text-slate-400">
          <span className="uppercase tracking-wider font-semibold text-slate-300 text-[11px]">
            NIFTY 500 CONSTITUENT SCREENER ({filteredStocks.length} MATCHING)
          </span>
          <span className="text-[10px] text-slate-500">
            Click row for factor analytics • Sorted by: <span className="text-emerald-400">{String(sortField).toUpperCase()}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 text-[10px] uppercase bg-[#070b14]/70">
                <th className="p-3 w-10 text-center">★</th>
                <th
                  onClick={() => handleSort('symbol')}
                  className="p-3 font-semibold cursor-pointer hover:text-emerald-400 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    INSTRUMENT <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="p-3 font-semibold cursor-pointer hover:text-emerald-400 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    LTP (INR) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="p-3 font-semibold cursor-pointer hover:text-emerald-400 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    CHANGE <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3 font-semibold text-center">SPARKLINE</th>
                <th
                  onClick={() => handleSort('rsi')}
                  className="p-3 font-semibold cursor-pointer hover:text-emerald-400 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    RSI (14) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('volatility20d')}
                  className="p-3 font-semibold cursor-pointer hover:text-emerald-400 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    VOLATILITY <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('turnoverCr')}
                  className="p-3 font-semibold cursor-pointer hover:text-emerald-400 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    TURNOVER <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3 font-semibold text-right">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredStocks.map((stock) => {
                const isFav = isWatchlisted(stock.symbol)
                const isPositive = stock.changePercent >= 0
                return (
                  <tr
                    key={stock.symbol}
                    className="hover:bg-slate-800/30 transition-all duration-150 cursor-pointer group"
                    onClick={() => setSelectedStock(stock)}
                  >
                    <td
                      className="p-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWatchlist(stock.symbol)
                      }}
                    >
                      <button
                        className={`p-1 transition-transform group-hover:scale-110 ${
                          isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
                        }`}
                        title={isFav ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="p-3">
                      <span className="text-white font-bold text-xs group-hover:text-emerald-400 transition-colors block">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate block max-w-[200px]">
                        {stock.name} • {stock.sector}
                      </span>
                    </td>
                    <td className="p-3 text-right text-white font-semibold text-xs">
                      {formatINR(stock.price)}
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                          isPositive
                            ? 'text-emerald-400 bg-emerald-950/50'
                            : 'text-rose-400 bg-rose-950/50'
                        }`}
                      >
                        {isPositive ? `+${stock.changePercent}%` : `${stock.changePercent}%`}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {stock.change >= 0 ? `+${stock.change}` : stock.change}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <MiniSparkline data={stock.sparkline} width={72} height={20} />
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                          stock.rsi > 65
                            ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/50'
                            : stock.rsi < 40
                            ? 'border-rose-500/40 text-rose-400 bg-rose-950/50'
                            : 'border-slate-800 text-slate-400 bg-slate-900/60'
                        }`}
                      >
                        {stock.rsi.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-300 text-[11px]">
                      {(stock.volatility20d * 100).toFixed(2)}%
                    </td>
                    <td className="p-3 text-right text-white font-semibold text-xs">
                      ₹{stock.turnoverCr.toFixed(1)} Cr
                    </td>
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedStock(stock)}
                        className="px-2 py-1 rounded text-[10px] font-semibold bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all flex items-center gap-1 ml-auto"
                      >
                        <ExternalLink className="w-2.5 h-2.5" /> View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}