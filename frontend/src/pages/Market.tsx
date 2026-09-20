import React, { useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Activity,
  ArrowUpDown,
  Filter,
  Star,
  ExternalLink,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold tracking-wider text-white uppercase">
            INDIAN EQUITY MARKET MONITOR
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Real-time feed for National Stock Exchange (NSE) & BSE Benchmark Indices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="subtle" size="md">
            NSE CASH FEED: ACTIVE
          </Badge>
          <Button variant="outline" size="sm" onClick={() => onNavigate('signals')}>
            Scan Signals
          </Button>
        </div>
      </div>

      {/* Index Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockIndices.map((idx) => (
          <StatCard
            key={idx.id}
            title={idx.name}
            value={idx.current.toLocaleString('en-IN')}
            delta={idx.changePercent >= 0 ? `+${idx.changePercent}%` : `${idx.changePercent}%`}
            deltaType={idx.changePercent >= 0 ? 'positive' : 'negative'}
            subtext={`Range: ₹${idx.low.toLocaleString()} - ₹${idx.high.toLocaleString()}`}
            sparkline={idx.sparkline}
          />
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-zinc-800 p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* View Tab Selector */}
          <div className="flex items-center border border-zinc-800 bg-zinc-950 p-0.5">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-white text-black font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ALL EQUITIES ({mockStocks.length})
            </button>
            <button
              onClick={() => setActiveTab('WATCHLIST')}
              className={`px-3 py-1 text-xs font-mono flex items-center gap-1.5 transition-colors ${
                activeTab === 'WATCHLIST'
                  ? 'bg-white text-black font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Star className="w-3 h-3" />
              WATCHLIST ({watchlist.length})
            </button>
          </div>

          {/* Sector Popover Filter */}
          <FilterPopover
            sectors={availableSectors}
            selectedSectors={selectedSectors}
            onSectorChange={setSelectedSectors}
            onReset={() => setSelectedSectors([])}
          />
        </div>

        <div className="w-full md:w-80">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Search by Ticker or Name (e.g. RELIANCE, TCS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stock Screener Table */}
      <div className="bg-surface border border-zinc-800">
        <div className="flex items-center justify-between p-3 border-b border-zinc-800 text-xs font-mono text-zinc-400">
          <span className="uppercase tracking-wider">
            NIFTY 500 CONSTITUENT SCREENER ({filteredStocks.length} MATCHING)
          </span>
          <span className="text-[11px] text-zinc-500">
            Click row for factor analytics • Sorted by: {String(sortField).toUpperCase()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] bg-zinc-950/40">
                <th className="p-3 w-10 text-center">★</th>
                <th
                  onClick={() => handleSort('symbol')}
                  className="p-3 font-medium cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    INSTRUMENT <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="p-3 font-medium cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    LTP (INR) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="p-3 font-medium cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    CHANGE <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3 font-medium text-center">SPARKLINE</th>
                <th
                  onClick={() => handleSort('rsi')}
                  className="p-3 font-medium cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    RSI (14) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('volatility20d')}
                  className="p-3 font-medium cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    VOLATILITY <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('turnoverCr')}
                  className="p-3 font-medium cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    TURNOVER <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3 font-medium text-right">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredStocks.map((stock) => {
                const isFav = isWatchlisted(stock.symbol)
                return (
                  <tr
                    key={stock.symbol}
                    className="hover:bg-zinc-900/50 transition-colors cursor-pointer group"
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
                        className={`p-1 transition-colors ${
                          isFav ? 'text-white' : 'text-zinc-700 hover:text-zinc-400'
                        }`}
                        title={isFav ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="p-3">
                      <span className="text-white font-semibold text-sm group-hover:underline underline-offset-2 block">
                        {stock.symbol}
                      </span>
                      <span className="text-[11px] text-zinc-500 truncate block max-w-[200px]">
                        {stock.name} • {stock.sector}
                      </span>
                    </td>
                    <td className="p-3 text-right text-white font-medium text-sm num">
                      {formatINR(stock.price)}
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`text-xs font-semibold num ${
                          stock.changePercent >= 0 ? 'text-white' : 'text-zinc-400'
                        }`}
                      >
                        {stock.changePercent >= 0 ? `+${stock.changePercent}%` : `${stock.changePercent}%`}
                      </span>
                      <span className="text-[10px] text-zinc-500 block num">
                        {stock.change >= 0 ? `+${stock.change}` : stock.change}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <MiniSparkline data={stock.sparkline} width={72} height={20} />
                    </td>
                    <td className="p-3 text-right num">
                      <span
                        className={`px-1.5 py-0.5 border ${
                          stock.rsi > 65
                            ? 'border-white text-white font-medium bg-zinc-900'
                            : stock.rsi < 40
                            ? 'border-zinc-600 text-zinc-300'
                            : 'border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {stock.rsi.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-3 text-right text-zinc-300 num">
                      {(stock.volatility20d * 100).toFixed(2)}%
                    </td>
                    <td className="p-3 text-right text-white font-medium num">
                      ₹{stock.turnoverCr.toFixed(1)} Cr
                    </td>
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setSelectedStock(stock)}
                        className="opacity-80 group-hover:opacity-100"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" /> View
                      </Button>
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
