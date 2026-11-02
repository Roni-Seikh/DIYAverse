export const SIZE = 800
const C = SIZE / 2

export type Motif = 'dot' | 'petal' | 'leaf' | 'star' | 'diya' | 'lotus'
export type Pt = [number, number]

interface Base {
  color: string
  size: number
  sym: number
  mirror: boolean
}
export interface FreeStroke extends Base {
  kind: 'free'
  pts: Pt[]
}
export interface StampStroke extends Base {
  kind: 'stamp'
  motif: Motif
  pts: Pt[]
}
export type Stroke = FreeStroke | StampStroke

export const MOTIFS: { key: Motif; label: string }[] = [
  { key: 'dot', label: 'Dot' },
  { key: 'petal', label: 'Petal' },
  { key: 'leaf', label: 'Leaf' },
  { key: 'star', label: 'Star' },
  { key: 'diya', label: 'Diya' },
  { key: 'lotus', label: 'Lotus' },
]

/** Runs `fn` once per rotational copy (and mirrored copy) around the canvas centre. */
function copies(ctx: CanvasRenderingContext2D, sym: number, mirror: boolean, fn: () => void) {
  for (let k = 0; k < sym; k++) {
    for (const m of mirror ? [1, -1] : [1]) {
      ctx.save()
      ctx.translate(C, C)
      ctx.scale(m, 1)
      ctx.rotate((k / sym) * Math.PI * 2)
      fn()
      ctx.restore()
    }
  }
}

function setStyle(ctx: CanvasRenderingContext2D, s: Base) {
  ctx.strokeStyle = s.color
  ctx.fillStyle = s.color
  ctx.lineWidth = s.size
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.shadowColor = s.color
  ctx.shadowBlur = Math.min(12, s.size * 1.2)
}

export function drawSegment(ctx: CanvasRenderingContext2D, s: FreeStroke, a: Pt, b: Pt) {
  setStyle(ctx, s)
  copies(ctx, s.sym, s.mirror, () => {
    ctx.beginPath()
    ctx.moveTo(a[0], a[1])
    ctx.lineTo(b[0], b[1])
    ctx.stroke()
  })
}

function drawDot(ctx: CanvasRenderingContext2D, s: FreeStroke) {
  setStyle(ctx, s)
  copies(ctx, s.sym, s.mirror, () => {
    ctx.beginPath()
    ctx.arc(s.pts[0][0], s.pts[0][1], s.size / 2, 0, Math.PI * 2)
    ctx.fill()
  })
}

function motifPath(ctx: CanvasRenderingContext2D, m: Motif, r: number) {
  ctx.beginPath()
  switch (m) {
    case 'dot':
      ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2)
      break
    case 'petal':
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(r * 0.8, -r * 1.1, r * 2.2, -r * 0.9, r * 2.6, 0)
      ctx.bezierCurveTo(r * 2.2, r * 0.9, r * 0.8, r * 1.1, 0, 0)
      break
    case 'leaf':
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(r * 1.2, -r * 1.0, r * 2.6, 0)
      ctx.quadraticCurveTo(r * 1.2, r * 1.0, 0, 0)
      break
    case 'star': {
      const pts = 8
      for (let i = 0; i < pts * 2; i++) {
        const rad = i % 2 === 0 ? r * 1.2 : r * 0.5
        const a = (i / (pts * 2)) * Math.PI * 2
        ctx[i === 0 ? 'moveTo' : 'lineTo'](Math.cos(a) * rad, Math.sin(a) * rad)
      }
      ctx.closePath()
      break
    }
    case 'diya':
      // bowl facing outward, flame towards the centre-line
      ctx.moveTo(-r * 0.9, -r * 0.2)
      ctx.quadraticCurveTo(0, r * 1.4, r * 0.9, -r * 0.2)
      ctx.closePath()
      ctx.moveTo(0, -r * 0.2)
      ctx.quadraticCurveTo(-r * 0.45, -r * 0.9, 0, -r * 1.5)
      ctx.quadraticCurveTo(r * 0.45, -r * 0.9, 0, -r * 0.2)
      break
    case 'lotus':
      for (const rot of [-0.7, 0, 0.7]) {
        ctx.save()
        ctx.rotate(rot)
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(r * 0.5, -r * 0.7, r * 1.7, -r * 0.6, r * 2, 0)
        ctx.bezierCurveTo(r * 1.7, r * 0.6, r * 0.5, r * 0.7, 0, 0)
        ctx.restore()
      }
      break
  }
}

function drawStamp(ctx: CanvasRenderingContext2D, s: StampStroke) {
  setStyle(ctx, s)
  const r = s.size
  copies(ctx, s.sym, s.mirror, () => {
    for (const [x, y] of s.pts) {
      ctx.save()
      ctx.translate(x, y)
      // Point motifs outward, away from the centre
      ctx.rotate(Math.atan2(y, x) + (s.motif === 'diya' ? Math.PI / 2 : 0))
      motifPath(ctx, s.motif, r)
      ctx.globalAlpha = 0.85
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.lineWidth = Math.max(1, r * 0.08)
      ctx.strokeStyle = '#fff6e2'
      ctx.globalAlpha = 0.35
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.restore()
    }
  })
}

