import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  prefixText?: string
  suffixText?: string
}

export const Input: React.FC<InputProps> = ({
  icon,
  prefixText,
  suffixText,
  className = '',
  ...props
}) => {
  return (
    <div className="relative flex items-center w-full">
      {icon && (
        <span className="absolute left-2.5 text-zinc-500 pointer-events-none flex items-center">
          {icon}
        </span>
      )}
      {prefixText && (
        <span className="absolute left-2.5 text-zinc-500 font-mono text-xs pointer-events-none">
          {prefixText}
        </span>
      )}
      <input
        className={`w-full bg-zinc-950 border border-zinc-800 text-primary placeholder-zinc-600 text-xs font-mono py-1.5 px-3 rounded-none focus:outline-none focus:border-zinc-500 transition-colors ${
          icon || prefixText ? 'pl-8' : ''
        } ${suffixText ? 'pr-8' : ''} ${className}`}
        {...props}
      />
      {suffixText && (
        <span className="absolute right-2.5 text-zinc-500 font-mono text-xs pointer-events-none">
          {suffixText}
        </span>
      )}
    </div>
  )
}
