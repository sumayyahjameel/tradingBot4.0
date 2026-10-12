import React, { useState, useEffect } from 'react'
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  ShieldCheck,
  RefreshCw,
  GitBranch,
  Wifi,
  Sparkles,
  Activity,
  BarChart3,
} from 'lucide-react'
import { ModelRegistryItem, PageId } from '../types'
import { mockModels } from '../data/mockData'

interface ModelsProps {
  onNavigate: (page: PageId) => void
}

export const Models: React.FC<ModelsProps> = ({ onNavigate }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(mockModels[0].id)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1)
    }, 90)
    return () => clearInterval(timer)
  }, [])

  const activeModel = mockModels.find((m) => m.id === selectedModelId) || mockModels[0]

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
              QUANT MACHINE LEARNING REGISTRY // ZERO-LEAKAGE PIPELINE
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-normal flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                Purged Cross-Validation
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-lg font-bold tracking-tight text-white uppercase">
                MODEL REGISTRY & <span className="text-emerald-400">RESEARCH DIAGNOSTICS</span>
              </h1>
              <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800/90 border border-slate-700/80 text-emerald-300">
                POINT-IN-TIME VERIFIED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              PURGED CV ENFORCED
            </span>
            <button
              onClick={() => onNavigate('backtests')}
              className="px-3 py-1.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Backtest Model
            </button>
          </div>
        </div>
      </div>

      {/* Model Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/70 overflow-x-auto pb-1.5">
        {mockModels.map((m) => {
          const isSelected = m.id === selectedModelId
          const isDeployed = m.status === 'DEPLOYED'

          return (
            <button
              key={m.id}
              onClick={() => setSelectedModelId(m.id)}
              className={`px-3.5 py-2 text-xs rounded-lg transition-all border whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold'
                  : 'bg-[#0a0f1d] border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>{m.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                {m.version}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${
                  isDeployed
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                {m.status}
              </span>
            </button>
          )
        })}
      </div>

      {/* Top 4 Model Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Rank IC</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
              +0.041 vs Bench
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {activeModel.rankIc.toFixed(3)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Spearman Cross-Sectional</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">IC Information Ratio</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
              High Significance &gt; 1.5
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            {activeModel.icIr.toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Mean IC / Standard Dev</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Mean Abs Error</span>
            <span className="text-[10px] text-slate-400">5d Normalized</span>
          </div>
          <div className="mt-2 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
            {activeModel.mae.toFixed(4)}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Residual Loss Variance</p>
        </div>

        <div className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="uppercase text-[10px] tracking-wider">Directional Accuracy</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5 animate-pulse">
              Positive Edge
            </span>
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
            {activeModel.directionalAccuracyPct}%
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">384k Historical Samples</p>
        </div>
      </div>

      {/* Model Specifications & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Feature Importance Panel */}
        <div className="lg:col-span-2 rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="uppercase font-semibold tracking-wider text-slate-300 text-[11px]">
                FEATURE IMPORTANCE WEIGHTS ({activeModel.features.length} INPUTS)
              </span>
            </div>
            <span className="text-slate-500 text-[10px]">Relative Gini Impurity</span>
          </div>

          <div className="space-y-3">
            {activeModel.features.map((feat, index) => {
              const dynamicImp = Math.min(
                0.35,
                Math.max(0.05, feat.importance + Math.sin(tick * 0.08 + index) * 0.015)
              )

              return (
                <div key={feat.name} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-[11px]">{feat.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {feat.category}
                      </span>
                    </div>
                    <span className="text-emerald-400 font-bold text-[11px]">
                      {(dynamicImp * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full border border-slate-800 overflow-hidden relative">
                    <div
                      className="bg-gradient-to-r from-teal-500 via-emerald-400 to-emerald-300 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                      style={{ width: `${(dynamicImp / 0.35) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">{feat.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Model Architecture & Metadata */}
        <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span className="uppercase font-semibold tracking-wider text-slate-300 text-[11px]">
                  Architecture Metadata
                </span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                PARQUET
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-slate-800/40">
                <span className="text-slate-400 text-[11px]">Model Name:</span>
                <span className="text-white font-bold">{activeModel.name}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/40">
                <span className="text-slate-400 text-[11px]">Release Version:</span>
                <span className="text-emerald-400 font-bold">{activeModel.version}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/40">
                <span className="text-slate-400 text-[11px]">Algorithm:</span>
                <span className="text-slate-200 text-right">{activeModel.algorithm}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/40">
                <span className="text-slate-400 text-[11px]">Horizon:</span>
                <span className="text-white font-bold">{activeModel.targetHorizon}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/40">
                <span className="text-slate-400 text-[11px]">Target:</span>
                <span className="text-slate-200">{activeModel.targetType}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/40">
                <span className="text-slate-400 text-[11px]">Dataset Samples:</span>
                <span className="text-white font-bold">{activeModel.datasetRows.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Last Retrained:</span>
                <span className="text-slate-300">{activeModel.trainedAt}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-[#070b14] border border-slate-800/80 text-[10px] text-slate-400">
            <span className="text-emerald-400 font-bold block mb-1">STRICT INVARIANTS:</span>
            Scalers & imputers fitted strictly on training slices with zero leak across cross-validation splits.
          </div>
        </div>
      </div>

      {/* Out-of-Sample Performance Metrics Table */}
      <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="p-3.5 border-b border-slate-800/70 text-xs text-slate-400 uppercase tracking-wider font-semibold text-slate-300 text-[11px]">
          OUT-OF-SAMPLE VALIDATION BENCHMARKS
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 text-[10px] uppercase bg-[#070b14]/70">
                <th className="p-3 font-semibold">METRIC</th>
                <th className="p-3 font-semibold text-right">VALIDATION SPLIT</th>
                <th className="p-3 font-semibold text-right">HELD-OUT TEST SPLIT</th>
                <th className="p-3 font-semibold text-right">NAIVE BENCHMARK</th>
                <th className="p-3 font-semibold text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {activeModel.metrics.map((m) => (
                <tr key={m.metric} className="hover:bg-slate-800/30 transition-all duration-150">
                  <td className="p-3 text-white font-bold text-xs">{m.metric}</td>
                  <td className="p-3 text-right text-slate-200">{m.validationValue}</td>
                  <td className="p-3 text-right text-emerald-400 font-bold">{m.testValue}</td>
                  <td className="p-3 text-right text-slate-500">{m.benchmarkValue}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${
                        m.status === 'OPTIMAL'
                          ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      {m.status}
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