export function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke) {
  ctx.save()
  if (s.kind === 'stamp') drawStamp(ctx, s)
  else if (s.pts.length === 1) drawDot(ctx, s)
  else {
    for (let i = 1; i < s.pts.length; i++) drawSegment(ctx, s, s.pts[i - 1], s.pts[i])
  }
  ctx.restore()
}

export function drawBackground(ctx: CanvasRenderingContext2D, guides: boolean, sym: number, mirror: boolean) {
  const g = ctx.createRadialGradient(C, C, 40, C, C, C * 1.05)
  g.addColorStop(0, '#26164f')
  g.addColorStop(1, '#0b0a24')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, SIZE, SIZE)
  ctx.strokeStyle = 'rgba(255,201,92,0.10)'
  ctx.lineWidth = 1.5
  for (const r of [120, 220, 320]) {
    ctx.beginPath()
    ctx.arc(C, C, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  if (guides) {
    ctx.strokeStyle = 'rgba(166,120,255,0.22)'
    ctx.setLineDash([6, 8])
    for (let k = 0; k < sym; k++) {
      const a = (k / sym) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(C, C)
      ctx.lineTo(C + Math.cos(a) * C, C + Math.sin(a) * C)
      ctx.stroke()
      if (mirror) {
        ctx.beginPath()
        ctx.moveTo(C, C)
        ctx.lineTo(C - Math.cos(a) * C, C + Math.sin(a) * C)
        ctx.stroke()
      }
    }
    ctx.setLineDash([])
  }
}

/* ------------------------------ templates ------------------------------ */

function petal(r0: number, r1: number, w: number, steps = 28): Pt[] {
  const up: Pt[] = []
  const down: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = r0 + (r1 - r0) * t
    const hw = w * Math.pow(Math.sin(Math.PI * t), 0.85)
    up.push([x, -hw])
    down.push([x, hw])
  }
  return [...up, ...down.reverse()]
}

function arc(r: number, a0: number, a1: number, n = 18): Pt[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n
    return [Math.cos(a) * r, Math.sin(a) * r] as Pt
  })
}

const free = (pts: Pt[], color: string, size: number, sym: number, mirror = false): FreeStroke => ({ kind: 'free', pts, color, size, sym, mirror })
const stamp = (motif: Motif, pts: Pt[], color: string, size: number, sym: number, mirror = false): StampStroke => ({ kind: 'stamp', motif, pts, color, size, sym, mirror })

// Template coordinates are relative to the canvas centre (the origin of `copies`).
export const TEMPLATES: { key: string; label: string; build: () => Stroke[] }[] = [
  {
    key: 'lotus',
    label: 'Lotus Bloom',
    build: () => [
      free(petal(40, 250, 62), '#ff4d8d', 4, 8),
      free(petal(40, 190, 38), '#ffc95c', 3, 8),
      free(petal(36, 120, 20), '#fff6e2', 3, 8),
      free(arc(300, -0.18, 0.18, 10), '#3fd6c4', 4, 8),
      stamp('dot', [[330, 0]], '#ffc95c', 12, 16),
      stamp('leaf', [[262, 0]], '#7bd36a', 13, 8, true),
      stamp('star', [[0, 0]], '#ffc95c', 22, 1),
    ],
  },
  {
    key: 'star',
    label: 'Star Mandala',
    build: () => [
      free([[70, 0], [150, 36], [250, 0], [150, -36], [70, 0]], '#ffc95c', 4, 12),
      free([[260, 0], [310, 22], [350, 0], [310, -22], [260, 0]], '#a678ff', 4, 12),
      stamp('dot', [[110, 0], [220, 0]], '#ff6a3d', 9, 12, true),
      free(arc(120, 0, Math.PI / 6, 12), '#3fd6c4', 3, 12),
      stamp('petal', [[365, 0]], '#ff4d8d', 10, 24),
      stamp('star', [[0, 0]], '#fff6e2', 20, 1),
    ],
  },
  {
    key: 'diya',
    label: 'Ring of Diyas',
    build: () => [
      free(arc(160, 0, Math.PI * 2, 72), '#ffc95c', 3, 1),
      free(arc(300, 0, Math.PI * 2, 96), '#ff6a3d', 3, 1),
      stamp('diya', [[230, 0]], '#ffc95c', 26, 8),
      stamp('lotus', [[60, 0]], '#ff4d8d', 24, 8),
      stamp('dot', [[330, 0]], '#fff6e2', 9, 24),
      free(petal(160, 300, 26), '#a678ff', 3, 8),
    ],
  },
  {
    key: 'peacock',
    label: 'Peacock Fan',
    build: () => [
      free(petal(60, 320, 70), '#3fd6c4', 4, 6, true),
      free(petal(90, 250, 42), '#4aa3ff', 4, 6, true),
      stamp('dot', [[210, 0]], '#ffc95c', 22, 6, true),
      stamp('dot', [[210, 0]], '#0b0a24', 10, 6, true),
      stamp('leaf', [[330, 0]], '#7bd36a', 12, 12),
      stamp('star', [[0, 0]], '#ffc95c', 24, 1),
    ],
  },
]
