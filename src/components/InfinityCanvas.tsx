import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { FLAMES, FLAME_KEYS } from '@/data/palette'
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion'
import type { FlameColor } from '@/lib/types'

export interface LightPoint {
  id: string
  name: string
  wish: string
  color: FlameColor
  createdAt: number
  region?: string
  illustrative?: boolean
}

export interface InfinityHandle {
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
}

interface Props {
  points: LightPoint[]
  filter: FlameColor | null
  selectedId: string | null
  onSelect: (p: LightPoint | null) => void
  className?: string
  ariaLabel: string
  interactive?: boolean
}

const GOLDEN = Math.PI * (3 - Math.sqrt(5))
const SPACING = 24
const MIN_SCALE = 0.35
const MAX_SCALE = 7

/** Each diya keeps a stable seat in a golden-angle spiral, so the mandala grows without rearranging. */
function seat(i: number) {
  const r = SPACING * Math.sqrt(i + 0.5)
  const a = i * GOLDEN
  return { x: r * Math.cos(a), y: r * Math.sin(a) }
}

function makeSprites(): Record<FlameColor, HTMLCanvasElement> {
  const out = {} as Record<FlameColor, HTMLCanvasElement>
  for (const k of FLAME_KEYS) {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const g = c.getContext('2d')!
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0, FLAMES[k].core)
    grad.addColorStop(0.18, FLAMES[k].main)
    grad.addColorStop(0.45, FLAMES[k].main + '66')
    grad.addColorStop(1, FLAMES[k].main + '00')
    g.fillStyle = grad
    g.fillRect(0, 0, 64, 64)
    out[k] = c
  }
  return out
}

interface View {
  scale: number
  tx: number
  ty: number
}

