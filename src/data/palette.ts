import type { DiyaDesign, FlameColor } from '@/lib/types'

export interface FlameStyle {
  label: string
  main: string
  core: string
  glow: string
}

export const FLAMES: Record<FlameColor, FlameStyle> = {
  gold: { label: 'Golden', main: '#ffb12e', core: '#fff4c9', glow: '#ffb12e' },
  ember: { label: 'Ember', main: '#ff6a3d', core: '#ffd9a8', glow: '#ff6a3d' },
  rose: { label: 'Rose', main: '#ff4d8d', core: '#ffd1e3', glow: '#ff4d8d' },
  teal: { label: 'Teal', main: '#3fd6c4', core: '#d6fff9', glow: '#3fd6c4' },
  violet: { label: 'Violet', main: '#a678ff', core: '#eadfff', glow: '#a678ff' },
}

export const FLAME_KEYS = Object.keys(FLAMES) as FlameColor[]

export const DESIGNS: { key: DiyaDesign; label: string; blurb: string }[] = [
  { key: 'clay', label: 'Clay', blurb: 'The classic terracotta diya' },
  { key: 'lotus', label: 'Lotus', blurb: 'Petals opening around the flame' },
  { key: 'brass', label: 'Brass', blurb: 'A polished temple lamp' },
  { key: 'peacock', label: 'Peacock', blurb: 'Painted with a feather motif' },
]

export const RANGOLI_COLORS = [
  '#ffc95c', '#ff6a3d', '#ff4d8d', '#a678ff', '#3fd6c4', '#fff6e2', '#7bd36a', '#4aa3ff',
]
