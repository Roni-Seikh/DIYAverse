import { Cloud, CloudOff, Loader2, TriangleAlert } from 'lucide-react'
import { useDiyas } from '@/lib/DiyaContext'

/** Truthful connection indicator. "Connected" only appears after a real Firestore server snapshot. */
export function CloudBadge({ compact = false }: { compact?: boolean }) {
  const { status, statusMessage } = useDiyas()
  const map = {
    connected: { icon: <Cloud size={14} />, text: 'Firestore connected', cls: 'border-emerald-400/50 text-emerald-200 bg-emerald-500/10' },
    connecting: { icon: <Loader2 size={14} className="animate-spin" />, text: 'Connecting…', cls: 'border-gold-400/40 text-gold-300 bg-gold-400/10' },
    error: { icon: <TriangleAlert size={14} />, text: 'Cloud unreachable · local demo', cls: 'border-red-400/50 text-red-200 bg-red-500/10' },
    local: { icon: <CloudOff size={14} />, text: 'Local demo mode', cls: 'border-ink-400/40 text-ink-300 bg-white/5' },
  } as const
  const m = map[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${m.cls}`}
      title={statusMessage}
      role="status"
      aria-label={`Storage status: ${statusMessage}`}
    >
      {m.icon}
      {compact ? null : m.text}
      {compact ? <span className="sr-only">{m.text}</span> : null}
    </span>
  )
}
