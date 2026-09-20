import React from 'react'

interface MiniSparklineProps {
  data: number[]
  width?: number
  height?: number
  strokeWidth?: number
  className?: string
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  width = 64,
  height = 20,
  strokeWidth = 1.2,
  className = '',
}) => {
  if (!data || data.length < 2) {
    return <div style={{ width, height }} className="bg-zinc-900" />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min === 0 ? 1 : max - min

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 4) + 2
      const y = height - ((val - min) / range) * (height - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const isUp = data[data.length - 1] >= data[0]

  return (
    <svg
      width={width}
      height={height}
      className={`overflow-visible inline-block align-middle ${className}`}
    >
      <polyline
        fill="none"
        stroke={isUp ? '#ffffff' : '#71717a'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={isUp ? 'none' : '3 2'}
        points={points}
      />
    </svg>
  )
}
