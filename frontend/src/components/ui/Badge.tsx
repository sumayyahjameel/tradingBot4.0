import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'buy' | 'sell' | 'hold' | 'success' | 'warning' | 'error' | 'subtle'
  size?: 'sm' | 'md'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'

  let variantClasses = ''
  switch (variant) {
    case 'buy':
      variantClasses = 'bg-white text-black font-semibold border border-white'
      break
    case 'sell':
      variantClasses = 'bg-transparent text-white font-semibold border border-zinc-400 border-dashed'
      break
    case 'hold':
      variantClasses = 'bg-zinc-800 text-zinc-300 border border-zinc-700'
      break
    case 'outline':
      variantClasses = 'bg-transparent text-zinc-300 border border-zinc-700'
      break
    case 'subtle':
      variantClasses = 'bg-zinc-900 text-zinc-400 border border-zinc-800'
      break
    case 'success':
      variantClasses = 'bg-zinc-100 text-zinc-950 font-medium'
      break
    case 'warning':
      variantClasses = 'bg-zinc-800 text-zinc-200 border border-zinc-600'
      break
    case 'error':
      variantClasses = 'bg-zinc-900 text-zinc-200 border border-zinc-500 line-through decoration-zinc-400'
      break
    default:
      variantClasses = 'bg-zinc-900 text-zinc-200 border border-zinc-800'
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-mono tracking-wider uppercase rounded-none transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  )
}
