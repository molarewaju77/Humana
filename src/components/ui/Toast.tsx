import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import type { Toast, ToastType } from '../../lib/types'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ToastContextValue {
  addToast: (type: ToastType, title: string, message?: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-brand-success shrink-0" />,
  error: <XCircle size={18} className="text-brand-error shrink-0" />,
  warning: <AlertTriangle size={18} className="text-brand-warning shrink-0" />,
  info: <Info size={18} className="text-primary shrink-0" />,
}

const TOAST_DURATION = 5000

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    timerRef.current = setTimeout(() => onRemove(toast.id), TOAST_DURATION)
    return () => clearTimeout(timerRef.current)
  }, [toast.id, onRemove])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-start gap-3 w-full max-w-sm px-4 py-3.5 rounded-xl bg-white border border-brand-border shadow-card-md animate-toast-in',
      )}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-brand-deeptext">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-brand-secondarytext mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="shrink-0 size-6 flex items-center justify-center rounded-md text-brand-secondarytext hover:bg-muted hover:text-brand-deeptext transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev.slice(-4), { id, type, title, message }])
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
