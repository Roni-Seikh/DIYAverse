import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { isFirebaseConfigured, loadCloud, type Cloud } from './firebase'
import { KEYS, readJSON, writeJSON } from './storage'
import { validateEntry, cleanText, LIMITS } from './sanitize'
import { FLAMES, DESIGNS } from '@/data/palette'
import type { CloudStatus, Diya, NewDiya } from './types'

export interface Stats {
  diyasLit: number
  wishesGenerated: number
  rangoliSaved: number
}

export interface SubmitResult {
  ok: boolean
  where?: 'cloud' | 'local'
  error?: string
}

interface Ctx {
  status: CloudStatus
  statusMessage: string
  community: Diya[]
  communityLoading: boolean
  mine: Diya[]
  stats: Stats
  lightDiya: (d: NewDiya) => Diya
  removeMine: (id: string) => void
  submitToWall: (d: NewDiya) => Promise<SubmitResult>
  bump: (k: keyof Stats) => void
}

const DiyaCtx = createContext<Ctx | null>(null)

const COOLDOWN_MS = 20_000
const defaultStats: Stats = { diyasLit: 0, wishesGenerated: 0, rangoliSaved: 0 }

function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/** Guards against malformed data coming back from storage or the network. */
function isValidDiya(x: unknown): x is Diya {
  if (!x || typeof x !== 'object') return false
  const d = x as Partial<Diya>
  return (
    typeof d.id === 'string' &&
    typeof d.name === 'string' &&
    typeof d.wish === 'string' &&
    typeof d.createdAt === 'number' &&
    typeof d.color === 'string' &&
    d.color in FLAMES &&
    DESIGNS.some((x2) => x2.key === d.design)
  )
}

export function DiyaProvider({ children }: { children: ReactNode }) {
  const [mine, setMine] = useState<Diya[]>(() => readJSON<unknown[]>(KEYS.mine, []).filter(isValidDiya))
  const [localWall, setLocalWall] = useState<Diya[]>(() => readJSON<unknown[]>(KEYS.localWall, []).filter(isValidDiya))
  const [stats, setStats] = useState<Stats>(() => ({ ...defaultStats, ...readJSON<Partial<Stats>>(KEYS.stats, {}) }))
  const [cloudItems, setCloudItems] = useState<Diya[]>([])
  const [status, setStatus] = useState<CloudStatus>(isFirebaseConfigured ? 'connecting' : 'local')
  const [statusMessage, setStatusMessage] = useState(
    isFirebaseConfigured ? 'Connecting to Firestore…' : 'Local demo mode — Firebase is not configured. Contributions stay in this browser.',
  )
  const cloudRef = useRef<Cloud | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured) return
    let unsub: (() => void) | undefined
    let cancelled = false
    const timer = window.setTimeout(() => {
      if (cancelled) return
      setStatus((s) => {
        if (s === 'connecting') {
          setStatusMessage('Could not reach Firestore. Showing local demo mode instead.')
          return 'error'
        }
        return s
      })
    }, 10_000)

    loadCloud()
      .then((cloud) => {
        if (cancelled || !cloud) return
        cloudRef.current = cloud
        unsub = cloud.subscribe(
          (items, fromServer) => {
            setCloudItems(items.filter(isValidDiya))
            if (fromServer) {
              setStatus('connected')
              setStatusMessage('Connected to Google Firestore — contributions are shared.')
            }
          },
          (err) => {
            setStatus('error')
            setStatusMessage(
              err.message.toLowerCase().includes('permission')
                ? 'Firestore rejected the request (check security rules). Showing local demo mode.'
                : 'Firestore connection failed. Showing local demo mode.',
            )
          },
        )
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
        setStatusMessage('Could not load the Firebase SDK. Showing local demo mode.')
      })

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      unsub?.()
    }
  }, [])

  const cloudLive = status === 'connected'
  const community = useMemo(() => (cloudLive ? cloudItems : localWall), [cloudLive, cloudItems, localWall])

  const lightDiya = useCallback((d: NewDiya) => {
    const diya: Diya = { ...d, id: newId(), createdAt: Date.now(), source: 'local' }
    setMine((prev) => {
      const next = [diya, ...prev].slice(0, 100)
      writeJSON(KEYS.mine, next)
      return next
    })
    setStats((s) => {
      const next = { ...s, diyasLit: s.diyasLit + 1 }
      writeJSON(KEYS.stats, next)
      return next
    })
    return diya
  }, [])

  const removeMine = useCallback((id: string) => {
    setMine((prev) => {
      const next = prev.filter((d) => d.id !== id)
      writeJSON(KEYS.mine, next)
      return next
    })
  }, [])

  const bump = useCallback((k: keyof Stats) => {
    setStats((s) => {
      const next = { ...s, [k]: s[k] + 1 }
      writeJSON(KEYS.stats, next)
      return next
    })
  }, [])

  const submitToWall = useCallback(
    async (d: NewDiya): Promise<SubmitResult> => {
      const name = cleanText(d.name, LIMITS.name)
      const wish = cleanText(d.wish, LIMITS.wish)
      const region = d.region ? cleanText(d.region, LIMITS.region) : ''
      const check = validateEntry(name, wish, region)
      if (!check.ok) return { ok: false, error: Object.values(check.errors)[0] }

      const last = readJSON<number>(KEYS.lastSubmit, 0)
      const wait = COOLDOWN_MS - (Date.now() - last)
      if (wait > 0) return { ok: false, error: `Please wait ${Math.ceil(wait / 1000)}s before adding another light.` }

      const clean: NewDiya = { name, wish, design: d.design, color: d.color, region: region || undefined }
      try {
        if (cloudLive && cloudRef.current) {
          await cloudRef.current.add(clean)
          writeJSON(KEYS.lastSubmit, Date.now())
          return { ok: true, where: 'cloud' }
        }
        const item: Diya = { ...clean, id: newId(), createdAt: Date.now(), source: 'local' }
        setLocalWall((prev) => {
          const next = [item, ...prev].slice(0, 200)
          writeJSON(KEYS.localWall, next)
          return next
        })
        writeJSON(KEYS.lastSubmit, Date.now())
        return { ok: true, where: 'local' }
      } catch {
        return { ok: false, error: 'We could not save your light. Please check your connection and try again.' }
      }
    },
    [cloudLive],
  )

  const value: Ctx = {
    status,
    statusMessage,
    community,
    communityLoading: status === 'connecting',
    mine,
    stats,
    lightDiya,
    removeMine,
    submitToWall,
    bump,
  }
  return <DiyaCtx.Provider value={value}>{children}</DiyaCtx.Provider>
}

export function useDiyas(): Ctx {
  const c = useContext(DiyaCtx)
  if (!c) throw new Error('useDiyas must be used inside <DiyaProvider>')
  return c
}
