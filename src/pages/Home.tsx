import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Flame, Mail, Orbit, PartyPopper, Palette, Sparkles, Users } from 'lucide-react'
import { Diya } from '@/components/Diya'
import { ParticleField, type ParticleHandle } from '@/components/ParticleField'
import { InfinityCanvas, type LightPoint } from '@/components/InfinityCanvas'
import { LogoMark } from '@/components/Logo'
import { useDiyas } from '@/lib/DiyaContext'
import { illustrativePoints } from '@/data/sample'
import { KEYS } from '@/lib/storage'
import { usePrefersReducedMotion } from '@/hooks/useReducedMotion'

function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 2600)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onDone()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [onDone])
  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center bg-night-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      role="dialog"
      aria-label="Opening animation"
    >
      <div className="flex flex-col items-center text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, ease: 'easeOut' }}>
          <Diya design="clay" color="gold" lit className="w-44 sm:w-56" />
        </motion.div>
        <motion.p
          className="font-display mt-4 text-4xl font-semibold gold-text sm:text-5xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          One light begins.
        </motion.p>
      </div>
      <button className="btn-ghost absolute bottom-8 right-6 text-sm" onClick={onDone}>
        Skip intro
      </button>
    </motion.div>
  )
}

const STEPS = [
  { icon: Flame, title: 'Light', text: 'Choose a diya, write a wish and watch the flame catch.' },
  { icon: Mail, title: 'Greet', text: 'Craft a personal Diwali greeting in English, Hindi or Bengali.' },
  { icon: Palette, title: 'Create', text: 'Draw a symmetrical rangoli and download it.' },
  { icon: Users, title: 'Join', text: 'Add your light to the shared wall and see it glow in the mandala.' },
]

