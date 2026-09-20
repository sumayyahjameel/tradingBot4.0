import React, { useState, useId } from 'react'

export interface ChartDataPoint {
  label: string
  value: number
  secondaryValue?: number
}

export interface MonochromeAreaChartProps {
  data: ChartDataPoint[]
  height?: number
  valuePrefix?: string
  valueSuffix?: string
  secondaryLabel?: string
  primaryLabel?: string
  className?: string
}

export const MonochromeAreaChart: React.FC<MonochromeAreaChartProps> = ({
  data,
  height = 240,
  valuePrefix = '₹',
  valueSuffix = '',
  primaryLabel = 'Portfolio',
  secondaryLabel = 'Benchmark (Nifty 50)',
  className = '',
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const gradId = useId()

  if (!data || data.length < 2) {
    return (
      <div
        style={{ height }}
        className="w-full flex items-center justify-center border border-zinc-800 bg-surface text-zinc-600 text-xs font-mono"
      >
        INSUFFICIENT CHART DATA
      </div>
    )
  }

  const values = data.map((d) => d.value)
  const secValues = data.filter((d) => d.secondaryValue !== undefined).map((d) => d.secondaryValue as number)
  const allValues = [...values, ...secValues]

  const rawMin = Math.min(...allValues)
  const rawMax = Math.max(...allValues)
  const padding = (rawMax - rawMin) * 0.08 || 1
  const minVal = rawMin - padding
  const maxVal = rawMax + padding
  const range = maxVal - minVal

  const width = 800
  const chartHeight = height
  const padLeft = 65
  const padRight = 20
  const padTop = 20
  const padBottom = 30
  const plotWidth = width - padLeft - padRight
  const plotHeight = chartHeight - padTop - padBottom

  const getX = (index: number) => padLeft + (index / (data.length - 1)) * plotWidth
  const getY = (val: number) => padTop + plotHeight - ((val - minVal) / range) * plotHeight

  // Primary path points
  const points = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.value).toFixed(1)}`).join(' ')
  const areaPoints = `${getX(0)},${chartHeight - padBottom} ${points} ${getX(data.length - 1)},${chartHeight - padBottom}`

  // Secondary path points
  const hasSecondary = secValues.length === data.length
  const secondaryPoints = hasSecondary
    ? data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.secondaryValue as number).toFixed(1)}`).join(' ')
    : ''

  // 4 horizontal grid lines
  const gridTicks = [0, 0.33, 0.66, 1.0].map((ratio) => {
    const val = minVal + ratio * range
    const y = padTop + plotHeight - ratio * plotHeight
    return { val, y }
  })

  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`
    if (Math.abs(num) >= 100000) return `${(num / 100000).toFixed(2)} L`
    if (Math.abs(num) >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toLocaleString('en-IN', { maximumFractionDigits: 1 })
  }

  const activePoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1]
  const activeX = hoverIndex !== null ? getX(hoverIndex) : getX(data.length - 1)
  const activeY = hoverIndex !== null ? getY(activePoint.value) : getY(activePoint.value)

  return (
    <div className={`relative bg-surface border border-zinc-800 p-3 select-none ${className}`}>
      {/* Chart Header / Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono mb-2 pb-2 border-b border-zinc-900">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-white inline-block" />
            <span className="text-zinc-300 text-[11px] uppercase tracking-wider">{primaryLabel}</span>
            <span className="text-white font-medium ml-1">
              {valuePrefix}{formatNumber(activePoint.value)}{valueSuffix}
            </span>
          </div>
          {hasSecondary && activePoint.secondaryValue !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-zinc-500 border-b border-dashed border-zinc-400 inline-block" />
              <span className="text-zinc-500 text-[11px] uppercase tracking-wider">{secondaryLabel}</span>
              <span className="text-zinc-300 font-medium ml-1">
                {valuePrefix}{formatNumber(activePoint.secondaryValue)}{valueSuffix}
              </span>
            </div>
          )}
        </div>
        <div className="text-zinc-500 text-[11px]">
          {activePoint.label}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${chartHeight}`}
          className="w-full h-auto cursor-crosshair block"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const mouseX = ((e.clientX - rect.left) / rect.width) * width
            if (mouseX >= padLeft && mouseX <= width - padRight) {
              const ratio = (mouseX - padLeft) / plotWidth
              const nearestIdx = Math.round(ratio * (data.length - 1))
              const clamped = Math.max(0, Math.min(data.length - 1, nearestIdx))
              setHoverIndex(clamped)
            }
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {gridTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={padLeft}
                y1={tick.y}
                x2={width - padRight}
                y2={tick.y}
                stroke="#222226"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={tick.y + 3.5}
                textAnchor="end"
                fill="#52525b"
                fontSize="10"
                fontFamily="monospace"
              >
                {formatNumber(tick.val)}
              </text>
            </g>
          ))}

          {/* Secondary benchmark curve */}
          {hasSecondary && (
            <polyline
              fill="none"
              stroke="#52525b"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              points={secondaryPoints}
            />
          )}

          {/* Primary area gradient fill */}
          <polygon fill={`url(#${gradId})`} points={areaPoints} />

          {/* Primary curve stroke */}
          <polyline
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Vertical Crosshair Line */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={activeX}
                y1={padTop}
                x2={activeX}
                y2={chartHeight - padBottom}
                stroke="#71717a"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={activeX}
                cy={activeY}
                r="3.5"
                fill="#000000"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            // Show every few labels
            const step = Math.ceil(data.length / 6)
            if (i % step === 0 || i === data.length - 1) {
              return (
                <text
                  key={i}
                  x={getX(i)}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fill="#71717a"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {d.label}
                </text>
              )
            }
            return null
          })}
        </svg>
      </div>
    </div>
  )
}
