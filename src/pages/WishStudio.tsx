import { useEffect, useRef, useState } from 'react'
import { Copy, Download, Share2, Sparkles, WandSparkles } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useDiyas } from '@/lib/DiyaContext'
import { cleanText } from '@/lib/sanitize'
import { generateOffline, LANGS, RELATIONSHIPS, TONES, type WishInput } from '@/lib/wishes'
import { CARD_THEMES, renderGreetingCard } from '@/lib/cards'
import { downloadCanvas, shareContent } from '@/lib/share'
import type { Lang, Length, Relationship, Tone } from '@/lib/types'

type Source = 'gemini' | 'offline'

async function askGemini(input: WishInput): Promise<string> {
  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), 12_000)
  try {
    const res = await fetch('/api/wish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: ctrl.signal,
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = (await res.json()) as { text?: unknown; source?: unknown }
    if (typeof data.text !== 'string' || data.source !== 'gemini' || data.text.trim().length < 10) throw new Error('bad response')
    return data.text.trim().slice(0, 1200)
  } finally {
    window.clearTimeout(timer)
  }
}

export default function WishStudio() {
  const toast = useToast()
  const { bump } = useDiyas()
  const [sender, setSender] = useState('')
  const [recipient, setRecipient] = useState('')
  const [relationship, setRelationship] = useState<Relationship>('friend')
  const [lang, setLang] = useState<Lang>('en')
  const [tone, setTone] = useState<Tone>('heartwarming')
  const [length, setLength] = useState<Length>('medium')
  const [tryAI, setTryAI] = useState(true)
  const [text, setText] = useState('')
  const [source, setSource] = useState<Source | null>(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [themeIdx, setThemeIdx] = useState(0)
  const variation = useRef(0)
  const cardRef = useRef<HTMLCanvasElement>(null)

  // Re-draw the card as the (editable) text or theme changes.
  useEffect(() => {
    if (!text || !cardRef.current) return
    const canvas = cardRef.current
    const id = window.setTimeout(() => {
      renderGreetingCard(canvas, text, lang, CARD_THEMES[themeIdx]).catch(() => toast('Could not draw the card preview.', 'error'))
    }, 200)
    return () => window.clearTimeout(id)
  }, [text, lang, themeIdx, toast])

  const generate = async () => {
    const input: WishInput = {
      sender: cleanText(sender, 40),
      recipient: cleanText(recipient, 40),
      relationship,
      lang,
      tone,
      length,
    }
    setLoading(true)
    setNote('')
    variation.current += 1
    try {
      if (tryAI) {
        try {
          const t = await askGemini(input)
          setText(t)
          setSource('gemini')
          bump('wishesGenerated')
          return
        } catch {
          setNote('Gemini isn’t available on this deployment right now, so the built-in offline generator wrote this greeting.')
        }
      }
      setText(generateOffline(input, variation.current))
      setSource('offline')
      bump('wishesGenerated')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast('Greeting copied.', 'success')
    } catch {
      toast('Could not copy. Select the text and copy it manually.', 'error')
    }
  }

  const download = async () => {
    if (!cardRef.current) return
    await renderGreetingCard(cardRef.current, text, lang, CARD_THEMES[themeIdx])
    const ok = await downloadCanvas(cardRef.current, 'diyaverse-greeting.png')
    toast(ok ? 'Card downloaded.' : 'Could not create the image.', ok ? 'success' : 'error')
  }

  const share = async () => {
    const out = await shareContent({ title: 'Diwali greeting', text, canvas: cardRef.current, filename: 'diyaverse-greeting.png' })
    if (out === 'copied') toast('Sharing isn’t supported here, so the greeting was copied instead.', 'success')
    else if (out === 'failed') toast('Could not share or copy. Try downloading the card.', 'error')
  }

  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${active ? 'border-gold-400 bg-gold-400/15 text-gold-300' : 'border-ink-400/30 text-ink-300 hover:border-gold-400/50'}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-5xl font-bold gold-text">Wish Studio</h1>
        <p className="mt-2 text-ink-300">Create a personal Diwali greeting in English, Hindi or Bengali, edit it freely, and turn it into a card.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          className="panel space-y-5 p-5 md:p-6"
          onSubmit={(e) => {
            e.preventDefault()
            void generate()
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="lbl" htmlFor="sender">
                Your name
              </label>
              <input id="sender" className="field" value={sender} maxLength={40} onChange={(e) => setSender(e.target.value)} placeholder="From" />
            </div>
            <div>
              <label className="lbl" htmlFor="recipient">
                Recipient’s name
              </label>
              <input id="recipient" className="field" value={recipient} maxLength={40} onChange={(e) => setRecipient(e.target.value)} placeholder="To" />
            </div>
          </div>

          <div>
            <label className="lbl" htmlFor="rel">
              Relationship
            </label>
            <select id="rel" className="field" value={relationship} onChange={(e) => setRelationship(e.target.value as Relationship)}>
              {RELATIONSHIPS.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="lbl">Language</legend>
            <div className="flex flex-wrap gap-2">
              {LANGS.map((l) => (
                <button type="button" key={l.key} aria-pressed={lang === l.key} className={pill(lang === l.key)} onClick={() => setLang(l.key)}>
                  {l.native}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="lbl">Tone</legend>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button type="button" key={t.key} aria-pressed={tone === t.key} className={pill(tone === t.key)} onClick={() => setTone(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="lbl">Length</legend>
            <div className="flex gap-2">
              {(['short', 'medium', 'long'] as Length[]).map((l) => (
                <button type="button" key={l} aria-pressed={length === l} className={`${pill(length === l)} capitalize`} onClick={() => setLength(l)}>
                  {l}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="flex items-start gap-2 text-sm text-ink-300">
            <input type="checkbox" className="mt-1 accent-amber-500" checked={tryAI} onChange={(e) => setTryAI(e.target.checked)} />
            <span>
              Try Gemini AI first. If it isn’t set up on this site (or fails), the built-in offline generator is used, and the result is always labelled honestly.
            </span>
          </label>

          <button type="submit" className="btn-gold w-full text-lg" disabled={loading}>
            <WandSparkles size={20} /> {loading ? 'Writing your greeting…' : text ? 'Regenerate greeting' : 'Generate greeting'}
          </button>
        </form>

        <div className="space-y-4">
          {!text ? (
            <div className="panel grid min-h-[20rem] place-items-center p-8 text-center text-ink-300">
              <div>
                <Sparkles className="mx-auto mb-3 text-gold-400" />
                <p className="font-display text-2xl text-ink-100">Your greeting will appear here</p>
                <p className="mt-1 text-sm">Fill in the details and press Generate.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="panel space-y-3 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="lbl !mb-0" htmlFor="out">
                    Edit your greeting
                  </label>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs ${source === 'gemini' ? 'border-emerald-400/50 text-emerald-200' : 'border-ink-400/40 text-ink-300'}`}
                  >
                    {source === 'gemini' ? 'Written by Gemini' : 'Written by offline generator (no AI)'}
                  </span>
                </div>
                <textarea id="out" rows={9} className="field" value={text} maxLength={1200} onChange={(e) => setText(e.target.value)} />
                {note && <p className="text-xs text-ink-400">{note}</p>}
                <div className="flex flex-wrap gap-2">
                  <button className="btn-ghost" onClick={copy}>
                    <Copy size={16} /> Copy
                  </button>
                  <button className="btn-ghost" onClick={share}>
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>

              <div className="panel space-y-3 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink-100">Greeting card</p>
                  <div className="flex gap-1.5" role="group" aria-label="Card theme">
                    {CARD_THEMES.map((t, i) => (
                      <button key={t.key} aria-pressed={themeIdx === i} className={pill(themeIdx === i)} onClick={() => setThemeIdx(i)}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <canvas ref={cardRef} className="mx-auto h-auto w-full max-w-sm rounded-xl border border-gold-400/20" aria-label="Preview of your greeting card" />
                <button className="btn-gold w-full" onClick={download}>
                  <Download size={16} /> Download card as PNG
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
