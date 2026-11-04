import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { DIWALI_DAYS, daysUntil, startOf } from '@/data/diwali'
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion'

function Unit({ value, label }: { value: number; label: string }) {
  const reduced = usePrefersReducedMotion()
  const text = String(value).padStart(2, '0')
  return (
    <div className="flex min-w-[3.6rem] flex-col items-center rounded-xl border border-gold-400/25 bg-night-950/60 px-2 py-2 sm:min-w-[4.4rem]">
      <div className="relative h-9 overflow-hidden sm:h-11">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={reduced ? false : { y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: -22, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-display block text-3xl font-bold leading-9 tabular-nums gold-text sm:text-4xl sm:leading-[2.75rem]"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[0.65rem] uppercase tracking-widest text-ink-400">{label}</span>
    </div>
  )
}

/** Counts down to the start of Lakshmi Puja day (local time), then follows the five days. */
export function Countdown() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const main = DIWALI_DAYS[2]
  const first = DIWALI_DAYS[0]
  const last = DIWALI_DAYS[4]
  const toFirst = daysUntil(first.date, now)
  const toLast = daysUntil(last.date, now)

  // During the festival: show which day it is.
  if (toFirst <= 0 && toLast >= 0) {
    const today = DIWALI_DAYS.find((d) => daysUntil(d.date, now) === 0)
    return (
      <div className="rounded-2xl border border-gold-400/30 bg-gold-400/10 p-4" role="status">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">The festival is here</p>
        <p className="font-display mt-1 text-2xl text-ink-100">
          Day {today?.n} of 5 · {today?.name}
        </p>
        <Link to="/discover" className="mt-1 inline-block text-sm text-gold-300 underline">
          What happens today?
        </Link>
      </div>
    )
  }
  if (toLast < 0) {
    return (
      <div className="rounded-2xl border border-ink-400/25 bg-white/5 p-4 text-sm text-ink-300" role="status">
        Diwali 2026 has passed. Your lights and greetings stay saved on this device until next year.
      </div>
    )
  }

  const diff = Math.max(0, startOf(main.date).getTime() - now.getTime())
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const mins = Math.floor((diff % 3_600_000) / 60_000)
  const secs = Math.floor((diff % 60_000) / 1000)

  return (
    <div role="timer" aria-label={`${days} days until Lakshmi Puja`}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-300">Until Lakshmi Puja · 8 Nov 2026</p>
      <div className="flex gap-2">
        <Unit value={days} label="Days" />
        <Unit value={hours} label="Hours" />
        <Unit value={mins} label="Min" />
        <Unit value={secs} label="Sec" />
      </div>
      <p className="mt-2 text-xs text-ink-400">Dates follow common 2026 calendars and can differ by region.</p>
    </div>
  )
}
