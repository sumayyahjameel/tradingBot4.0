import React from 'react'
import { MiniSparkline } from '../charts/MiniSparkline'

export interface StatCardProps {
  title: string
  value: string | number
  delta?: string
  deltaType?: 'neutral' | 'positive' | 'negative'
  subtext?: string
  sparkline?: number[]
  icon?: React.ReactNode
  badge?: string
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  delta,
  deltaType = 'neutral',
  subtext,
  sparkline,
  icon,
  badge,
  className = '',
}) => {
  return (
    <div
      className={`bg-surface border border-zinc-800 p-4 relative group hover:border-zinc-700 transition-all ${className}`}
    >
      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono tracking-wider mb-2">
        <div className="flex items-center gap-1.5 uppercase">
          {icon && <span className="text-zinc-400">{icon}</span>}
          <span>{title}</span>
        </div>
        {badge && (
          <span className="text-[10px] px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="text-2xl font-mono font-medium tracking-tight text-white num">
          {value}
        </div>
        {sparkline && sparkline.length > 1 && (
          <div className="opacity-80 group-hover:opacity-100 transition-opacity">
            <MiniSparkline data={sparkline} width={72} height={24} />
          </div>
        )}
      </div>

      {(delta || subtext) && (
        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-zinc-900/80 font-mono">
          {delta && (
            <span
              className={`inline-flex items-center gap-1 ${
                deltaType === 'positive'
                  ? 'text-white font-medium'
                  : deltaType === 'negative'
                  ? 'text-zinc-400 font-normal'
                  : 'text-zinc-400'
              }`}
            >
              {delta}
            </span>
          )}
          {subtext && <span className="text-[11px] text-zinc-400 truncate ml-auto">{subtext}</span>}
        </div>
      )}
    </div>
  )
}
