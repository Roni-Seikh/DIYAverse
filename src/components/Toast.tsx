import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Kind = 'info' | 'success' | 'error'
interface Item {
  id: number
  text: string
  kind: Kind
}

const ToastCtx = createContext<(text: string, kind?: Kind) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const idRef = useRef(0)
  const push = useCallback((text: string, kind: Kind = 'info') => {
    const id = ++idRef.current
    setItems((p) => [...p.slice(-2), { id, text, kind }])
    window.setTimeout(() => setItems((p) => p.filter((i) => i.id !== id)), 4200)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 left-1/2 z-[90] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2" role="status" aria-live="polite">
        <AnimatePresence>
          {items.map((i) => (
            <motion.div
              key={i.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={`rounded-xl border px-4 py-3 text-sm shadow-xl backdrop-blur ${
                i.kind === 'error'
                  ? 'border-red-400/50 bg-red-950/90 text-red-100'
                  : i.kind === 'success'
                    ? 'border-gold-400/50 bg-night-800/95 text-ink-100'
                    : 'border-ink-400/40 bg-night-800/95 text-ink-100'
              }`}
            >
              {i.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
