import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Flame, Flower2, Leaf, Lightbulb, MapPin, PawPrint, RotateCcw, ShieldCheck, Trophy, Wind, X } from 'lucide-react'
import { Reveal, TiltCard } from '@/components/motion'
import { Countdown } from '@/components/Countdown'
import { CHECKLIST, DIWALI_DAYS, GREEN_TIPS, QUIZ, TRADITIONS, daysUntil, formatDay } from '@/data/diwali'
import { readJSON, writeJSON } from '@/lib/storage'

const ICONS = { leaf: Leaf, flower: Flower2, bulb: Lightbulb, wind: Wind, shield: ShieldCheck, paw: PawPrint } as const
const CHECK_KEY = 'diyaverse.checklist.v1'
const BEST_KEY = 'diyaverse.quizBest.v1'

function statusFor(iso: string): string {
  const d = daysUntil(iso)
  if (d === 0) return 'Today'
  if (d === 1) return 'Tomorrow'
  if (d > 1) return `In ${d} days`
  return d === -1 ? 'Yesterday' : 'Passed'
}

function Timeline() {
  const initial = useMemo(() => {
    const idx = DIWALI_DAYS.findIndex((d) => daysUntil(d.date) === 0)
    return idx >= 0 ? idx : 2
  }, [])
  const [i, setI] = useState(initial)
  const day = DIWALI_DAYS[i]
  return (
    <section aria-labelledby="days-h">
      <h2 id="days-h" className="font-display text-4xl font-bold text-ink-100">
        The five days of Diwali
      </h2>
      <p className="mt-1 max-w-2xl text-ink-300">Diwali is not one night but a five-day celebration. Pick a day to explore what it means and how people mark it.</p>

      <div className="relative mt-6" role="tablist" aria-label="Days of Diwali">
        <div className="absolute left-[10%] right-[10%] top-5 hidden h-px bg-gold-400/20 sm:block" aria-hidden="true" />
        <div className="grid grid-cols-5 gap-1 sm:gap-3">
          {DIWALI_DAYS.map((d, k) => (
            <button
              key={d.key}
              role="tab"
              id={`tab-${d.key}`}
              aria-selected={i === k}
              aria-controls="day-panel"
              onClick={() => setI(k)}
              className="group relative flex flex-col items-center gap-2 text-center"
            >
              <span
                className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                  i === k ? 'scale-110 border-gold-300 bg-gold-400 text-night-900 shadow-[0_0_24px_rgba(255,201,92,.7)]' : 'border-gold-400/40 bg-night-900 text-gold-300 group-hover:border-gold-300 group-hover:shadow-[0_0_14px_rgba(255,201,92,.4)]'
                }`}
              >
                {d.n}
              </span>
              <span className={`text-[0.7rem] leading-tight sm:text-sm ${i === k ? 'font-semibold text-gold-300' : 'text-ink-300'}`}>{d.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div id="day-panel" role="tabpanel" aria-labelledby={`tab-${day.key}`} className="panel mt-6 overflow-hidden p-5 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={day.key} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 font-semibold text-gold-300">{formatDay(day.date)}</span>
              <span className="rounded-full border border-ink-400/30 px-3 py-1 text-ink-300">{statusFor(day.date)}</span>
            </div>
            <h3 className="font-display mt-3 text-4xl font-bold gold-text">{day.name}</h3>
            <p className="text-sm text-ink-400">{day.alt}</p>
            <p className="font-display mt-3 text-2xl italic text-ink-100">{day.tagline}</p>
            <p className="mt-3 max-w-3xl text-ink-300">{day.meaning}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
              {day.customs.map((c) => (
                <li key={c} className="flex gap-2 rounded-xl bg-white/5 p-3 text-sm text-ink-300">
                  <Flame size={16} className="mt-0.5 shrink-0 text-gold-400" />
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-2 text-xs text-ink-400">Dates follow commonly published 2026 calendars. Exact days and auspicious timings vary by region and panchang, so check with your local calendar or temple.</p>
    </section>
  )
}

function Traditions() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <section aria-labelledby="trad-h">
      <h2 id="trad-h" className="font-display text-4xl font-bold text-ink-100">
        One festival, many stories
      </h2>
      <p className="mt-1 max-w-2xl text-ink-300">Diwali is celebrated differently across India and beyond. Hover, focus or tap a card to turn it over.</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRADITIONS.map((t, k) => (
          <li key={t.key}>
            <Reveal delay={(k % 3) * 0.08}>
              <button
                type="button"
                className="flip block h-64 w-full text-left"
                data-flipped={open === t.key}
                aria-pressed={open === t.key}
                aria-label={`${t.title}, ${t.region}. ${t.back}`}
                onClick={() => setOpen(open === t.key ? null : t.key)}
              >
                <span className="flip-inner block">
                  <span className="flip-face panel flex flex-col justify-between bg-gradient-to-br from-night-700/80 to-night-800/80 p-5">
                    <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-300">
                      <MapPin size={14} /> {t.region}
                    </span>
                    <span>
                      <span className="font-display block text-3xl font-bold text-ink-100">{t.title}</span>
                      <span className="mt-1 block text-ink-300">{t.front}</span>
                    </span>
                    <span className="text-xs text-ink-400">Turn over to read →</span>
                  </span>
                  <span className="flip-back flip-face panel flex items-center overflow-auto border-gold-400/50 bg-gradient-to-br from-plum-600/40 to-night-800 p-5">
                    <span className="text-[0.95rem] leading-relaxed text-ink-100">{t.back}</span>
                  </span>
                </span>
              </button>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Quiz() {
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [best, setBest] = useState(() => readJSON<number>(BEST_KEY, 0))
  const q = QUIZ[idx]

  const choose = (k: number) => {
    if (picked !== null) return
    setPicked(k)
    if (k === q.answer) setScore((s) => s + 1)
  }
  const next = () => {
    if (idx + 1 >= QUIZ.length) {
      setDone(true)
      const final = score
      if (final > best) {
        setBest(final)
        writeJSON(BEST_KEY, final)
      }
    } else {
      setIdx(idx + 1)
      setPicked(null)
    }
  }
  const restart = () => {
    setIdx(0)
    setPicked(null)
    setScore(0)
    setDone(false)
  }

  const verdict = score >= 7 ? 'A true keeper of the flame.' : score >= 5 ? 'Your lamp burns bright.' : score >= 3 ? 'A good start. Explore the days above and try again.' : 'Every diya begins with one spark. Try again!'

  return (
    <section aria-labelledby="quiz-h">
      <h2 id="quiz-h" className="font-display text-4xl font-bold text-ink-100">
        Test your Diwali knowledge
      </h2>
      <div className="panel mt-5 p-5 sm:p-8">
        {done ? (
          <div className="text-center">
            <Trophy className="mx-auto text-gold-400" size={40} />
            <p className="font-display mt-2 text-5xl font-bold gold-text">
              {score} / {QUIZ.length}
            </p>
            <p className="mt-2 text-ink-100">{verdict}</p>
            <p className="mt-1 text-sm text-ink-400">Your best on this device: {Math.max(best, score)} / {QUIZ.length}</p>
            <button className="btn-gold mt-5" onClick={restart}>
              <RotateCcw size={16} /> Play again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between text-xs text-ink-400">
              <span>
                Question {idx + 1} of {QUIZ.length}
              </span>
              <span>Score {score}</span>
            </div>
            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-ember" animate={{ width: `${((idx + (picked !== null ? 1 : 0)) / QUIZ.length) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={idx} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <h3 className="font-display text-2xl text-ink-100 sm:text-3xl">{q.q}</h3>
                <div className="mt-4 grid gap-2 sm:grid-cols-2" role="group" aria-label="Answer options">
                  {q.options.map((o, k) => {
                    const state = picked === null ? 'idle' : k === q.answer ? 'right' : k === picked ? 'wrong' : 'dim'
                    return (
                      <button
                        key={o}
                        onClick={() => choose(k)}
                        disabled={picked !== null}
                        className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition-all ${
                          state === 'idle'
                            ? 'border-ink-400/30 text-ink-100 hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-400/10'
                            : state === 'right'
                              ? 'border-emerald-400 bg-emerald-500/15 text-emerald-100'
                              : state === 'wrong'
                                ? 'border-red-400 bg-red-500/15 text-red-100'
                                : 'border-ink-400/15 text-ink-400 opacity-60'
                        }`}
                      >
                        <span>{o}</span>
                        {state === 'right' && <Check size={18} />}
                        {state === 'wrong' && <X size={18} />}
                      </button>
                    )
                  })}
                </div>
                <div aria-live="polite" className="min-h-[4.5rem]">
                  {picked !== null && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/5 p-4">
                      <p className="max-w-xl text-sm text-ink-300">
                        <strong className="text-ink-100">{picked === q.answer ? 'Correct. ' : 'Not quite. '}</strong>
                        {q.why}
                      </p>
                      <button className="btn-gold !py-2" onClick={next}>
                        {idx + 1 >= QUIZ.length ? 'See my score' : 'Next question'}
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  )
}

function Checklist() {
  const [done, setDone] = useState<string[]>(() => readJSON<string[]>(CHECK_KEY, []))
  useEffect(() => {
    writeJSON(CHECK_KEY, done)
  }, [done])
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))
  const pct = Math.round((done.length / CHECKLIST.length) * 100)
  return (
    <section aria-labelledby="chk-h">
      <h2 id="chk-h" className="font-display text-4xl font-bold text-ink-100">
        Your Diwali preparation list
      </h2>
      <p className="mt-1 text-ink-300">A simple checklist saved on this device. Customs vary, so adapt it to your family.</p>
      <div className="panel mt-5 p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Preparation progress">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-ember" animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <span className="w-12 text-right text-sm tabular-nums text-gold-300">{pct}%</span>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {CHECKLIST.map((c) => {
            const on = done.includes(c.id)
            return (
              <li key={c.id}>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${on ? 'border-gold-400/50 bg-gold-400/10' : 'border-ink-400/20 hover:border-gold-400/40'}`}>
                  <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(c.id)} />
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-all ${on ? 'scale-105 border-gold-400 bg-gold-400 text-night-900' : 'border-ink-400/50'}`} aria-hidden="true">
                    {on && <Check size={14} strokeWidth={3} />}
                  </span>
                  <span className={on ? 'text-ink-400 line-through' : 'text-ink-100'}>{c.label}</span>
                </label>
              </li>
            )
          })}
        </ul>
        {pct === 100 && <p className="mt-4 text-center font-display text-2xl text-gold-300">Everything is ready. Shubh Deepavali!</p>}
        {done.length > 0 && (
          <button className="mt-3 text-xs text-ink-400 underline hover:text-ink-100" onClick={() => setDone([])}>
            Reset list
          </button>
        )}
      </div>
    </section>
  )
}

export default function Discover() {
  return (
    <div className="mx-auto max-w-6xl space-y-20 px-4 py-8 md:py-12">
      <header className="relative">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-300">Learn · Celebrate · Prepare</p>
        <h1 className="font-display text-5xl font-bold shimmer-text sm:text-6xl">Discover Diwali</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-300">The stories, the five days, the regional traditions and a few ways to celebrate with care.</p>
        <div className="mt-6">
          <Countdown />
        </div>
      </header>

      <Reveal>
        <Timeline />
      </Reveal>
      <Traditions />
      <Reveal>
        <Quiz />
      </Reveal>
      <Reveal>
        <Checklist />
      </Reveal>

      <section aria-labelledby="green-h">
        <Reveal>
          <h2 id="green-h" className="font-display text-4xl font-bold text-ink-100">
            Celebrate with care
          </h2>
          <p className="mt-1 max-w-2xl text-ink-300">Small choices that keep the festival bright, safe and kind to people, animals and the air.</p>
        </Reveal>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GREEN_TIPS.map((t, k) => {
            const Icon = ICONS[t.icon as keyof typeof ICONS]
            return (
              <li key={t.title}>
                <Reveal delay={(k % 3) * 0.08}>
                  <TiltCard className="panel h-full p-5">
                    <Icon className="text-gold-400" />
                    <h3 className="font-display mt-2 text-2xl font-semibold text-ink-100">{t.title}</h3>
                    <p className="mt-1 text-sm text-ink-300">{t.text}</p>
                  </TiltCard>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </section>

      <Reveal>
        <div className="panel flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="font-display text-3xl font-bold text-ink-100">Ready to add your own light?</p>
            <p className="text-ink-300">Light a diya, make a wish and join the mandala.</p>
          </div>
          <Link to="/light" className="btn-gold">
            <Flame size={18} /> Light a diya
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
