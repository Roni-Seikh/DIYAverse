import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Fullscreen, Minimize, Music, PartyPopper, Volume2, Wind } from 'lucide-react'
import { festivalAudio } from '@/lib/audio'
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion'

interface Rocket { x: number; y: number; vy: number; ty: number; color: string }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number }
interface Lantern { x: number; y: number; s: number; v: number; ph: number; hue: number }

const COLORS = ['#ffc95c', '#ff6a3d', '#ff4d8d', '#a678ff', '#3fd6c4', '#fff6e2', '#4aa3ff']

export default function FestivalNight() {
  const reduced = usePrefersReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fireworks, setFireworks] = useState(true)
  const [lanterns, setLanterns] = useState(true)
  const [auto, setAuto] = useState(false)
  const [sfx, setSfx] = useState(false)
  const [music, setMusic] = useState(false)
  const [ambient, setAmbient] = useState(false)
  const [full, setFull] = useState(false)
  const [started, setStarted] = useState(false)

  const flags = useRef({ fireworks, lanterns, auto, sfx, reduced })
  flags.current = { fireworks, lanterns, auto, sfx, reduced }

  const rockets = useRef<Rocket[]>([])
  const sparks = useRef<Spark[]>([])
  const lant = useRef<Lantern[]>([])
  const size = useRef({ w: 0, h: 0 })

  const launch = useCallback((tx?: number, ty?: number) => {
    const { w, h } = size.current
    if (!w) return
    const x = tx ?? w * (0.15 + Math.random() * 0.7)
    rockets.current.push({
      x: tx !== undefined ? tx + (Math.random() - 0.5) * 30 : x,
      y: h,
      vy: -(8 + Math.random() * 3),
      ty: ty ?? h * (0.12 + Math.random() * 0.4),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })
  }, [])

  const explode = (r: Rocket) => {
    const n = flags.current.reduced ? 28 : 80 + Math.floor(Math.random() * 40)
    const second = COLORS[Math.floor(Math.random() * COLORS.length)]
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const sp = 1.2 + Math.random() * 3.6
      sparks.current.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: 60 + Math.random() * 40, color: i % 3 === 0 ? second : r.color, size: 1.2 + Math.random() * 1.6 })
    }
    if (flags.current.sfx) festivalAudio.boom()
  }

  const celebrate = () => {
    setStarted(true)
    setFireworks(true)
    for (let i = 0; i < 14; i++) window.setTimeout(() => launch(), i * 380)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let dpr = 1
    let nextAuto = 0
    const stars = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random() * 0.75, r: Math.random() * 1.4 + 0.3, p: Math.random() * 6 }))

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = wrap.getBoundingClientRect()
      size.current = { w: r.width, h: r.height }
      canvas.width = Math.floor(r.width * dpr)
      canvas.height = Math.floor(r.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (document.hidden) return
      const { w, h } = size.current
      const f = flags.current
      // sky (with a translucent wash so firework trails fade; full clear when motion is reduced)
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, '#05041a')
      g.addColorStop(0.6, '#150f3a')
      g.addColorStop(1, '#3a1a4a')
      ctx.globalAlpha = f.reduced ? 1 : 0.28
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      ctx.globalAlpha = 1

      for (const s of stars) {
        ctx.globalAlpha = f.reduced ? 0.6 : 0.4 + 0.5 * Math.abs(Math.sin(now / 900 + s.p))
        ctx.fillStyle = '#ffe9b8'
        ctx.beginPath()
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // lanterns (switching them off clears the sky)
      if (!f.lanterns) lant.current.length = 0
      if (f.lanterns) {
        if (lant.current.length < (f.reduced ? 6 : 14) && Math.random() < 0.02) {
          lant.current.push({ x: Math.random() * w, y: h + 40, s: 16 + Math.random() * 16, v: 0.25 + Math.random() * 0.35, ph: Math.random() * 6, hue: 25 + Math.random() * 20 })
        }
      }
      for (let i = lant.current.length - 1; i >= 0; i--) {
        const l = lant.current[i]
        l.y -= f.reduced ? l.v * 0.4 : l.v
        l.x += Math.sin(now / 1500 + l.ph) * (f.reduced ? 0.05 : 0.3)
        if (l.y < -60) {
          lant.current.splice(i, 1)
          continue
        }
        const glow = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.s * 3)
        glow.addColorStop(0, `hsla(${l.hue},100%,65%,.55)`)
        glow.addColorStop(1, `hsla(${l.hue},100%,60%,0)`)
        ctx.fillStyle = glow
        ctx.fillRect(l.x - l.s * 3, l.y - l.s * 3, l.s * 6, l.s * 6)
        ctx.fillStyle = `hsl(${l.hue},95%,58%)`
        ctx.beginPath()
        ctx.roundRect(l.x - l.s * 0.5, l.y - l.s * 0.7, l.s, l.s * 1.4, l.s * 0.3)
        ctx.fill()
        ctx.fillStyle = 'rgba(255,240,200,.85)'
        ctx.beginPath()
        ctx.ellipse(l.x, l.y, l.s * 0.18, l.s * 0.4, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // auto-fireworks
      if (f.auto && f.fireworks && now > nextAuto) {
        launch()
        nextAuto = now + (f.reduced ? 3500 : 1400 + Math.random() * 1400)
      }

      // rockets
      for (let i = rockets.current.length - 1; i >= 0; i--) {
        const r = rockets.current[i]
        r.y += r.vy
        r.vy *= 0.985
        ctx.fillStyle = r.color
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2)
        ctx.fill()
        if (r.y <= r.ty || Math.abs(r.vy) < 1.2) {
          explode(r)
          rockets.current.splice(i, 1)
        }
      }

      // sparks
      for (let i = sparks.current.length - 1; i >= 0; i--) {
        const s = sparks.current[i]
        s.life++
        if (s.life > s.max) {
          sparks.current.splice(i, 1)
          continue
        }
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.045
        s.vx *= 0.985
        const t = s.life / s.max
        ctx.globalAlpha = 1 - t
        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * (1 - t * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [launch])

  // Audio toggles
  useEffect(() => {
    if (music) festivalAudio.startMusic()
    else festivalAudio.stopMusic()
  }, [music])
  useEffect(() => {
    if (ambient) festivalAudio.startAmbient()
    else festivalAudio.stopAmbient()
  }, [ambient])
  useEffect(() => () => festivalAudio.stopAll(), [])

  // Fullscreen
  useEffect(() => {
    const on = () => setFull(document.fullscreenElement === wrapRef.current)
    document.addEventListener('fullscreenchange', on)
    return () => document.removeEventListener('fullscreenchange', on)
  }, [])
  const canFullscreen = typeof document !== 'undefined' && !!document.documentElement.requestFullscreen
  const toggleFull = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await wrapRef.current?.requestFullscreen()
    } catch {
      /* user denied or unsupported */
    }
  }

  const onPointer = (e: React.PointerEvent) => {
    if (!flags.current.fireworks) return
    if ((e.target as HTMLElement).closest('[data-controls]')) return
    setStarted(true)
    const r = wrapRef.current!.getBoundingClientRect()
    launch(e.clientX - r.left, e.clientY - r.top)
  }

  const tog = (on: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${on ? 'border-gold-400 bg-gold-400/20 text-gold-300' : 'border-ink-400/30 bg-night-950/60 text-ink-300 hover:border-gold-400/50'}`

  return (
    <div ref={wrapRef} className="relative h-screen w-full overflow-hidden bg-night-950" onPointerDown={onPointer}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-manipulation" aria-label="Festival night sky. Tap anywhere to launch a firework." role="img" />

      <div data-controls className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center gap-2 bg-gradient-to-b from-night-950/90 to-transparent p-3">
        <Link to="/" className="btn-ghost !px-3 !py-1.5 text-xs">
          <ArrowLeft size={14} /> Exit
        </Link>
        <button className="btn-gold !px-4 !py-1.5 text-sm" onClick={celebrate}>
          <PartyPopper size={16} /> Celebrate
        </button>
        <button className={tog(fireworks)} aria-pressed={fireworks} onClick={() => setFireworks((v) => !v)}>
          Fireworks
        </button>
        <button className={tog(auto)} aria-pressed={auto} onClick={() => { setAuto((v) => !v); setStarted(true) }}>
          Auto show
        </button>
        <button className={tog(lanterns)} aria-pressed={lanterns} onClick={() => setLanterns((v) => !v)}>
          Lanterns
        </button>
        <button className={tog(sfx)} aria-pressed={sfx} onClick={() => setSfx((v) => !v)}>
          <Volume2 size={14} /> Effects sound
        </button>
        <button className={tog(music)} aria-pressed={music} onClick={() => setMusic((v) => !v)}>
          <Music size={14} /> Music
        </button>
        <button className={tog(ambient)} aria-pressed={ambient} onClick={() => setAmbient((v) => !v)}>
          <Wind size={14} /> Ambience
        </button>
        {canFullscreen && (
          <button className={`${tog(full)} ml-auto`} aria-pressed={full} onClick={toggleFull}>
            {full ? <Minimize size={14} /> : <Fullscreen size={14} />} {full ? 'Exit full screen' : 'Full screen'}
          </button>
        )}
      </div>

      {!started && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 text-center">
          <p className="font-display text-3xl text-ink-100 sm:text-4xl">Tap the sky, or press Celebrate</p>
          <p className="mt-1 text-sm text-ink-400">
            {reduced ? 'Reduced motion is on, so effects are gentler.' : 'Sound is off by default. Use the toggles above.'} All audio is synthesised in your browser.
          </p>
        </div>
      )}
    </div>
  )
}
