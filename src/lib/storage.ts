/** localStorage wrappers that never throw (private mode, quota, disabled storage). */
export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const KEYS = {
  mine: 'diyaverse.mine.v1',
  localWall: 'diyaverse.localWall.v1',
  stats: 'diyaverse.stats.v1',
  lastSubmit: 'diyaverse.lastSubmit.v1',
  introSeen: 'diyaverse.introSeen',
} as const
