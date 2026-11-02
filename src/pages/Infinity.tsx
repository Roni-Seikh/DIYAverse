import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import { InfinityCanvas, type InfinityHandle, type LightPoint } from '@/components/InfinityCanvas'
import { CloudBadge } from '@/components/CloudBadge'
import { Diya } from '@/components/Diya'
import { useDiyas } from '@/lib/DiyaContext'
import { FLAMES, FLAME_KEYS } from '@/data/palette'
import { illustrativePoints } from '@/data/sample'
import type { FlameColor } from '@/lib/types'

export default function InfinityPage() {
  const { community, status, communityLoading } = useDiyas()
  const ref = useRef<InfinityHandle>(null)
  const [filter, setFilter] = useState<FlameColor | null>(null)
  const [selected, setSelected] = useState<LightPoint | null>(null)

  const real = useMemo<LightPoint[]>(
    () => community.map((d) => ({ id: d.id, name: d.name, wish: d.wish, color: d.color, createdAt: d.createdAt, region: d.region })),
    [community],
  )
  const illustrative = real.length === 0
  const points = useMemo(() => (illustrative ? illustrativePoints(72) : real), [illustrative, real])
  const selectedDiya = selected ? community.find((d) => d.id === selected.id) : undefined
  const order = selected ? [...points].sort((a, b) => a.createdAt - b.createdAt).findIndex((p) => p.id === selected.id) + 1 : 0

  const counts = useMemo(() => {
    const c = {} as Record<FlameColor, number>
    for (const k of FLAME_KEYS) c[k] = real.filter((p) => p.color === k).length
    return c
  }, [real])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl font-bold gold-text">The Infinity of Light</h1>
          <p className="mt-2 text-ink-300">Every diya on the wall takes its own place in a spiral mandala. Hover or tap a light to read its wish, scroll or pinch to zoom, drag to explore.</p>
        </div>
        <CloudBadge />
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="panel relative overflow-hidden p-0">
          <InfinityCanvas
            ref={ref}
            points={points}
            filter={filter}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
            ariaLabel={illustrative ? 'Illustrative mandala of sample lights' : `Mandala of ${real.length} community lights`}
            className="h-[62vh] min-h-[22rem] w-full"
          />
          {communityLoading && <div className="absolute inset-0 grid place-items-center bg-night-950/60 text-sm text-ink-300">Gathering lights…</div>}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            <button className="btn-ghost !p-2" onClick={() => ref.current?.zoomIn()} aria-label="Zoom in">
              <Plus size={18} />
            </button>
            <button className="btn-ghost !p-2" onClick={() => ref.current?.zoomOut()} aria-label="Zoom out">
              <Minus size={18} />
            </button>
            <button className="btn-ghost !p-2" onClick={() => ref.current?.reset()} aria-label="Reset view">
              <RotateCcw size={18} />
            </button>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="rounded-full border border-gold-400/30 bg-night-950/85 px-3 py-1 text-ink-100" aria-live="polite">
              {illustrative ? 'Illustrative example · not real people' : `${real.length} real light${real.length === 1 ? '' : 's'}`}
              {status !== 'connected' && !illustrative ? ' · local demo' : ''}
            </span>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="panel p-4">
            <p className="lbl">Filter by colour</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter lights by colour">
              <button aria-pressed={filter === null} onClick={() => setFilter(null)} className={`rounded-full border px-3 py-1 text-xs ${filter === null ? 'border-gold-400 bg-gold-400/15 text-gold-300' : 'border-ink-400/30 text-ink-300'}`}>
                All
              </button>
              {FLAME_KEYS.map((k) => (
                <button key={k} aria-pressed={filter === k} onClick={() => setFilter(filter === k ? null : k)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${filter === k ? 'border-gold-400 bg-gold-400/15 text-gold-300' : 'border-ink-400/30 text-ink-300'}`}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: FLAMES[k].main }} />
                  {FLAMES[k].label}
                  {!illustrative && <span className="text-ink-400">{counts[k]}</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="panel min-h-[14rem] p-4" aria-live="polite">
            {selected ? (
              <div className="text-center">
                <Diya design={selectedDiya?.design ?? 'clay'} color={selected.color} lit className="mx-auto w-28" />
                <p className="mt-1 text-xs uppercase tracking-widest text-gold-300">{selected.illustrative ? 'Illustrative light' : `Light #${order}`}</p>
                <p className="font-display text-2xl text-ink-100">{selected.illustrative ? 'Example' : selected.name}</p>
                <p className="mt-2 break-words text-ink-300">“{selected.wish}”</p>
                {!selected.illustrative && (
                  <p className="mt-3 text-xs text-ink-400">
                    Lit {new Date(selected.createdAt).toLocaleString()}
                    {selected.region ? ` · ${selected.region}` : ''}
                  </p>
                )}
              </div>
            ) : (
              <p className="grid h-full place-items-center text-center text-sm text-ink-400">Select a light to read its story.</p>
            )}
          </div>

          {illustrative && (
            <div className="panel p-4 text-sm text-ink-300">
              <p>No one has added a light yet, so this is an illustrative example. Add the first one and the mandala becomes real.</p>
              <Link to="/light" className="btn-gold mt-3">
                Light a diya
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
