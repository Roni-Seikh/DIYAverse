import { Link } from 'react-router-dom'
import { Cloud, Cpu, Flame, Languages, Lock, Orbit, Palette, Users } from 'lucide-react'

const TECH = [
  { name: 'React + TypeScript + Vite', why: 'Fast builds, typed components, lazy-loaded routes.' },
  { name: 'Tailwind CSS', why: 'A consistent design system with accessible focus states.' },
  { name: 'Framer Motion', why: 'Smooth transitions, with reduced-motion respected.' },
  { name: 'HTML5 Canvas', why: 'Mandala, rangoli, fireworks and particles at 60 fps.' },
  { name: 'Firebase Firestore (Google)', why: 'Optional shared wall. Falls back to local demo mode when not configured.' },
  { name: 'Gemini API (Google)', why: 'Optional AI greetings through a server-side function. The key never reaches the browser.' },
  { name: 'Vercel', why: 'Free static hosting plus a serverless function for the Gemini call.' },
]

const TOUR = [
  { to: '/', icon: Flame, t: 'Cinematic home', d: 'A skippable intro and a living diya.' },
  { to: '/light', icon: Flame, t: 'Light a diya', d: 'Pick a design, write a wish, watch it ignite.' },
  { to: '/wishes', icon: Languages, t: 'Write a greeting', d: 'English, Hindi or Bengali, plus a downloadable card.' },
  { to: '/rangoli', icon: Palette, t: 'Draw a rangoli', d: 'Live symmetry, motifs, undo and export.' },
  { to: '/world', icon: Users, t: 'Join the wall', d: 'Add your light to the community.' },
  { to: '/infinity', icon: Orbit, t: 'See the Infinity of Light', d: 'Every light, one mandala.' },
]

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-5xl font-bold gold-text">About DIYAverse</h1>
        <p className="mt-3 text-lg text-ink-300">
          Diwali is about many small lights becoming something larger. DIYAverse turns that idea into an interactive experience: every visitor lights a diya, adds a wish and becomes part of one shared installation.
        </p>
      </header>

      <section className="mb-12" aria-labelledby="how">
        <h2 id="how" className="font-display mb-4 text-3xl font-semibold text-ink-100">
          How it works
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2">
          {TOUR.map((s, i) => (
            <li key={s.to}>
              <Link to={s.to} className="panel flex gap-3 p-4 transition-colors hover:border-gold-400/50">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-300">
                  <s.icon size={20} />
                </span>
                <span>
                  <span className="block font-semibold text-ink-100">
                    {i + 1}. {s.t}
                  </span>
                  <span className="text-sm text-ink-300">{s.d}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12" aria-labelledby="tech">
        <h2 id="tech" className="font-display mb-4 text-3xl font-semibold text-ink-100">
          Technology
        </h2>
        <div className="panel divide-y divide-gold-400/10">
          {TECH.map((t) => (
            <div key={t.name} className="grid gap-1 p-4 sm:grid-cols-[16rem_1fr]">
              <p className="font-semibold text-gold-300">{t.name}</p>
              <p className="text-sm text-ink-300">{t.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 grid gap-4 md:grid-cols-3" aria-label="Principles">
        <div className="panel p-5">
          <Cloud className="text-gold-400" />
          <h3 className="font-display mt-2 text-xl font-semibold text-ink-100">Honest cloud status</h3>
          <p className="mt-1 text-sm text-ink-300">The badge says “Firestore connected” only after the server has actually answered. Otherwise you’re clearly told you are in local demo mode.</p>
        </div>
        <div className="panel p-5">
          <Cpu className="text-gold-400" />
          <h3 className="font-display mt-2 text-xl font-semibold text-ink-100">Honest AI</h3>
          <p className="mt-1 text-sm text-ink-300">Every greeting is labelled as written by Gemini or by the built-in offline generator. It never pretends.</p>
        </div>
        <div className="panel p-5">
          <Lock className="text-gold-400" />
          <h3 className="font-display mt-2 text-xl font-semibold text-ink-100">Privacy by default</h3>
          <p className="mt-1 text-sm text-ink-300">No accounts. Names can be nicknames. Region is optional. Your collection lives only in your browser unless you add it to the wall.</p>
        </div>
      </section>

      <section className="panel p-6" aria-labelledby="comp">
        <h2 id="comp" className="font-display text-3xl font-semibold text-ink-100">
          Built for Diwali Digital Diya 2026
        </h2>
        <p className="mt-2 text-ink-300">
          DIYAverse was created for the Diwali Digital Diya competition organised by GDG on Campus JIS University with the AWS Student Builder Group. It is an independent student project and is not affiliated with or endorsed by Google, AWS or GDG.
        </p>
        <p className="mt-3 text-sm text-ink-400">
          Why Google Firebase rather than AWS? One carefully built, working integration seemed better than two decorative ones. Firestore’s real-time listeners suit a live wall of lights, and the whole app still works without it.
        </p>
      </section>
    </div>
  )
}
