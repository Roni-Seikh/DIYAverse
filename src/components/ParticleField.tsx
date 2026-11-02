import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion'

export interface ParticleHandle {
  burst: (x: number, y: number, color: string, count?: number) => void
}

interface P {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  color: string
  drift: boolean
}

interface Props {
  /** Continuous floating embers. */
  ambient?: boolean
  color?: string
  className?: string
}

/**
 * Lightweight canvas particle system. It pauses when the tab is hidden, and
 * ambient embers are disabled for users who prefer reduced motion.
 */
export const ParticleField = forwardRef<ParticleHandle, Props>(function ParticleField(
  { ambient = false, color = '#ffc95c', className },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const parts = useRef<P[]>([])
  const reduced = usePrefersReducedMotion()
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced

  useImperativeHandle(ref, () => ({
    burst(x, y, c, count = 70) {
      const n = reducedRef.current ? Math.min(count, 16) : count
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const s = 0.6 + Math.random() * 3.4
        parts.current.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 0.6,
          life: 0,
          max: 50 + Math.random() * 50,
          size: 1 + Math.random() * 2.6,
          color: c,
          drift: false,
        })
      }
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const spawnAmbient = () => {
      parts.current.push({
        x: Math.random() * w,
        y: h + 10,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.25 + Math.random() * 0.6),
        life: 0,
        max: 260 + Math.random() * 220,
        size: 0.8 + Math.random() * 1.8,
        color,
        drift: true,
      })
    }

    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (document.hidden) return
      ctx.clearRect(0, 0, w, h)
      if (ambient && !reducedRef.current && parts.current.length < 90 && Math.random() < 0.35) spawnAmbient()
      const list = parts.current
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i]
        p.life++
        if (p.life > p.max) {
          list.splice(i, 1)
          continue
        }
        p.x += p.vx
        p.y += p.vy
        if (p.drift) p.vx += (Math.random() - 0.5) * 0.02
        else {
          p.vy += 0.035
          p.vx *= 0.985
        }
        const t = p.life / p.max
        const alpha = p.drift ? Math.sin(Math.PI * t) * 0.8 : 1 - t
        ctx.globalAlpha = Math.max(0, alpha)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [ambient, color])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
})
