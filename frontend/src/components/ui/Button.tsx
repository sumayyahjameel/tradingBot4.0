import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon'
  icon?: React.ReactNode
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-mono tracking-wider transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none rounded-none focus:outline-none'

  let sizeClasses = ''
  switch (size) {
    case 'xs':
      sizeClasses = 'text-[10px] px-2 py-0.5 gap-1'
      break
    case 'sm':
      sizeClasses = 'text-xs px-2.5 py-1 gap-1.5'
      break
    case 'lg':
      sizeClasses = 'text-sm px-5 py-2.5 gap-2'
      break
    case 'icon':
      sizeClasses = 'p-1.5 text-xs'
      break
    default:
      sizeClasses = 'text-xs px-3.5 py-1.5 gap-2'
  }

  let variantClasses = ''
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-white text-black font-semibold hover:bg-zinc-200 active:bg-zinc-300'
      break
    case 'secondary':
      variantClasses = 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800 border border-zinc-700'
      break
    case 'outline':
      variantClasses =
        'bg-transparent text-zinc-300 border border-zinc-800 hover:border-zinc-600 hover:text-white hover:bg-zinc-900/40'
      break
    case 'ghost':
      variantClasses = 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900'
      break
    case 'destructive':
      variantClasses = 'bg-transparent text-zinc-300 border border-zinc-600 border-dashed hover:bg-zinc-900'
      break
  }

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="opacity-80">{icon}</span>
      )}
      {children}
    </button>
  )
}
