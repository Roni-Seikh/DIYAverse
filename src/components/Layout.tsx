import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { CloudBadge } from './CloudBadge'

const NAV = [
  { to: '/light', label: 'Light a Diya' },
  { to: '/wishes', label: 'Wish Studio' },
  { to: '/rangoli', label: 'Rangoli' },
  { to: '/world', label: 'World of Lights' },
  { to: '/infinity', label: 'Infinity of Light' },
  { to: '/night', label: 'Festival Night' },
  { to: '/impact', label: 'Impact' },
  { to: '/about', label: 'About' },
]

const TITLES: Record<string, string> = {
  '/': 'DIYAverse — The Living Festival of Lights',
  '/light': 'Light Your Diya · DIYAverse',
  '/wishes': 'Wish Studio · DIYAverse',
  '/rangoli': 'Rangoli Studio · DIYAverse',
  '/world': 'World of Lights · DIYAverse',
  '/infinity': 'The Infinity of Light · DIYAverse',
  '/night': 'Festival Night · DIYAverse',
  '/impact': 'Light Impact · DIYAverse',
  '/about': 'About · DIYAverse',
}

export function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0 })
    document.title = TITLES[pathname] ?? 'Page not found · DIYAverse'
  }, [pathname])

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-1.5 text-sm transition-colors ${isActive ? 'bg-gold-400/15 text-gold-300' : 'text-ink-300 hover:text-ink-100 hover:bg-white/5'}`

  const immersive = pathname === '/night'

  return (
    <div className="sky min-h-screen">
      <a href="#main" className="sr-only-skip">
        Skip to content
      </a>
      {!immersive && (
        <header className="sticky top-0 z-50 border-b border-gold-400/10 bg-night-900/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
            <Link to="/" aria-label="DIYAverse home">
              <Logo />
            </Link>
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} className={linkCls}>
                  {n.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <span className="hidden sm:block">
                <CloudBadge />
              </span>
              <button
                className="btn-ghost !p-2 lg:hidden"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="mobile-nav"
                onClick={() => setOpen((o) => !o)}
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          {open && (
            <nav id="mobile-nav" className="border-t border-gold-400/10 px-4 pb-4 pt-2 lg:hidden" aria-label="Mobile">
              <div className="mb-3 sm:hidden">
                <CloudBadge />
              </div>
              <div className="grid grid-cols-2 gap-1">
                {NAV.map((n) => (
                  <NavLink key={n.to} to={n.to} className={linkCls}>
                    {n.label}
                  </NavLink>
                ))}
              </div>
            </nav>
          )}
        </header>
      )}
      <main id="main">
        <Outlet />
      </main>
      {!immersive && (
        <footer className="mt-24 border-t border-gold-400/10 bg-night-950/60">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
            <div>
              <Logo />
              <p className="mt-3 max-w-xs text-sm text-ink-400">One Light. One Wish. One Connected World.</p>
            </div>
            <div className="text-sm text-ink-300">
              <p className="mb-2 font-semibold text-ink-100">Explore</p>
              <ul className="grid grid-cols-2 gap-y-1">
                {NAV.map((n) => (
                  <li key={n.to}>
                    <Link className="hover:text-gold-300" to={n.to}>
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-sm text-ink-400">
              <p className="mb-2 font-semibold text-ink-100">Built for Diwali Digital Diya 2026</p>
              <p>
                An independent student project. It is not affiliated with or endorsed by Google, AWS or GDG. Made with React, Firebase and a lot of light.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
