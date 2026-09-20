import React from 'react'

export interface TabItem {
  id: string
  label: string
  count?: number | string
  badge?: string
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'underline' | 'boxed' | 'pills'
  size?: 'sm' | 'md'
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  size = 'md',
  className = '',
}) => {
  if (variant === 'boxed') {
    return (
      <div className={`inline-flex p-0.5 bg-zinc-950 border border-zinc-800 ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`px-3 py-1 text-xs font-mono tracking-wider transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-zinc-100 text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1 py-0.2 ${
                    isActive ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`flex border-b border-zinc-800 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const py = size === 'sm' ? 'py-1.5' : 'py-2.5'
        const px = size === 'sm' ? 'px-3' : 'px-4'

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`${px} ${py} text-xs font-mono tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
              isActive
                ? 'border-white text-white font-medium bg-zinc-900/30'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-[10px] px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span className="text-[9px] px-1 bg-zinc-800 text-zinc-400 uppercase">
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
