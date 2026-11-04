import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CloudBadge } from '@/components/CloudBadge'
import { useDiyas } from '@/lib/DiyaContext'
import { DESIGNS, FLAMES, FLAME_KEYS } from '@/data/palette'

function Stat({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="panel panel-hover p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-400">{label}</p>
      <p className="font-display mt-1 text-5xl font-bold gold-text">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  )
}

function Bars({ rows, label }: { rows: { name: string; value: number; color: string }[]; label: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <ul className="space-y-2" aria-label={label}>
      {rows.map((r) => (
        <li key={r.name} className="grid grid-cols-[6rem_1fr_2.5rem] items-center gap-2 text-sm">
          <span className="truncate text-ink-300">{r.name}</span>
          <span className="h-3 overflow-hidden rounded-full bg-white/5">
            <span className="block h-full rounded-full" style={{ width: `${(r.value / max) * 100}%`, background: r.color }} />
          </span>
          <span className="text-right tabular-nums text-ink-100">{r.value}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Impact() {
  const { community, status, stats, mine } = useDiyas()
  const cloud = status === 'connected'

  const d = useMemo(() => {
    const now = Date.now()
    const day = 24 * 3600 * 1000
    const regions = new Map<string, number>()
    for (const x of community) {
      const r = x.region?.trim()
      if (r) {
        const key = r.toLowerCase()
        regions.set(key, (regions.get(key) ?? 0) + 1)
      }
    }
    const regionLabel = new Map<string, string>()
    for (const x of community) if (x.region) regionLabel.set(x.region.trim().toLowerCase(), x.region.trim())
    return {
      total: community.length,
      last24: community.filter((x) => now - x.createdAt < day).length,
      last7: community.filter((x) => now - x.createdAt < 7 * day).length,
      byColor: FLAME_KEYS.map((k) => ({ name: FLAMES[k].label, value: community.filter((x) => x.color === k).length, color: FLAMES[k].main })),
      byDesign: DESIGNS.map((x) => ({ name: x.label, value: community.filter((c) => c.design === x.key).length, color: '#ffc95c' })),
      regions: [...regions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => ({ name: regionLabel.get(k) ?? k, value: v, color: '#a678ff' })),
    }
  }, [community])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl font-bold gold-text">Light Impact</h1>
          <p className="mt-2 text-ink-300">Every number on this page is counted from real data. Nothing is estimated or made up.</p>
        </div>
        <CloudBadge />
      </header>

      <section aria-labelledby="comm-h">
        <h2 id="comm-h" className="font-display text-3xl font-semibold text-ink-100">
          {cloud ? 'Community wall (shared, live)' : 'Wall in this browser (local demo)'}
        </h2>
        <p className="mb-4 mt-1 text-sm text-ink-400">
          {cloud
            ? 'Counted live from Google Firestore. This is the most recent 300 lights.'
            : 'Firestore isn’t connected, so these numbers only include lights added in this browser. They are not community-wide.'}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label={cloud ? 'Lights on the wall' : 'Local lights'} value={d.total} />
          <Stat label="Wishes shared" value={d.total} hint="Every light carries one wish" />
          <Stat label="Added in last 24 hours" value={d.last24} hint={`${d.last7} in the last 7 days`} />
        </div>

        {d.total === 0 ? (
          <p className="panel mt-4 p-6 text-ink-300">
            Nothing to chart yet. <Link to="/world" className="text-gold-300 underline">Add the first light</Link> and it will show up here.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="panel p-5">
              <h3 className="mb-3 font-semibold text-ink-100">Flame colours</h3>
              <Bars rows={d.byColor} label="Lights by flame colour" />
            </div>
            <div className="panel p-5">
              <h3 className="mb-3 font-semibold text-ink-100">Diya designs</h3>
              <Bars rows={d.byDesign} label="Lights by diya design" />
            </div>
            <div className="panel p-5">
              <h3 className="mb-3 font-semibold text-ink-100">Regions (shared voluntarily)</h3>
              {d.regions.length ? <Bars rows={d.regions} label="Lights by region" /> : <p className="text-sm text-ink-400">No one has shared a region yet.</p>}
            </div>
          </div>
        )}
      </section>

      <section className="mt-12" aria-labelledby="dev-h">
        <h2 id="dev-h" className="font-display text-3xl font-semibold text-ink-100">
          On this device
        </h2>
        <p className="mb-4 mt-1 text-sm text-ink-400">Private to you, stored in this browser only.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Diyas lit" value={stats.diyasLit} hint={`${mine.length} in your collection`} />
          <Stat label="Greetings written" value={stats.wishesGenerated} />
          <Stat label="Rangolis downloaded" value={stats.rangoliSaved} />
          <Stat label="Regions shared" value={mine.filter((m) => m.region).length} hint="From your own diyas" />
        </div>
      </section>
    </div>
  )
}
