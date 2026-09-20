import React, { useState } from 'react'
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Clock,
  Layers,
  FileCheck,
  Zap,
} from 'lucide-react'
import { DataFeedItem, PageId } from '../types'
import { mockDataFeeds } from '../data/mockData'
import { StatCard } from '../components/ui/StatCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useApp } from '../context/AppContext'

interface DataProps {
  onNavigate: (page: PageId) => void
}

export const Data: React.FC<DataProps> = ({ onNavigate }) => {
  const { addToast } = useApp()
  const [feeds, setFeeds] = useState<DataFeedItem[]>(mockDataFeeds)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleSyncAll = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      addToast({
        title: 'DATA LAKEHOUSE RE-SYNCED',
        description: 'All 4 feeds validated. 2.45M parquet records synchronized with NSE.',
        type: 'success',
      })
    }, 600)
  }

  const totalRecords = feeds.reduce((sum, f) => sum + f.recordsCount, 0)
  const totalSize = feeds.reduce((sum, f) => sum + f.sizeMb, 0)
  const avgHealth = (feeds.reduce((sum, f) => sum + f.healthScorePct, 0) / feeds.length).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold tracking-wider text-white uppercase">
            MARKET DATA STORAGE & PIPELINE STATUS
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Parquet Lakehouse, Exchange WebSocket Feeds & Point-in-Time Universe Management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            isLoading={isRefreshing}
            onClick={handleSyncAll}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Force Pipeline Sync
          </Button>
          <Button variant="primary" size="sm" onClick={() => onNavigate('market')}>
            Market Screener
          </Button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Stored Records"
          value={(totalRecords / 1000000).toFixed(2) + ' M'}
          delta="4 Feeds Active"
          deltaType="positive"
          subtext="Normalized Bar Rows"
        />
        <StatCard
          title="Parquet Lakehouse Size"
          value={`${totalSize.toFixed(1)} MB`}
          subtext="Compressed Snappy"
        />
        <StatCard
          title="Data Health Score"
          value={`${avgHealth}%`}
          delta="Zero Lookahead Checked"
          deltaType="positive"
          subtext="Missing Rate: <0.02%"
        />
        <StatCard
          title="Point-in-Time Universe"
          value="NIFTY 500"
          subtext="Survivorship Bias Protected"
        />
      </div>

      {/* Data Ingestion Feeds Table */}
      <div className="bg-surface border border-zinc-800">
        <div className="flex items-center justify-between p-3 border-b border-zinc-800 text-xs font-mono text-zinc-400">
          <span className="uppercase tracking-wider">ACTIVE DATA INGESTION FEEDS ({feeds.length})</span>
          <span className="text-[11px] text-zinc-500">Storage Engine: Apache Arrow / PyArrow</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] bg-zinc-950/50">
                <th className="p-3 font-medium">FEED NAME</th>
                <th className="p-3 font-medium">TYPE</th>
                <th className="p-3 font-medium">STATUS</th>
                <th className="p-3 font-medium">SOURCE VENUE</th>
                <th className="p-3 font-medium text-right">TOTAL ROWS</th>
                <th className="p-3 font-medium text-right">STORAGE SIZE</th>
                <th className="p-3 font-medium">FREQUENCY</th>
                <th className="p-3 font-medium text-right">QUALITY SCORE</th>
                <th className="p-3 font-medium text-right">LAST UPDATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {feeds.map((f) => (
                <tr key={f.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="p-3">
                    <span className="text-white font-semibold text-sm block">{f.name}</span>
                    <span className="text-[10px] text-zinc-500">{f.storageFormat} partition</span>
                  </td>
                  <td className="p-3">
                    <Badge variant="subtle" size="sm">
                      {f.type}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        f.status === 'LIVE'
                          ? 'buy'
                          : f.status === 'SYNCED'
                          ? 'hold'
                          : 'sell'
                      }
                      size="sm"
                    >
                      {f.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-zinc-300 text-[11px]">{f.source}</td>
                  <td className="p-3 text-right text-white num">{f.recordsCount.toLocaleString()}</td>
                  <td className="p-3 text-right text-zinc-400 num">{f.sizeMb.toFixed(1)} MB</td>
                  <td className="p-3 text-zinc-400 text-[11px]">{f.frequency}</td>
                  <td className="p-3 text-right">
                    <span className="text-white font-semibold num">{f.healthScorePct.toFixed(1)}%</span>
                  </td>
                  <td className="p-3 text-right text-zinc-400 text-[11px] whitespace-nowrap">
                    {f.lastSync}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Point-in-Time Universe & Corporate Action Architecture Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-zinc-800 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3 pb-2 border-b border-zinc-900">
            <span className="uppercase tracking-wider">POINT-IN-TIME CONSTITUENT ENGINE</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>

          <div className="space-y-2.5 text-xs font-mono text-zinc-300 leading-relaxed">
            <p>
              To eliminate <span className="text-white font-semibold">survivorship bias</span>, the APEX-QUANT universe
              tracks historical addition, deletion, and delisting dates for all 500 NIFTY equities.
            </p>
            <div className="p-3 bg-zinc-950 border border-zinc-800 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">Historical Inclusion Tracking:</span>
                <span className="text-white">Active (2018–2026)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Reconstitution Cadence:</span>
                <span className="text-white">Semi-Annual (March / Sept)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Delisted Stocks Archived:</span>
                <span className="text-white">Yes (Fully Preserved)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-zinc-800 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3 pb-2 border-b border-zinc-900">
            <span className="uppercase tracking-wider">CORPORATE ACTION ADJUSTMENT INVARIANTS</span>
            <FileCheck className="w-3.5 h-3.5 text-white" />
          </div>

          <div className="space-y-2.5 text-xs font-mono text-zinc-300 leading-relaxed">
            <p>
              Stock splits, bonus issues, and special dividends produce artificial price cliffs. All return and moving
              average features are computed on <span className="text-white font-semibold">back-adjusted series</span>.
            </p>
            <div className="p-3 bg-zinc-950 border border-zinc-800 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">Adjustment Engine:</span>
                <span className="text-white">Ratio Back-Adjustment</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Volume Treatment:</span>
                <span className="text-white">Inverse Split Multiplied</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Raw Price Preservation:</span>
                <span className="text-white">Preserved for Limit Orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
