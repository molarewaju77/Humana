import { createContext, useContext, useCallback } from 'react'
import { toast as reactToast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import type { ToastType } from '../../lib/types'

interface ToastContextValue {
  addToast: (type: ToastType, title: string, message?: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Return a fallback that calls reactToast directly if used outside provider
    return {
      addToast: (type: ToastType, title: string, message?: string) => {
        const content = (
          <div>
            <p className="font-semibold text-sm">{title}</p>
            {message && <p className="text-xs opacity-90 mt-0.5">{message}</p>}
          </div>
        )
        reactToast[type === 'warning' ? 'warn' : type](content)
      },
      removeToast: (id: string) => {
        reactToast.dismiss(id)
      }
    }
  }
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const removeToast = useCallback((id: string) => {
    reactToast.dismiss(id)
  }, [])

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const content = (
      <div>
        <p className="font-semibold text-sm leading-snug">{title}</p>
        {message && <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{message}</p>}
      </div>
    )

    if (type === 'success') {
      reactToast.success(content)
    } else if (type === 'error') {
      reactToast.error(content)
    } else if (type === 'warning') {
      reactToast.warn(content)
    } else {
      reactToast.info(content)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ToastContext.Provider>
  )
}

export { reactToast as toast }

