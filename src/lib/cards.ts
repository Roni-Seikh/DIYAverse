import { diyaSvg } from './diyaSvg'
import { FLAMES } from '@/data/palette'
import type { DiyaDesign, FlameColor, Lang } from './types'

const W = 1080
const H = 1350

export async function svgToImage(svg: string): Promise<HTMLImageElement> {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Could not render the diya image.'))
      img.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function loadFonts() {
  try {
    await Promise.all([
      document.fonts.load('600 64px "Cormorant Garamond"'),
      document.fonts.load('400 34px "Hind"'),
      document.fonts.load('400 34px "Noto Sans Bengali"'),
      document.fonts.load('500 30px "Plus Jakarta Sans"'),
    ])
  } catch {
    /* fall back to system fonts */
  }
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const out: string[] = []
  for (const para of text.split('\n')) {
    if (!para.trim()) {
      out.push('')
      continue
    }
    let line = ''
    for (const word of para.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word
      if (ctx.measureText(test).width > maxWidth && line) {
        out.push(line)
        line = word
      } else line = test
    }
    if (line) out.push(line)
  }
  return out
}

function drawSky(ctx: CanvasRenderingContext2D, c1: string, c2: string, glow: string) {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, c1)
  g.addColorStop(1, c2)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  const r = ctx.createRadialGradient(W / 2, 520, 20, W / 2, 520, 620)
  r.addColorStop(0, glow + '55')
  r.addColorStop(1, glow + '00')
  ctx.fillStyle = r
  ctx.fillRect(0, 0, W, H)
  // deterministic star field
  let s = 12345
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
  for (let i = 0; i < 90; i++) {
    ctx.globalAlpha = 0.2 + rnd() * 0.6
    ctx.fillStyle = '#ffe9b8'
    ctx.beginPath()
    ctx.arc(rnd() * W, rnd() * H, 0.8 + rnd() * 1.8, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawBorder(ctx: CanvasRenderingContext2D, color: string) {
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 3
  ctx.strokeRect(36, 36, W - 72, H - 72)
  ctx.globalAlpha = 0.25
  ctx.strokeRect(52, 52, W - 104, H - 104)
  ctx.globalAlpha = 1
}

function prep(canvas: HTMLCanvasElement) {
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')
  return ctx
}

function fitWrapped(ctx: CanvasRenderingContext2D, text: string, family: string, maxW: number, maxH: number, start: number, min: number) {
  let size = start
  let lines: string[] = []
  while (size >= min) {
    ctx.font = `500 ${size}px ${family}`
    lines = wrapLines(ctx, text, maxW)
    if (lines.length * size * 1.4 <= maxH) break
    size -= 2
  }
  return { size, lines }
}

export async function renderDiyaCard(
  canvas: HTMLCanvasElement,
  d: { name: string; wish: string; design: DiyaDesign; color: FlameColor },
) {
  await loadFonts()
  const ctx = prep(canvas)
  const f = FLAMES[d.color]
  drawSky(ctx, '#0b0a24', '#1a1245', f.glow)
  drawBorder(ctx, '#ffc95c')

  const img = await svgToImage(diyaSvg(d.design, d.color, true))
  ctx.drawImage(img, W / 2 - 300, 190, 600, 600)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffc95c'
  ctx.font = '600 30px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('A DIYA LIT BY', W / 2, 860)
  ctx.fillStyle = '#fff6e2'
  ctx.font = '600 76px "Cormorant Garamond", Georgia, serif'
  ctx.fillText(d.name, W / 2, 940)

  const fam = '"Cormorant Garamond", "Hind", "Noto Sans Bengali", Georgia, serif'
  const { size, lines } = fitWrapped(ctx, `“${d.wish}”`, fam, 820, 240, 50, 28)
  ctx.font = `500 ${size}px ${fam}`
  ctx.fillStyle = '#ffe9b8'
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 1020 + i * size * 1.4))

  ctx.fillStyle = '#b4aad6'
  ctx.font = '500 26px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('DIYAverse  ·  One Light. One Wish. One Connected World.', W / 2, H - 80)
}

export interface CardTheme {
  key: string
  label: string
  c1: string
  c2: string
  accent: string
  glow: string
}

export const CARD_THEMES: CardTheme[] = [
  { key: 'midnight', label: 'Midnight Gold', c1: '#0b0a24', c2: '#1a1245', accent: '#ffc95c', glow: '#ffb12e' },
  { key: 'plum', label: 'Plum Rose', c1: '#1d0a2e', c2: '#3b1457', accent: '#ff9ec4', glow: '#ff4d8d' },
  { key: 'lagoon', label: 'Lagoon Night', c1: '#06182a', c2: '#0b3250', accent: '#8ff0e2', glow: '#3fd6c4' },
]

export async function renderGreetingCard(canvas: HTMLCanvasElement, text: string, lang: Lang, theme: CardTheme) {
  await loadFonts()
  const ctx = prep(canvas)
  drawSky(ctx, theme.c1, theme.c2, theme.glow)
  drawBorder(ctx, theme.accent)

  const colorKey = (Object.keys(FLAMES) as FlameColor[]).find((k) => FLAMES[k].glow === theme.glow) ?? 'gold'
  const img = await svgToImage(diyaSvg('clay', colorKey, true))
  ctx.drawImage(img, W / 2 - 150, 110, 300, 300)

  ctx.textAlign = 'center'
  ctx.fillStyle = theme.accent
  ctx.font = '600 34px "Plus Jakarta Sans", sans-serif'
  const heading = lang === 'hi' ? 'शुभ दीपावली' : lang === 'bn' ? 'শুভ দীপাবলি' : 'Happy Diwali'
  const hf = lang === 'en' ? '"Cormorant Garamond", Georgia, serif' : '"Hind", "Noto Sans Bengali", sans-serif'
  ctx.font = `700 ${lang === 'en' ? 84 : 72}px ${hf}`
  ctx.fillText(heading, W / 2, 500)

  const bodyFam = lang === 'en' ? '"Cormorant Garamond", Georgia, serif' : '"Hind", "Noto Sans Bengali", sans-serif'
  const { size, lines } = fitWrapped(ctx, text, bodyFam, 820, 640, 46, 24)
  ctx.font = `500 ${size}px ${bodyFam}`
  ctx.fillStyle = '#fff6e2'
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 590 + i * size * 1.42))

  ctx.fillStyle = '#b4aad6'
  ctx.font = '500 24px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('Made with DIYAverse', W / 2, H - 80)
}