export const InfinityCanvas = forwardRef<InfinityHandle, Props>(function InfinityCanvas(
  { points, filter, selectedId, onSelect, className, ariaLabel, interactive = true },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null)

  const sorted = useMemo(() => [...points].sort((a, b) => a.createdAt - b.createdAt), [points])

  // Mutable state read by the animation loop (avoids re-subscribing on every prop change).
  const live = useRef({
    sorted,
    filter,
    selectedId,
    view: { scale: 1, tx: 0, ty: 0 } as View,
    target: { scale: 1, tx: 0, ty: 0 } as View,
    size: { w: 0, h: 0 },
    dirty: true,
    born: performance.now(),
    reduced,
    hoverId: null as string | null,
    fitted: false,
  })
  live.current.sorted = sorted
  live.current.filter = filter
  live.current.selectedId = selectedId
  live.current.reduced = reduced
  live.current.dirty = true

  const fitView = (): View => {
    const { w, h } = live.current.size
    const n = Math.max(live.current.sorted.length, 1)
    const R = SPACING * Math.sqrt(n + 1) + 36
    const scale = Math.min(2.4, Math.max(0.5, Math.min(w, h) / 2 / R))
    return { scale, tx: 0, ty: 0 }
  }

  const zoomBy = (f: number) => {
    const t = live.current.target
    t.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale * f))
    t.tx *= f
    t.ty *= f
    live.current.dirty = true
  }

  useImperativeHandle(ref, () => ({
    zoomIn: () => zoomBy(1.4),
    zoomOut: () => zoomBy(1 / 1.4),
    reset: () => {
      live.current.target = fitView()
      live.current.dirty = true
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const sprites = makeSprites()
    const L = live.current
    let dpr = 1
    let raf = 0

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = wrap.getBoundingClientRect()
      L.size = { w: r.width, h: r.height }
      canvas.width = Math.max(1, Math.floor(r.width * dpr))
      canvas.height = Math.max(1, Math.floor(r.height * dpr))
      if (!L.fitted && r.width > 0) {
        L.view = fitView()
        L.target = { ...L.view }
        L.fitted = true
      }
      L.dirty = true
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const toScreen = (x: number, y: number) => ({
      sx: L.size.w / 2 + L.view.tx + x * L.view.scale,
      sy: L.size.h / 2 + L.view.ty + y * L.view.scale,
    })

    const draw = (now: number) => {
      const { w, h } = L.size
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const { scale } = L.view
      const n = L.sorted.length
      const R = SPACING * Math.sqrt(n + 1) + 36

      // --- mandala scaffolding (rings, spokes, petals, Fibonacci lattice)
      ctx.save()
      ctx.translate(w / 2 + L.view.tx, h / 2 + L.view.ty)
      ctx.scale(scale, scale)
      ctx.lineWidth = 1 / scale
      const rings = Math.max(2, Math.ceil(R / 70))
      for (let k = 1; k <= rings; k++) {
        ctx.strokeStyle = `rgba(255,201,92,${0.1 - k * 0.006 > 0.03 ? 0.1 - k * 0.006 : 0.03})`
        ctx.beginPath()
        ctx.arc(0, 0, k * 70, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.strokeStyle = 'rgba(166,120,255,0.10)'
      for (let s = 0; s < 12; s++) {
        const a = (s / 12) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(a) * rings * 70, Math.sin(a) * rings * 70)
        ctx.stroke()
      }
      ctx.strokeStyle = 'rgba(255,201,92,0.07)'
      const pr = rings * 70
      for (let s = 0; s < 12; s++) {
        ctx.save()
        ctx.rotate((s / 12) * Math.PI * 2)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(pr * 0.25, -pr * 0.18, pr * 0.7, -pr * 0.14, pr, 0)
        ctx.bezierCurveTo(pr * 0.7, pr * 0.14, pr * 0.25, pr * 0.18, 0, 0)
        ctx.stroke()
        ctx.restore()
      }
      ctx.strokeStyle = 'rgba(255,214,140,0.09)'
      ctx.beginPath()
      for (let i = 0; i < n; i++) {
        const p = seat(i)
        for (const d of [8, 13]) {
          if (i + d < n) {
            const q = seat(i + d)
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
          }
        }
      }
      ctx.stroke()
      ctx.restore()

      // --- lights
      const t = now - L.born
      for (let i = 0; i < n; i++) {
        const p = L.sorted[i]
        const { x, y } = seat(i)
        const { sx, sy } = toScreen(x, y)
        if (sx < -40 || sy < -40 || sx > w + 40 || sy > h + 40) continue
        const appear = L.reduced ? 1 : Math.min(1, Math.max(0, (t - i * 9) / 650))
        if (appear <= 0) continue
        const ease = 1 - Math.pow(1 - appear, 3)
        const match = !L.filter || L.filter === p.color
        const twinkle = L.reduced ? 1 : 0.82 + 0.18 * Math.sin(now / 520 + i * 1.7)
        const base = Math.max(5, Math.min(14, 4.6 * Math.sqrt(scale) + 2))
        const isSel = L.selectedId === p.id
        const isHover = L.hoverId === p.id
        const size = (base * (isSel ? 2.6 : isHover ? 2.3 : 1.8) + (isSel ? 4 : 0)) * ease
        ctx.globalAlpha = (match ? 1 : 0.1) * twinkle
        ctx.drawImage(sprites[p.color], sx - size, sy - size, size * 2, size * 2)
        if (p.illustrative) {
          ctx.globalAlpha = match ? 0.7 : 0.1
          ctx.strokeStyle = FLAMES[p.color].main
          ctx.setLineDash([2, 3])
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(sx, sy, size * 0.55, 0, Math.PI * 2)
          ctx.stroke()
          ctx.setLineDash([])
        }
        if (isSel) {
          ctx.globalAlpha = 1
          ctx.strokeStyle = '#fff6e2'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(sx, sy, size * 0.62, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (document.hidden) return
      // ease the view towards its target
      const v = L.view
      const tg = L.target
      const k = L.reduced ? 1 : 0.18
      if (Math.abs(tg.scale - v.scale) > 0.0005 || Math.abs(tg.tx - v.tx) > 0.05 || Math.abs(tg.ty - v.ty) > 0.05) {
        v.scale += (tg.scale - v.scale) * k
        v.tx += (tg.tx - v.tx) * k
        v.ty += (tg.ty - v.ty) * k
        L.dirty = true
      }
      // Twinkle keeps the scene alive; reduced-motion users only get a repaint when something changes.
      if (L.reduced && !L.dirty) return
      draw(now)
      L.dirty = false
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  // Keep the filter/selection in sync and refit when the data set grows.
  const count = sorted.length
  useEffect(() => {
    live.current.born = performance.now()
    if (live.current.size.w > 0) {
      live.current.target = fitView()
      live.current.dirty = true
    }
  }, [count])

  // --- interaction
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !interactive) return
    const L = live.current
    const pointers = new Map<number, { x: number; y: number }>()
    let moved = 0
    let pinch = 0
    let down: { x: number; y: number } | null = null

    const rect = () => canvas.getBoundingClientRect()

    const hit = (px: number, py: number): LightPoint | null => {
      const { w, h } = L.size
      let best: LightPoint | null = null
      let bestD = 20 * 20
      for (let i = 0; i < L.sorted.length; i++) {
        const p = L.sorted[i]
        if (L.filter && L.filter !== p.color) continue
        const s = seat(i)
        const sx = w / 2 + L.view.tx + s.x * L.view.scale
        const sy = h / 2 + L.view.ty + s.y * L.view.scale
        const d = (sx - px) ** 2 + (sy - py) ** 2
        if (d < bestD) {
          bestD = d
          best = p
        }
      }
      return best
    }

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId)
      const r = rect()
      pointers.set(e.pointerId, { x: e.clientX - r.left, y: e.clientY - r.top })
      if (pointers.size === 1) {
        down = { x: e.clientX, y: e.clientY }
        moved = 0
      }
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()]
        pinch = Math.hypot(a.x - b.x, a.y - b.y)
      }
    }
    const onMove = (e: PointerEvent) => {
      const r = rect()
      const px = e.clientX - r.left
      const py = e.clientY - r.top
      const prev = pointers.get(e.pointerId)
      if (prev) {
        pointers.set(e.pointerId, { x: px, y: py })
        if (pointers.size === 1) {
          moved += Math.abs(px - prev.x) + Math.abs(py - prev.y)
          L.target.tx += px - prev.x
          L.target.ty += py - prev.y
          L.view.tx = L.target.tx
          L.view.ty = L.target.ty
          L.dirty = true
        } else if (pointers.size === 2) {
          const [a, b] = [...pointers.values()]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (pinch > 0) {
            const f = dist / pinch
            const ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, L.target.scale * f))
            const real = ns / L.target.scale
            L.target.scale = ns
            L.target.tx *= real
            L.target.ty *= real
            L.view.scale = L.target.scale
            L.view.tx = L.target.tx
            L.view.ty = L.target.ty
            L.dirty = true
          }
          pinch = dist
          moved += 10
        }
      } else if (e.pointerType === 'mouse') {
        const h = hit(px, py)
        const id = h?.id ?? null
        if (id !== L.hoverId) {
          L.hoverId = id
          L.dirty = true
          setHover(h ? { id: h.id, x: px, y: py } : null)
        } else if (h) setHover({ id: h.id, x: px, y: py })
        canvas.style.cursor = h ? 'pointer' : 'grab'
      }
    }
    const onUp = (e: PointerEvent) => {
      const r = rect()
      const wasSingle = pointers.size === 1
      pointers.delete(e.pointerId)
      if (pointers.size < 2) pinch = 0
      if (wasSingle && down && moved < 6) {
        const h = hit(e.clientX - r.left, e.clientY - r.top)
        onSelectRef.current(h)
        if (h && e.pointerType !== 'mouse') setHover(null)
      }
      if (pointers.size === 0) down = null
    }
    const onLeave = () => {
      L.hoverId = null
      L.dirty = true
      setHover(null)
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const r = rect()
      const px = e.clientX - r.left - L.size.w / 2
      const py = e.clientY - r.top - L.size.h / 2
      const f = Math.exp(-e.deltaY * 0.0015)
      const ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, L.target.scale * f))
      const real = ns / L.target.scale
      L.target.tx = px - (px - L.target.tx) * real
      L.target.ty = py - (py - L.target.ty) * real
      L.target.scale = ns
      L.dirty = true
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [interactive])

  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // Keyboard: arrows cycle through lights, +/- zoom, 0 resets.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const L = live.current
    const visible = L.sorted.filter((p) => !L.filter || p.color === L.filter)
    if (e.key === '+' || e.key === '=') return zoomBy(1.3)
    if (e.key === '-') return zoomBy(1 / 1.3)
    if (e.key === '0') {
      L.target = fitView()
      L.dirty = true
      return
    }
    if (e.key === 'Escape') return onSelect(null)
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && visible.length) {
      e.preventDefault()
      const idx = visible.findIndex((p) => p.id === L.selectedId)
      const next = e.key === 'ArrowRight' ? (idx + 1) % visible.length : (idx - 1 + visible.length) % visible.length
      const p = visible[next < 0 ? 0 : next]
      onSelect(p)
      const s = seat(L.sorted.indexOf(p))
      L.target.tx = -s.x * L.target.scale
      L.target.ty = -s.y * L.target.scale
      L.dirty = true
    }
  }

  const hovered = hover ? sorted.find((p) => p.id === hover.id) : null

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className ?? ''}`}>
      <canvas
        ref={canvasRef}
        tabIndex={interactive ? 0 : -1}
        role="img"
        aria-label={`${ariaLabel}. Use left and right arrow keys to move between lights, plus and minus to zoom.`}
        onKeyDown={interactive ? onKeyDown : undefined}
        className="block h-full w-full cursor-grab touch-none rounded-[inherit] active:cursor-grabbing"
      />
      {hovered && hover && (
        <div
          className="pointer-events-none absolute z-10 max-w-[15rem] rounded-xl border border-gold-400/30 bg-night-950/95 px-3 py-2 text-xs shadow-xl"
          style={{ left: Math.min(hover.x + 14, Math.max(0, (wrapRef.current?.clientWidth ?? 300) - 245)), top: Math.max(8, hover.y - 12) }}
        >
          <p className="font-semibold text-gold-300">{hovered.illustrative ? 'Illustrative light' : hovered.name}</p>
          <p className="mt-0.5 line-clamp-3 text-ink-300">{hovered.wish}</p>
        </div>
      )}
    </div>
  )
})
