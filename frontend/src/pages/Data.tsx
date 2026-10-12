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
  Wifi,
  Sparkles,
  Server,
} from 'lucide-react'
import { DataFeedItem, PageId } from '../types'
import { mockDataFeeds } from '../data/mockData'
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
              EXCHANGE DATA PIPELINE // LAKEHOUSE INGESTION
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-normal flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                Apache Arrow Engine
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-lg font-bold tracking-tight text-white uppercase">
                MARKET DATA STORAGE & <span className="text-emerald-400">PIPELINE STATUS</span>
              </h1>
              <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800/90 border border-slate-700/80 text-emerald-300">
                POINT-IN-TIME PERSISTED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncAll}
              disabled={isRefreshing}
              className={`px-3 py-1.5 rounded text-[11px] font-semibold border transition-all flex items-center gap-1.5 ${
                isRefreshing
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              {isRefreshing ? 'Syncing Feeds...' : 'Force Pipeline Sync'}
            </button>
            <button
              onClick={() => onNavigate('market')}
              className="px-3 py-1.5 rounded text-[11px] font-medium bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              Market Screener
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Total Records</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
              4 Feeds Active
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {(totalRecords / 1000000).toFixed(2)} M
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Normalized Bar Rows</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Lakehouse Size</span>
            <span className="text-[10px] text-slate-400">Parquet</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {totalSize.toFixed(1)} MB
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Compressed Snappy</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Data Health</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5 animate-pulse">
              Nominal
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            {avgHealth}%
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Missing Rate: &lt;0.02%</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Universe Scope</span>
            <span className="text-[10px] text-emerald-400 font-semibold">PIT</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            NIFTY 500
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Survivorship Protected</p>
        </div>
      </div>

      {/* Data Ingestion Feeds Table */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-3.5 border-b border-slate-800/70 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase tracking-wider font-semibold text-slate-300 text-[11px]">
              ACTIVE DATA INGESTION FEEDS ({feeds.length})
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Storage Engine: Apache Arrow / PyArrow</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 text-[10px] uppercase bg-[#070b14]/70">
                <th className="p-3 font-semibold">FEED NAME</th>
                <th className="p-3 font-semibold">TYPE</th>
                <th className="p-3 font-semibold">STATUS</th>
                <th className="p-3 font-semibold">SOURCE VENUE</th>
                <th className="p-3 font-semibold text-right">TOTAL ROWS</th>
                <th className="p-3 font-semibold text-right">STORAGE SIZE</th>
                <th className="p-3 font-semibold">FREQUENCY</th>
                <th className="p-3 font-semibold text-right">QUALITY SCORE</th>
                <th className="p-3 font-semibold text-right">LAST UPDATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {feeds.map((f) => {
                const isLive = f.status === 'LIVE'
                const isSynced = f.status === 'SYNCED'

                return (
                  <tr key={f.id} className="hover:bg-slate-800/30 transition-all duration-150">
                    <td className="p-3">
                      <span className="text-white font-bold text-xs block group-hover:text-emerald-400 transition-colors">
                        {f.name}
                      </span>
                      <span className="text-[10px] text-slate-500">{f.storageFormat} partition</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 border border-slate-800 text-slate-300">
                        {f.type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${
                          isLive
                            ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30'
                            : isSynced
                            ? 'bg-cyan-950/70 text-cyan-400 border-cyan-500/30'
                            : 'bg-rose-950/70 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 text-[11px]">{f.source}</td>
                    <td className="p-3 text-right text-white font-semibold text-xs">
                      {f.recordsCount.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-slate-300 text-xs">
                      {f.sizeMb.toFixed(1)} MB
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">{f.frequency}</td>
                    <td className="p-3 text-right">
                      <span className="text-emerald-400 font-bold text-xs">{f.healthScorePct.toFixed(1)}%</span>
                    </td>
                    <td className="p-3 text-right text-slate-500 text-[10px] whitespace-nowrap">
                      {f.lastSync}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Point-in-Time Universe & Corporate Action Architecture Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800/60">
              <span className="uppercase font-semibold tracking-wider text-slate-300 text-[11px]">
                Point-in-Time Constituent Engine
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To eliminate <span className="text-white font-bold">survivorship bias</span>, the APEX-QUANT universe
              tracks historical addition, deletion, and delisting dates for all 500 NIFTY equities.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800/80 space-y-1.5 text-[11px] mt-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Historical Inclusion Tracking:</span>
              <span className="text-emerald-400 font-semibold">Active (2018–2026)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reconstitution Cadence:</span>
              <span className="text-white font-medium">Semi-Annual (March / Sept)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delisted Stocks Archived:</span>
              <span className="text-white font-medium">Yes (Fully Preserved)</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800/60">
              <span className="uppercase font-semibold tracking-wider text-slate-300 text-[11px]">
                Corporate Action Adjustment Invariants
              </span>
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Stock splits, bonus issues, and special dividends produce artificial price cliffs. All return and moving
              average features are computed on <span className="text-white font-bold">back-adjusted series</span>.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800/80 space-y-1.5 text-[11px] mt-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Adjustment Engine:</span>
              <span className="text-emerald-400 font-semibold">Ratio Back-Adjustment</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Volume Treatment:</span>
              <span className="text-white font-medium">Inverse Split Multiplied</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Raw Price Preservation:</span>
              <span className="text-white font-medium">Preserved for Limit Orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}