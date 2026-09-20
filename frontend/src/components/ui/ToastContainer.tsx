import React from 'react'
import { useApp } from '../../context/AppContext'
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react'

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none font-mono">
      {toasts.map((t) => {
        const getIcon = () => {
          switch (t.type) {
            case 'success':
              return <CheckCircle className="w-4 h-4 text-white" />
            case 'error':
              return <AlertOctagon className="w-4 h-4 text-white" />
            case 'warning':
              return <AlertTriangle className="w-4 h-4 text-zinc-300" />
            case 'info':
            default:
              return <Info className="w-4 h-4 text-zinc-400" />
          }
        }

        return (
          <div
            key={t.id}
            className="pointer-events-auto bg-zinc-950/95 backdrop-blur-md border border-zinc-700 shadow-2xl p-3.5 flex items-start gap-3 transition-all transform duration-200 animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white tracking-wide truncate uppercase">
                  {t.title}
                </span>
                <span className="text-[10px] text-zinc-500 shrink-0">{t.timestamp}</span>
              </div>
              {t.description && (
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-zinc-500 hover:text-white p-0.5 hover:bg-zinc-900 transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
