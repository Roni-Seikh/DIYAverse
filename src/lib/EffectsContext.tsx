import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion'
import { readJSON, writeJSON } from './storage'

const KEY = 'diyaverse.effects.v1'

interface Ctx {
  /** True only when the visitor wants decorative effects AND has not asked the OS for reduced motion. */
  effects: boolean
  userPref: boolean
  reducedMotion: boolean
  toggle: () => void
}

const EffectsCtx = createContext<Ctx>({ effects: true, userPref: true, reducedMotion: false, toggle: () => {} })

export function EffectsProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()
  const [userPref, setPref] = useState(() => readJSON<boolean>(KEY, true))
  const toggle = useCallback(() => {
    setPref((p) => {
      writeJSON(KEY, !p)
      return !p
    })
  }, [])
  const value = useMemo(() => ({ effects: userPref && !reducedMotion, userPref, reducedMotion, toggle }), [userPref, reducedMotion, toggle])
  return <EffectsCtx.Provider value={value}>{children}</EffectsCtx.Provider>
}

export const useEffects = () => useContext(EffectsCtx)
