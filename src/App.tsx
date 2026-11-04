import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './pages/Home'

const Discover = lazy(() => import('./pages/Discover'))
const LightDiya = lazy(() => import('./pages/LightDiya'))
const WishStudio = lazy(() => import('./pages/WishStudio'))
const RangoliStudio = lazy(() => import('./pages/RangoliStudio'))
const World = lazy(() => import('./pages/World'))
const InfinityPage = lazy(() => import('./pages/Infinity'))
const FestivalNight = lazy(() => import('./pages/FestivalNight'))
const Impact = lazy(() => import('./pages/Impact'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 text-ink-300">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-400/30 border-t-gold-400" />
        <span className="text-sm">Lighting things up…</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="discover" element={<Discover />} />
          <Route path="light" element={<LightDiya />} />
          <Route path="wishes" element={<WishStudio />} />
          <Route path="rangoli" element={<RangoliStudio />} />
          <Route path="world" element={<World />} />
          <Route path="infinity" element={<InfinityPage />} />
          <Route path="night" element={<FestivalNight />} />
          <Route path="impact" element={<Impact />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
