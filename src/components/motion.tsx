import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { useEffects } from '@/lib/EffectsContext'
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion'

/** Fades and lifts content in as it scrolls into view. Renders plainly for reduced-motion users. */
export function Reveal({ children, delay = 0, className, y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduced = usePrefersReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Counts up to `value` once visible. */
export function CountUp({ value, duration = 1200 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduced = usePrefersReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduced || value === 0) {
      setN(value)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration, reduced])
  return <span ref={ref}>{n}</span>
}

/**
 * A card that tilts toward the pointer with a moving highlight.
 * Mouse only, and disabled when effects are off or reduced motion is requested.
 */
export function TiltCard({ children, className = '', max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { effects } = useEffects()

  const move = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || !effects || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${(px - 0.5) * 2 * max}deg`)
    el.style.setProperty('--rx', `${-(py - 0.5) * 2 * max}deg`)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
      <span className="tilt-glare" aria-hidden="true" />
    </div>
  )
}

const BULB_COLORS = ['#ffc95c', '#ff6a3d', '#ff4d8d', '#3fd6c4', '#a678ff']

/** Hanging festival lights (a toran of bulbs) drawn in SVG, twinkling in sequence. */
export function StringLights({ className = '' }: { className?: string }) {
  const { effects } = useEffects()
  const W = 1200
  const seg = 200
  const sags = Math.round(W / seg)
  const bulbs: { x: number; y: number; c: string; i: number }[] = []
  let d = 'M0 4'
  let idx = 0
  for (let s = 0; s < sags; s++) {
    const x0 = s * seg
    const x1 = x0 + seg
    const cx = x0 + seg / 2
    d += ` Q${cx} 52 ${x1} 4`
    for (const t of [0.18, 0.39, 0.61, 0.82]) {
      const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t ** 2 * x1
      const y = (1 - t) ** 2 * 4 + 2 * (1 - t) * t * 52 + t ** 2 * 4
      bulbs.push({ x, y, c: BULB_COLORS[idx % BULB_COLORS.length], i: idx })
      idx++
    }
  }
  return (
    <svg className={`pointer-events-none absolute inset-x-0 top-0 h-20 w-full sm:h-24 ${className}`} viewBox={`0 0 ${W} 74`} preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <path d={d} fill="none" stroke="#8a5a14" strokeWidth="1.6" />
      {bulbs.map((b) => (
        <g key={b.i} className={effects ? 'bulb' : ''} style={{ animationDelay: `${(b.i % 10) * 0.28}s`, color: b.c }}>
          <line x1={b.x} y1={b.y} x2={b.x} y2={b.y + 5} stroke="#8a5a14" strokeWidth="1.4" />
          <circle cx={b.x} cy={b.y + 9} r="9" fill={b.c} opacity="0.18" />
          <circle cx={b.x} cy={b.y + 9} r="4.2" fill={b.c} />
          <circle cx={b.x - 1.2} cy={b.y + 7.8} r="1.3" fill="#fff" opacity="0.8" />
        </g>
      ))}
    </svg>
  )
}

const PETALS = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  size: 10 + ((i * 7) % 12),
  dur: 12 + ((i * 5) % 11),
  delay: -((i * 3.7) % 14),
  hue: i % 3 === 0 ? '#ff9a1f' : i % 3 === 1 ? '#ffc95c' : '#ff6a3d',
}))

/** Falling marigold petals. Hidden entirely when effects are off. */
export function Petals({ className = '' }: { className?: string }) {
  const { effects } = useEffects()
  if (!effects) return null
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {PETALS.map((p, i) => (
        <svg key={i} className="petal" style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.4, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} viewBox="0 0 20 28">
          <path d="M10 1 C17 8 19 17 10 27 C1 17 3 8 10 1Z" fill={p.hue} opacity="0.85" />
          <path d="M10 5 C12 11 12 18 10 24" stroke="#fff3c4" strokeWidth="1" fill="none" opacity="0.5" />
        </svg>
      ))}
    </div>
  )
}

/** A trail of golden sparks that follows the mouse. Skips touch, reduced motion and the Festival Night page. */
export function SparkleTrail({ disabled }: { disabled?: boolean }) {
  const { effects } = useEffects()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!effects || disabled) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    type S = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: string }
    const sparks: S[] = []
    let raf = 0
    let running = false
    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.life++
        if (s.life > s.max) {
          sparks.splice(i, 1)
          continue
        }
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.03
        const t = s.life / s.max
        ctx.globalAlpha = (1 - t) * 0.9
        ctx.fillStyle = s.c
        ctx.shadowColor = s.c
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * (1 - t * 0.6), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      if (sparks.length) raf = requestAnimationFrame(loop)
      else {
        running = false
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      }
    }

    let last = 0
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const now = performance.now()
      if (now - last < 24) return
      last = now
      for (let i = 0; i < 2; i++) {
        sparks.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.1,
          vy: Math.random() * -0.9,
          life: 0,
          max: 26 + Math.random() * 20,
          r: 1 + Math.random() * 1.8,
          c: ['#ffe08a', '#ffc95c', '#ff9a1f', '#fff6e2'][Math.floor(Math.random() * 4)],
        })
      }
      if (sparks.length > 140) sparks.splice(0, sparks.length - 140)
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [effects, disabled])

  if (!effects || disabled) return null
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[70] h-screen w-screen" aria-hidden="true" />
}
