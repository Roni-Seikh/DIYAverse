import { useCallback, useEffect, useRef, useState } from 'react'
import { Download, Eraser, Eye, EyeOff, Redo2, Undo2 } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useDiyas } from '@/lib/DiyaContext'
import { RANGOLI_COLORS } from '@/data/palette'
import { downloadCanvas } from '@/lib/share'
import { drawBackground, drawSegment, drawStroke, MOTIFS, SIZE, TEMPLATES, type FreeStroke, type Motif, type Pt, type Stroke, type StampStroke } from '@/lib/rangoli'

const SYMS = [4, 6, 8, 12, 16]
const MAX_HISTORY = 80

interface Hist {
  states: Stroke[][]
  idx: number
}

export default function RangoliStudio() {
  const toast = useToast()
  const { bump } = useDiyas()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const layerRef = useRef<HTMLCanvasElement | null>(null)
  const drawing = useRef<Stroke | null>(null)
  const lastStamp = useRef<Pt | null>(null)

  const [hist, setHist] = useState<Hist>({ states: [[]], idx: 0 })
  const [sym, setSym] = useState(8)
  const [mirror, setMirror] = useState(true)
  const [color, setColor] = useState(RANGOLI_COLORS[0])
  const [size, setSize] = useState(6)
  const [tool, setTool] = useState<'draw' | 'motif'>('draw')
  const [motif, setMotif] = useState<Motif>('petal')
  const [guides, setGuides] = useState(true)

  const strokes = hist.states[hist.idx]

  const composite = useCallback(
    (withGuides: boolean, target?: HTMLCanvasElement) => {
      const canvas = target ?? canvasRef.current
      const layer = layerRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx || !layer) return
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.shadowBlur = 0
      drawBackground(ctx, withGuides, sym, mirror)
      ctx.drawImage(layer, 0, 0)
    },
    [sym, mirror],
  )

  const redrawLayer = useCallback(() => {
    const layer = layerRef.current
    const ctx = layer?.getContext('2d')
    if (!layer || !ctx) return
    ctx.clearRect(0, 0, SIZE, SIZE)
    for (const s of strokes) drawStroke(ctx, s)
  }, [strokes])

  // Create the offscreen layer once.
  useEffect(() => {
    const layer = document.createElement('canvas')
    layer.width = layer.height = SIZE
    layerRef.current = layer
    const c = canvasRef.current
    if (c) c.width = c.height = SIZE
  }, [])

  // Re-render committed strokes whenever history changes (undo, redo, template, clear, commit).
  useEffect(() => {
    redrawLayer()
    composite(guides)
  }, [strokes, redrawLayer, composite, guides])

  const commit = useCallback((next: Stroke[]) => {
    setHist((h) => {
      const states = [...h.states.slice(0, h.idx + 1), next].slice(-MAX_HISTORY)
      return { states, idx: states.length - 1 }
    })
  }, [])

  const undo = useCallback(() => setHist((h) => (h.idx > 0 ? { ...h, idx: h.idx - 1 } : h)), [])
  const redo = useCallback(() => setHist((h) => (h.idx < h.states.length - 1 ? { ...h, idx: h.idx + 1 } : h)), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT') return
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  const toLocal = (e: React.PointerEvent): Pt => {
    const r = canvasRef.current!.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * SIZE - SIZE / 2, ((e.clientY - r.top) / r.height) * SIZE - SIZE / 2]
  }

  const addStampPoint = (s: StampStroke, p: Pt) => {
    const layer = layerRef.current?.getContext('2d')
    s.pts.push(p)
    if (layer) drawStroke(layer, { ...s, pts: [p] })
    lastStamp.current = p
  }

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = toLocal(e)
    if (tool === 'draw') {
      const s: FreeStroke = { kind: 'free', color, size, sym, mirror, pts: [p] }
      drawing.current = s
      const layer = layerRef.current?.getContext('2d')
      if (layer) drawStroke(layer, s)
    } else {
      const s: StampStroke = { kind: 'stamp', motif, color, size: Math.max(6, size * 1.6), sym, mirror, pts: [] }
      drawing.current = s
      addStampPoint(s, p)
    }
    composite(guides)
  }

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = drawing.current
    if (!s) return
    const p = toLocal(e)
    if (s.kind === 'free') {
      const last = s.pts[s.pts.length - 1]
      if (Math.hypot(p[0] - last[0], p[1] - last[1]) < 1.5) return
      s.pts.push(p)
      const layer = layerRef.current?.getContext('2d')
      if (layer) drawSegment(layer, s, last, p)
    } else {
      const last = lastStamp.current
      if (last && Math.hypot(p[0] - last[0], p[1] - last[1]) < s.size * 2.2) return
      addStampPoint(s, p)
    }
    composite(guides)
  }

  const onUp = () => {
    const s = drawing.current
    drawing.current = null
    lastStamp.current = null
    if (s && s.pts.length) commit([...strokes, s])
  }

  const applyTemplate = (key: string) => {
    const t = TEMPLATES.find((x) => x.key === key)
    if (!t) return
    commit(t.build())
    toast(`Loaded “${t.label}”. Keep drawing on top, or undo to go back.`, 'info')
  }

  const download = async () => {
    const out = document.createElement('canvas')
    out.width = out.height = SIZE
    composite(false, out)
    if (strokes.length === 0) {
      toast('Your canvas is empty. Draw something or load a template first.', 'error')
      return
    }
    const ok = await downloadCanvas(out, 'diyaverse-rangoli.png')
    if (ok) {
      bump('rangoliSaved')
      toast('Rangoli downloaded.', 'success')
    } else toast('Could not create the image.', 'error')
  }

  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${active ? 'border-gold-400 bg-gold-400/15 text-gold-300' : 'border-ink-400/30 text-ink-300 hover:border-gold-400/50'}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-5xl font-bold gold-text">Rangoli Studio</h1>
        <p className="mt-2 text-ink-300">Draw anywhere on the canvas and your strokes repeat around the centre. Try a template, then make it yours.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <div className="panel p-2 sm:p-3">
            <canvas
              ref={canvasRef}
              width={SIZE}
              height={SIZE}
              className="mx-auto block aspect-square w-full max-w-[44rem] cursor-crosshair touch-none rounded-xl"
              aria-label="Rangoli drawing canvas. Draw with a mouse, finger or stylus; strokes mirror around the centre."
              role="img"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn-ghost" onClick={undo} disabled={hist.idx === 0} aria-label="Undo">
              <Undo2 size={16} /> Undo
            </button>
            <button className="btn-ghost" onClick={redo} disabled={hist.idx >= hist.states.length - 1} aria-label="Redo">
              <Redo2 size={16} /> Redo
            </button>
            <button className="btn-ghost" onClick={() => strokes.length && commit([])} disabled={strokes.length === 0}>
              <Eraser size={16} /> Clear
            </button>
            <button className="btn-ghost" aria-pressed={guides} onClick={() => setGuides((g) => !g)}>
              {guides ? <Eye size={16} /> : <EyeOff size={16} />} Guides
            </button>
            <button className="btn-gold ml-auto" onClick={download}>
              <Download size={16} /> Download PNG
            </button>
          </div>
        </div>

        <aside className="panel space-y-5 p-5" aria-label="Rangoli tools">
          <fieldset>
            <legend className="lbl">Templates</legend>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((t) => (
                <button key={t.key} className="btn-ghost !rounded-xl !px-2 !py-2 text-sm" onClick={() => applyTemplate(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="lbl">Tool</legend>
            <div className="flex gap-2">
              <button aria-pressed={tool === 'draw'} className={pill(tool === 'draw')} onClick={() => setTool('draw')}>
                Freehand
              </button>
              <button aria-pressed={tool === 'motif'} className={pill(tool === 'motif')} onClick={() => setTool('motif')}>
                Motif stamp
              </button>
            </div>
            {tool === 'motif' && (
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Motif">
                {MOTIFS.map((m) => (
                  <button key={m.key} aria-pressed={motif === m.key} className={pill(motif === m.key)} onClick={() => setMotif(m.key)}>
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend className="lbl">Symmetry</legend>
            <div className="flex flex-wrap gap-2">
              {SYMS.map((n) => (
                <button key={n} aria-pressed={sym === n} className={pill(sym === n)} onClick={() => setSym(n)} aria-label={`${n}-fold symmetry`}>
                  {n}×
                </button>
              ))}
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-ink-300">
              <input type="checkbox" className="accent-amber-500" checked={mirror} onChange={(e) => setMirror(e.target.checked)} />
              Mirror each section
            </label>
          </fieldset>

          <fieldset>
            <legend className="lbl">Colour</legend>
            <div className="flex flex-wrap items-center gap-2">
              {RANGOLI_COLORS.map((c) => (
                <button
                  key={c}
                  aria-label={`Colour ${c}`}
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 ${color === c ? 'scale-110 border-white' : 'border-transparent'}`}
                  style={{ background: c }}
                />
              ))}
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Custom colour" className="h-8 w-8 cursor-pointer rounded-full border-0 bg-transparent p-0" />
            </div>
          </fieldset>

          <div>
            <label className="lbl" htmlFor="brush">
              Brush size · {size}px
            </label>
            <input id="brush" type="range" min={2} max={40} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-amber-500" />
          </div>
        </aside>
      </div>
    </div>
  )
}
