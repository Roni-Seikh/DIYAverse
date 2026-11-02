import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Flame, Globe2, Share2, Trash2, Volume2, VolumeX } from 'lucide-react'
import { Diya } from '@/components/Diya'
import { ParticleField, type ParticleHandle } from '@/components/ParticleField'
import { useToast } from '@/components/Toast'
import { useDiyas } from '@/lib/DiyaContext'
import { DESIGNS, FLAMES, FLAME_KEYS } from '@/data/palette'
import { cleanText, LIMITS, validateEntry } from '@/lib/sanitize'
import { festivalAudio } from '@/lib/audio'
import { renderDiyaCard } from '@/lib/cards'
import { downloadCanvas, shareContent } from '@/lib/share'
import type { Diya as DiyaT, DiyaDesign, FlameColor } from '@/lib/types'

export default function LightDiya() {
  const toast = useToast()
  const { lightDiya, mine, removeMine, submitToWall, status } = useDiyas()
  const [design, setDesign] = useState<DiyaDesign>('clay')
  const [color, setColor] = useState<FlameColor>('gold')
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [region, setRegion] = useState('')
  const [errors, setErrors] = useState<Partial<Record<'name' | 'wish' | 'region', string>>>({})
  const [current, setCurrent] = useState<DiyaT | null>(null)
  const [sound, setSound] = useState(false)
  const [busy, setBusy] = useState(false)
  const [sharedIds, setSharedIds] = useState<Set<string>>(new Set())
  const stageRef = useRef<HTMLDivElement>(null)
  const particles = useRef<ParticleHandle>(null)
  const cardRef = useRef<HTMLCanvasElement>(null)

  const lit = current !== null
  const showDesign = current?.design ?? design
  const showColor = current?.color ?? color

  // Draw the shareable card whenever a diya is on show.
  useEffect(() => {
    if (!current || !cardRef.current) return
    let cancelled = false
    renderDiyaCard(cardRef.current, current).catch(() => {
      if (!cancelled) toast('Could not draw the share card. You can still keep your diya.', 'error')
    })
    return () => {
      cancelled = true
    }
  }, [current, toast])

  const light = (e: React.FormEvent) => {
    e.preventDefault()
    const n = cleanText(name, LIMITS.name)
    const w = cleanText(wish, LIMITS.wish)
    const r = cleanText(region, LIMITS.region)
    const check = validateEntry(n, w, r)
    setErrors(check.errors)
    if (!check.ok) return
    const saved = lightDiya({ name: n, wish: w, design, color, region: r || undefined })
    setCurrent(saved)
    const rect = stageRef.current?.getBoundingClientRect()
    if (rect) particles.current?.burst(rect.width / 2, rect.height * 0.45, FLAMES[color].main, 120)
    if (sound) festivalAudio.chime()
    toast('Your diya is lit and saved on this device.', 'success')
  }

  const another = () => {
    setCurrent(null)
    setWish('')
    setErrors({})
  }

  const download = async () => {
    if (!cardRef.current) return
    const ok = await downloadCanvas(cardRef.current, 'diyaverse-my-diya.png')
    toast(ok ? 'Card downloaded.' : 'Could not create the image.', ok ? 'success' : 'error')
  }

  const share = async () => {
    if (!current) return
    const out = await shareContent({
      title: 'My DIYAverse diya',
      text: `I lit a diya on DIYAverse: “${current.wish}” — One Light. One Wish. One Connected World.`,
      canvas: cardRef.current,
      filename: 'diyaverse-my-diya.png',
    })
    if (out === 'copied') toast('Sharing isn’t supported here, so the text was copied instead.', 'success')
    else if (out === 'failed') toast('Could not share or copy. Try downloading the card.', 'error')
  }

  const addToWall = useCallback(
    async (d: DiyaT) => {
      setBusy(true)
      const res = await submitToWall({ name: d.name, wish: d.wish, design: d.design, color: d.color, region: d.region })
      setBusy(false)
      if (res.ok) {
        setSharedIds((s) => new Set(s).add(d.id))
        toast(
          res.where === 'cloud'
            ? 'Added to the shared World of Lights.'
            : 'Added to the wall in local demo mode. Only visible in this browser.',
          'success',
        )
      } else toast(res.error ?? 'Could not add your light.', 'error')
    },
    [submitToWall, toast],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-5xl font-bold gold-text">Light Your Diya</h1>
        <p className="mt-2 text-ink-300">Pick a diya, add your name and a wish, then light it. It is saved in your personal collection on this device.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* STAGE */}
        <div className="space-y-4">
          <div ref={stageRef} className="panel relative grid min-h-[22rem] place-items-center overflow-hidden p-6">
            <ParticleField ref={particles} className="pointer-events-none absolute inset-0 h-full w-full" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night-950/70 to-transparent" />
            <Diya design={showDesign} color={showColor} lit={lit} className="relative w-64 sm:w-72" />
            {lit && current && (
              <div className="relative mt-2 max-w-sm text-center">
                <p className="text-xs uppercase tracking-widest text-gold-300">Lit by {current.name}</p>
                <p className="font-display mt-1 text-2xl text-ink-100">“{current.wish}”</p>
              </div>
            )}
            <button
              type="button"
              className="btn-ghost absolute right-3 top-3 !px-3 !py-2 text-xs"
              aria-pressed={sound}
              onClick={() => {
                setSound((s) => !s)
                if (!sound) festivalAudio.chime()
              }}
            >
              {sound ? <Volume2 size={16} /> : <VolumeX size={16} />} Sound {sound ? 'on' : 'off'}
            </button>
          </div>

          {lit && current && (
            <div className="panel space-y-4 p-4">
              <p className="text-sm font-semibold text-ink-100">Your shareable card</p>
              <canvas ref={cardRef} className="mx-auto h-auto w-full max-w-xs rounded-xl border border-gold-400/20" aria-label="Preview of your diya card" />
              <div className="flex flex-wrap gap-2">
                <button className="btn-gold" onClick={download}>
                  <Download size={16} /> Download PNG
                </button>
                <button className="btn-ghost" onClick={share}>
                  <Share2 size={16} /> Share
                </button>
                <button className="btn-ghost" disabled={busy || sharedIds.has(current.id)} onClick={() => addToWall(current)}>
                  <Globe2 size={16} /> {sharedIds.has(current.id) ? 'Added to wall' : status === 'connected' ? 'Add to World of Lights' : 'Add to local wall'}
                </button>
                <button className="btn-ghost" onClick={another}>
                  <Flame size={16} /> Light another
                </button>
              </div>
              {status !== 'connected' && (
                <p className="text-xs text-ink-400">Local demo mode: your light will only appear in this browser, not for other visitors.</p>
              )}
            </div>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={light} className="panel space-y-5 p-5 md:p-6" noValidate>
          <fieldset>
            <legend className="lbl">1 · Choose a diya</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DESIGNS.map((d) => (
                <button
                  type="button"
                  key={d.key}
                  aria-pressed={design === d.key}
                  disabled={lit}
                  title={d.blurb}
                  onClick={() => setDesign(d.key)}
                  className={`rounded-xl border p-2 text-center transition-colors disabled:opacity-50 ${
                    design === d.key ? 'border-gold-400 bg-gold-400/10' : 'border-ink-400/25 hover:border-gold-400/50'
                  }`}
                >
                  <Diya design={d.key} color={color} lit={false} className="mx-auto w-16" />
                  <span className="mt-1 block text-xs text-ink-300">{d.label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="lbl" htmlFor="name">
              2 · Your name or nickname
            </label>
            <input id="name" className="field" value={name} maxLength={LIMITS.name} disabled={lit} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aarav, or Anonymous" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
            {errors.name && (
              <p id="name-err" className="mt-1 text-sm text-red-300">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="lbl" htmlFor="wish">
              3 · Your wish
            </label>
            <textarea id="wish" rows={3} className="field resize-none" value={wish} maxLength={LIMITS.wish} disabled={lit} onChange={(e) => setWish(e.target.value)} placeholder="May this year bring…" aria-invalid={!!errors.wish} aria-describedby="wish-count wish-err" />
            <div className="mt-1 flex justify-between text-xs">
              <span id="wish-err" className="text-red-300">
                {errors.wish}
              </span>
              <span id="wish-count" className="text-ink-400">
                {wish.length}/{LIMITS.wish}
              </span>
            </div>
          </div>

          <div>
            <label className="lbl" htmlFor="region">
              City or region <span className="normal-case text-ink-400">(optional, shown on the dashboard if you share it)</span>
            </label>
            <input id="region" className="field" value={region} maxLength={LIMITS.region} disabled={lit} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Kolkata" aria-invalid={!!errors.region} />
            {errors.region && <p className="mt-1 text-sm text-red-300">{errors.region}</p>}
          </div>

          <fieldset>
            <legend className="lbl">4 · Flame colour</legend>
            <div className="flex flex-wrap gap-2">
              {FLAME_KEYS.map((k) => (
                <button
                  type="button"
                  key={k}
                  aria-pressed={color === k}
                  aria-label={FLAMES[k].label}
                  title={FLAMES[k].label}
                  disabled={lit}
                  onClick={() => setColor(k)}
                  className={`h-10 w-10 rounded-full border-2 transition-transform disabled:opacity-50 ${color === k ? 'scale-110 border-white' : 'border-transparent'}`}
                  style={{ background: `radial-gradient(circle at 35% 30%, ${FLAMES[k].core}, ${FLAMES[k].main})`, boxShadow: `0 0 14px ${FLAMES[k].main}88` }}
                />
              ))}
            </div>
          </fieldset>

          <button type="submit" className="btn-gold w-full text-lg" disabled={lit}>
            <Flame size={20} /> {lit ? 'Your diya is lit' : 'Light My Diya'}
          </button>
        </form>
      </div>

      {/* COLLECTION */}
      <section className="mt-14" aria-labelledby="coll-h">
        <h2 id="coll-h" className="font-display text-3xl font-semibold text-ink-100">
          Your light collection
        </h2>
        {mine.length === 0 ? (
          <p className="panel mt-4 p-6 text-ink-300">You haven’t lit a diya yet. Your first one will appear here and stays on this device.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {mine.map((d) => (
              <li key={d.id} className="panel flex flex-col p-4">
                <button type="button" className="text-left" onClick={() => { setCurrent(d); window.scrollTo({ top: 0, behavior: 'smooth' }) }} aria-label={`Show diya lit by ${d.name}`}>
                  <Diya design={d.design} color={d.color} lit className="mx-auto w-24" />
                  <p className="mt-2 text-sm font-semibold text-gold-300">{d.name}</p>
                  <p className="line-clamp-3 text-sm text-ink-300">{d.wish}</p>
                </button>
                <div className="mt-3 flex items-center justify-between text-xs text-ink-400">
                  <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                  <button className="inline-flex items-center gap-1 hover:text-red-300" onClick={() => { removeMine(d.id); if (current?.id === d.id) setCurrent(null) }} aria-label={`Delete diya lit by ${d.name}`}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-sm text-ink-400">
          Want to see lights from other people? Visit the <Link className="text-gold-300 underline" to="/world">World of Lights</Link>.
        </p>
      </section>
    </div>
  )
}
