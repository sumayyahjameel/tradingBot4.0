import React, { useState, useRef, useEffect } from 'react'
import { Filter, X, Check } from 'lucide-react'

export interface FilterOptions {
  sectors: string[]
  selectedSectors: string[]
  minPnl?: number
  actionFilter?: string
  sortBy?: string
}

interface FilterPopoverProps {
  sectors: string[]
  selectedSectors: string[]
  onSectorChange: (sectors: string[]) => void
  onReset: () => void
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  sectors,
  selectedSectors,
  onSectorChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const toggleSector = (sector: string) => {
    if (selectedSectors.includes(sector)) {
      onSectorChange(selectedSectors.filter((s) => s !== sector))
    } else {
      onSectorChange([...selectedSectors, sector])
    }
  }

  const activeCount = selectedSectors.length

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono border transition-colors ${
          activeCount > 0 || isOpen
            ? 'bg-zinc-900 text-white border-zinc-500'
            : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
        }`}
      >
        <Filter className="w-3.5 h-3.5" />
        <span>SECTOR FILTERS</span>
        {activeCount > 0 && (
          <span className="px-1.5 py-0.2 bg-white text-black text-[10px] font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-64 bg-zinc-950 border border-zinc-700 shadow-2xl z-40 p-3 font-mono text-xs animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
            <span className="text-[11px] font-bold text-white uppercase">FILTER BY SECTOR</span>
            {activeCount > 0 && (
              <button
                onClick={onReset}
                className="text-[10px] text-zinc-400 hover:text-white underline"
              >
                RESET
              </button>
            )}
          </div>

          <div className="space-y-1 max-h-48 overflow-y-auto">
            {sectors.map((sector) => {
              const isSelected = selectedSectors.includes(sector)
              return (
                <button
                  key={sector}
                  onClick={() => toggleSector(sector)}
                  className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-zinc-900 text-left transition-colors"
                >
                  <span className={isSelected ? 'text-white font-medium' : 'text-zinc-400'}>
                    {sector}
                  </span>
                  <div
                    className={`w-3.5 h-3.5 border flex items-center justify-center ${
                      isSelected ? 'bg-white border-white text-black' : 'border-zinc-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
            <span>{selectedSectors.length} selected</span>
            <button
              onClick={() => setIsOpen(false)}
              className="px-2 py-0.5 bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