export default function Home() {
  const reduced = usePrefersReducedMotion()
  const [intro, setIntro] = useState(() => {
    try {
      return !sessionStorage.getItem(KEYS.introSeen) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      return false
    }
  })
  const finishIntro = () => {
    try {
      sessionStorage.setItem(KEYS.introSeen, '1')
    } catch {
      /* ignore */
    }
    setIntro(false)
  }

  const { community, mine } = useDiyas()
  const pRef = useRef<ParticleHandle>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState(true)

  const teaserPoints: LightPoint[] = useMemo(() => {
    const real = community.map((d) => ({ id: d.id, name: d.name, wish: d.wish, color: d.color, createdAt: d.createdAt, region: d.region }))
    return real.length ? real : illustrativePoints(60)
  }, [community])
  const teaserIsReal = community.length > 0

  const kindle = () => {
    const el = heroRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    pRef.current?.burst(r.width / 2, r.height * 0.42, '#ffc95c', 90)
    setLit(true)
  }

  return (
    <>
      <AnimatePresence>{intro && <Intro onDone={finishIntro} />}</AnimatePresence>

      {/* HERO */}
      <section ref={heroRef} className="relative isolate overflow-hidden">
        <ParticleField ref={pRef} ambient className="absolute inset-0 -z-10 h-full w-full" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-10 md:grid-cols-2 md:pb-16 md:pt-16 lg:min-h-[78vh]">
          <div>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: intro ? 2.2 : 0.1 }}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-300"
            >
              <Sparkles size={14} /> Diwali, together
            </motion.p>
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: intro ? 2.3 : 0.2, duration: 0.8 }}
              className="font-display text-6xl font-bold leading-[0.95] gold-text sm:text-7xl lg:text-8xl"
            >
              DIYAverse
            </motion.h1>
            <p className="font-display mt-3 text-2xl text-ink-100 sm:text-3xl">The Living Festival of Lights</p>
            <p className="mt-4 max-w-lg text-lg text-ink-300">
              Don’t just read about Diwali, take part in it. Light a diya with your own wish, then watch every light from the community join one glowing mandala.
            </p>
            <p className="mt-2 text-sm font-medium tracking-wide text-gold-300">One Light. One Wish. One Connected World.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/light" className="btn-gold">
                <Flame size={18} /> Light Your First Diya
              </Link>
              <Link to="/infinity" className="btn-ghost">
                Enter the Celebration <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 -z-10 rounded-full bg-gold-500/10 blur-3xl" />
            <button
              onClick={kindle}
              className="group block w-full cursor-pointer rounded-3xl border-0 bg-transparent p-0"
              aria-label="Tap the diya to send a burst of sparks"
            >
              <Diya design="clay" color="gold" lit={lit} className="mx-auto w-full max-w-sm drop-shadow-[0_0_40px_rgba(247,169,40,0.35)] transition-transform group-hover:scale-[1.02]" />
              <span className="mt-1 block text-center text-xs text-ink-400">Tap the diya</span>
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS strip */}
      <section className="mx-auto max-w-7xl px-4" aria-labelledby="how-h">
        <h2 id="how-h" className="sr-only">
          How it works
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="panel flex gap-3 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-300">
                <s.icon size={20} />
              </span>
              <div>
                <p className="font-display text-xl font-semibold text-ink-100">
                  {i + 1}. {s.title}
                </p>
                <p className="text-sm text-ink-300">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* SIGNATURE TEASER */}
      <section className="mx-auto mt-16 max-w-7xl px-4" aria-labelledby="inf-h">
        <div className="panel grid overflow-hidden md:grid-cols-5">
          <div className="p-6 md:col-span-2 md:p-10">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-300">
              <Orbit size={14} /> Signature experience
            </p>
            <h2 id="inf-h" className="font-display text-4xl font-bold text-ink-100">
              The Infinity of Light
            </h2>
            <p className="mt-3 text-ink-300">
              Every diya becomes a point of light in a spiral mandala. Hover to read a wish, tap to hear its story, zoom in to explore. The more people join, the more intricate it grows.
            </p>
            <p className="mt-3 text-sm text-ink-400">
              {teaserIsReal ? `${community.length} real light${community.length === 1 ? '' : 's'} so far.` : 'Showing an illustrative example, since no one has added a light yet.'}
              {mine.length > 0 && !teaserIsReal ? ' Add yours to the wall to be the first.' : ''}
            </p>
            <Link to="/infinity" className="btn-gold mt-6">
              Explore the installation <ArrowRight size={18} />
            </Link>
          </div>
          <div className="relative h-72 md:col-span-3 md:h-auto md:min-h-[22rem]">
            <InfinityCanvas
              points={teaserPoints}
              filter={null}
              selectedId={null}
              onSelect={() => {}}
              interactive={false}
              ariaLabel={teaserIsReal ? 'Preview of the community mandala' : 'Illustrative preview of the mandala'}
              className="absolute inset-0"
            />
            {!teaserIsReal && (
              <span className="absolute bottom-3 left-3 rounded-full border border-ink-400/40 bg-night-950/80 px-3 py-1 text-xs text-ink-300">
                Illustrative example · not real people
              </span>
            )}
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="mx-auto mt-16 grid max-w-7xl gap-4 px-4 md:grid-cols-3" aria-label="More to explore">
        {[
          { to: '/wishes', icon: Mail, t: 'Wish Studio', d: 'Heartfelt greetings in three languages, ready to download as a card.' },
          { to: '/rangoli', icon: Palette, t: 'Rangoli Studio', d: 'Draw with live symmetry, stamp motifs and export your design.' },
          { to: '/night', icon: PartyPopper, t: 'Festival Night', d: 'Fireworks, lanterns and music in a full-screen night sky.' },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="panel group block p-5 transition-colors hover:border-gold-400/50">
            <c.icon className="text-gold-400" />
            <h3 className="font-display mt-3 text-2xl font-semibold text-ink-100">{c.t}</h3>
            <p className="mt-1 text-sm text-ink-300">{c.d}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-gold-300">
              Open <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <div className="mt-10 flex justify-center opacity-70">
        <LogoMark size={28} />
      </div>
    </>
  )
}
