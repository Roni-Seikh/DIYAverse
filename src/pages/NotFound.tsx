import { Link } from 'react-router-dom'
import { Diya } from '@/components/Diya'

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <Diya design="clay" color="gold" lit={false} className="w-40 opacity-80" />
      <h1 className="font-display mt-4 text-5xl font-bold gold-text">This diya isn’t lit yet</h1>
      <p className="mt-3 text-ink-300">We couldn’t find the page you were looking for. Let’s guide you back to the light.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-gold">
          Back to home
        </Link>
        <Link to="/light" className="btn-ghost">
          Light a diya
        </Link>
      </div>
    </section>
  )
}
