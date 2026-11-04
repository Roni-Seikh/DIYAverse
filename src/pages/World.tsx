import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Flame, Search } from 'lucide-react'
import { Diya } from '@/components/Diya'
import { TiltCard } from '@/components/motion'
import { CloudBadge } from '@/components/CloudBadge'
import { useToast } from '@/components/Toast'
import { useDiyas } from '@/lib/DiyaContext'
import { DESIGNS, FLAMES, FLAME_KEYS } from '@/data/palette'
import { cleanText, LIMITS, validateEntry } from '@/lib/sanitize'
import { timeAgo } from '@/lib/time'
import type { DiyaDesign, FlameColor } from '@/lib/types'

const PAGE = 24

export default function World() {
  const toast = useToast()
  const { community, communityLoading, status, statusMessage, submitToWall } = useDiyas()
  const [q, setQ] = useState('')
  const [colorFilter, setColorFilter] = useState<FlameColor | null>(null)
  const [sort, setSort] = useState<'new' | 'old'>('new')
  const [shown, setShown] = useState(PAGE)

  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [region, setRegion] = useState('')
  const [design, setDesign] = useState<DiyaDesign>('clay')
  const [color, setColor] = useState<FlameColor>('gold')
  const [errors, setErrors] = useState<Partial<Record<'name' | 'wish' | 'region', string>>>({})
  const [busy, setBusy] = useState(false)

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const out = community.filter(
      (d) =>
        (!colorFilter || d.color === colorFilter) &&
        (!needle || d.name.toLowerCase().includes(needle) || d.wish.toLowerCase().includes(needle) || (d.region ?? '').toLowerCase().includes(needle)),
    )
    out.sort((a, b) => (sort === 'new' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt))
    return out
  }, [community, q, colorFilter, sort])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const n = cleanText(name, LIMITS.name)
    const w = cleanText(wish, LIMITS.wish)
    const r = cleanText(region, LIMITS.region)
    const check = validateEntry(n, w, r)
    setErrors(check.errors)
    if (!check.ok) return
    setBusy(true)
    const res = await submitToWall({ name: n, wish: w, design, color, region: r || undefined })
    setBusy(false)
    if (res.ok) {
      setWish('')
      setSort('new')
      toast(res.where === 'cloud' ? 'Your light joined the shared wall.' : 'Added in local demo mode. Only visible in this browser.', 'success')
    } else toast(res.error ?? 'Could not add your light.', 'error')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl font-bold gold-text">World of Lights</h1>
          <p className="mt-2 text-ink-300">A wall of wishes from people lighting diyas. Add yours, then watch it join the <Link to="/infinity" className="text-gold-300 underline">Infinity of Light</Link>.</p>
        </div>
        <CloudBadge />
      </header>

      {status !== 'connected' && (
        <div className={`mb-6 flex gap-3 rounded-xl border p-4 text-sm ${status === 'error' ? 'border-red-400/40 bg-red-500/10 text-red-100' : 'border-ink-400/30 bg-white/5 text-ink-300'}`} role="note">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>
            {statusMessage} Lights you add here are <strong>local</strong> to this browser and are not visible to other visitors.
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <form onSubmit={submit} className="panel h-fit space-y-4 p-5" noValidate>
          <h2 className="font-display text-2xl font-semibold text-ink-100">Add your light</h2>
          <div>
            <label className="lbl" htmlFor="w-name">
              Name or nickname
            </label>
            <input id="w-name" className="field" value={name} maxLength={LIMITS.name} onChange={(e) => setName(e.target.value)} placeholder="Anonymous is fine" aria-invalid={!!errors.name} />
            {errors.name && <p className="mt-1 text-sm text-red-300">{errors.name}</p>}
          </div>
          <div>
            <label className="lbl" htmlFor="w-wish">
              Your wish
            </label>
            <textarea id="w-wish" rows={3} className="field resize-none" value={wish} maxLength={LIMITS.wish} onChange={(e) => setWish(e.target.value)} aria-invalid={!!errors.wish} />
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-red-300">{errors.wish}</span>
              <span className="text-ink-400">
                {wish.length}/{LIMITS.wish}
              </span>
            </div>
          </div>
          <div>
            <label className="lbl" htmlFor="w-region">
              City or region (optional)
            </label>
            <input id="w-region" className="field" value={region} maxLength={LIMITS.region} onChange={(e) => setRegion(e.target.value)} aria-invalid={!!errors.region} />
            {errors.region && <p className="mt-1 text-sm text-red-300">{errors.region}</p>}
          </div>
          <div>
            <label className="lbl" htmlFor="w-design">
              Diya
            </label>
            <select id="w-design" className="field" value={design} onChange={(e) => setDesign(e.target.value as DiyaDesign)}>
              {DESIGNS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <fieldset>
            <legend className="lbl">Flame colour</legend>
            <div className="flex flex-wrap gap-2">
              {FLAME_KEYS.map((k) => (
                <button
                  type="button"
                  key={k}
                  aria-pressed={color === k}
                  aria-label={FLAMES[k].label}
                  onClick={() => setColor(k)}
                  className={`h-9 w-9 rounded-full border-2 ${color === k ? 'scale-110 border-white' : 'border-transparent'}`}
                  style={{ background: `radial-gradient(circle at 35% 30%, ${FLAMES[k].core}, ${FLAMES[k].main})` }}
                />
              ))}
            </div>
          </fieldset>
          <button className="btn-gold w-full" disabled={busy}>
            <Flame size={18} /> {busy ? 'Adding…' : 'Add my light'}
          </button>
          <p className="text-xs text-ink-400">Please keep wishes kind. Links and offensive language are blocked.</p>
        </form>

        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[12rem] flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <input className="field !pl-9" value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE) }} placeholder="Search wishes, names, regions" aria-label="Search lights" />
            </div>
            <select className="field !w-auto" value={sort} onChange={(e) => setSort(e.target.value as 'new' | 'old')} aria-label="Sort order">
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
            </select>
          </div>
          <div className="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by flame colour">
            <button aria-pressed={colorFilter === null} onClick={() => setColorFilter(null)} className={`rounded-full border px-3 py-1 text-xs ${colorFilter === null ? 'border-gold-400 bg-gold-400/15 text-gold-300' : 'border-ink-400/30 text-ink-300'}`}>
              All colours
            </button>
            {FLAME_KEYS.map((k) => (
              <button key={k} aria-pressed={colorFilter === k} onClick={() => setColorFilter(colorFilter === k ? null : k)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${colorFilter === k ? 'border-gold-400 bg-gold-400/15 text-gold-300' : 'border-ink-400/30 text-ink-300'}`}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: FLAMES[k].main }} /> {FLAMES[k].label}
              </button>
            ))}
          </div>

          {communityLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading lights">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="panel h-44 animate-pulse" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="panel grid place-items-center p-10 text-center">
              <Diya design="clay" color="gold" lit={false} className="w-28 opacity-80" />
              <p className="font-display mt-3 text-2xl text-ink-100">{community.length === 0 ? 'No lights here yet' : 'No lights match your filters'}</p>
              <p className="mt-1 max-w-sm text-sm text-ink-300">
                {community.length === 0 ? 'Be the first to add a wish. It will appear here straight away.' : 'Try a different search or clear the colour filter.'}
              </p>
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm text-ink-400" aria-live="polite">
                Showing {Math.min(shown, list.length)} of {list.length} light{list.length === 1 ? '' : 's'}
              </p>
              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {list.slice(0, shown).map((d) => (
                  <li key={d.id}>
                   <TiltCard className="panel flex h-full flex-col items-center p-4 text-center">
                    <Diya design={d.design} color={d.color} lit className="w-24" />
                    <p className="font-display mt-1 text-xl text-ink-100">{d.name}</p>
                    <p className="mt-1 line-clamp-4 break-words text-sm text-ink-300">“{d.wish}”</p>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-400">
                      <span>{timeAgo(d.createdAt)}</span>
                      {d.region && <span>· {d.region}</span>}
                      {d.source === 'local' && <span className="rounded-full border border-ink-400/40 px-2 py-0.5">Local only</span>}
                    </div>
                   </TiltCard>
                  </li>
                ))}
              </ul>
              {shown < list.length && (
                <div className="mt-6 text-center">
                  <button className="btn-ghost" onClick={() => setShown((s) => s + PAGE)}>
                    Show more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
