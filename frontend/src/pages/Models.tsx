import React, { useState } from 'react'
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  ShieldCheck,
  RefreshCw,
  GitBranch,
} from 'lucide-react'
import { ModelRegistryItem, PageId } from '../types'
import { mockModels } from '../data/mockData'
import { StatCard } from '../components/ui/StatCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

interface ModelsProps {
  onNavigate: (page: PageId) => void
}

export const Models: React.FC<ModelsProps> = ({ onNavigate }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(mockModels[0].id)

  const activeModel = mockModels.find((m) => m.id === selectedModelId) || mockModels[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold tracking-wider text-white uppercase">
            MODEL REGISTRY & RESEARCH DIAGNOSTICS
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Zero-Lookahead Cross-Sectional Alpha Predictors • Point-in-Time Evaluated
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="buy" size="md">
            PURGED CV ENFORCED
          </Badge>
          <Button variant="outline" size="sm" onClick={() => onNavigate('backtests')}>
            Backtest Model
          </Button>
        </div>
      </div>

      {/* Model Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 overflow-x-auto pb-1">
        {mockModels.map((m) => {
          const isSelected = m.id === selectedModelId
          return (
            <button
              key={m.id}
              onClick={() => setSelectedModelId(m.id)}
              className={`px-4 py-2 text-xs font-mono tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'border-white text-white font-semibold bg-zinc-900/40'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{m.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-zinc-950 border border-zinc-800 text-zinc-400">
                {m.version}
              </span>
              <Badge variant={m.status === 'DEPLOYED' ? 'buy' : 'outline'} size="sm">
                {m.status}
              </Badge>
            </button>
          )
        })}
      </div>

      {/* Top 4 Model Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Rank Information Coeff (IC)"
          value={activeModel.rankIc.toFixed(3)}
          delta="Benchmark: 0.020"
          deltaType="positive"
          subtext="Spearman Cross-Sectional"
        />
        <StatCard
          title="IC Information Ratio"
          value={activeModel.icIr.toFixed(2)}
          delta="High Significance > 1.5"
          deltaType="positive"
          subtext="Mean IC / Std Dev"
        />
        <StatCard
          title="Mean Absolute Error (MAE)"
          value={activeModel.mae.toFixed(4)}
          subtext="Normalized 5d Return Error"
        />
        <StatCard
          title="Directional Sign Accuracy"
          value={`${activeModel.directionalAccuracyPct}%`}
          delta="Statistically Positive"
          deltaType="positive"
          subtext="384k Historical Samples"
        />
      </div>

      {/* Model Specifications & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feature Importance Panel */}
        <div className="lg:col-span-2 bg-surface border border-zinc-800 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3 pb-2 border-b border-zinc-900">
            <span className="uppercase tracking-wider">
              FEATURE IMPORTANCE WEIGHTS ({activeModel.features.length} INPUTS)
            </span>
            <span className="text-zinc-500 text-[11px]">Normalized Normalized Relative Gini</span>
          </div>

          <div className="space-y-3">
            {activeModel.features.map((feat) => (
              <div key={feat.name} className="space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{feat.name}</span>
                    <Badge variant="subtle" size="sm">
                      {feat.category}
                    </Badge>
                  </div>
                  <span className="text-white font-medium num">
                    {(feat.importance * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-2 border border-zinc-800">
                  <div
                    className="bg-white h-full transition-all"
                    style={{ width: `${(feat.importance / 0.35) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-500">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Model Architecture & Metadata */}
        <div className="bg-surface border border-zinc-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3 pb-2 border-b border-zinc-900">
              <span className="uppercase tracking-wider">ARCHITECTURE METADATA</span>
              <Badge variant="subtle" size="sm">
                PARQUET SERIALIZED
              </Badge>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between pb-2 border-b border-zinc-900">
                <span className="text-zinc-400">Model Name:</span>
                <span className="text-white font-semibold">{activeModel.name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-900">
                <span className="text-zinc-400">Release Version:</span>
                <span className="text-white num">{activeModel.version}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-900">
                <span className="text-zinc-400">Core Algorithm:</span>
                <span className="text-zinc-200 text-right">{activeModel.algorithm}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-900">
                <span className="text-zinc-400">Prediction Horizon:</span>
                <span className="text-white font-medium">{activeModel.targetHorizon}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-900">
                <span className="text-zinc-400">Target Type:</span>
                <span className="text-zinc-200">{activeModel.targetType}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-900">
                <span className="text-zinc-400">Dataset Samples:</span>
                <span className="text-white num">{activeModel.datasetRows.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Last Retrained:</span>
                <span className="text-zinc-300">{activeModel.trainedAt}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <span className="text-white font-semibold block mb-1">STRICT INVARIANTS:</span>
            Scalers & imputers are fitted strictly on training data with zero leakage across validation cutoffs.
          </div>
        </div>
      </div>

      {/* Out-of-Sample Performance Metrics Table */}
      <div className="bg-surface border border-zinc-800">
        <div className="p-3 border-b border-zinc-800 text-xs font-mono text-zinc-400 uppercase tracking-wider">
          OUT-OF-SAMPLE VALIDATION BENCHMARKS
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] bg-zinc-950/40">
                <th className="p-3 font-medium">METRIC</th>
                <th className="p-3 font-medium text-right">VALIDATION SPLIT</th>
                <th className="p-3 font-medium text-right">HELD-OUT TEST SPLIT</th>
                <th className="p-3 font-medium text-right">NAIVE BENCHMARK</th>
                <th className="p-3 font-medium text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {activeModel.metrics.map((m) => (
                <tr key={m.metric} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="p-3 text-white font-semibold">{m.metric}</td>
                  <td className="p-3 text-right text-zinc-200 num">{m.validationValue}</td>
                  <td className="p-3 text-right text-white font-bold num">{m.testValue}</td>
                  <td className="p-3 text-right text-zinc-500 num">{m.benchmarkValue}</td>
                  <td className="p-3 text-center">
                    <Badge variant={m.status === 'OPTIMAL' ? 'buy' : 'outline'} size="sm">
                      {m.status}
                    </Badge>
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
