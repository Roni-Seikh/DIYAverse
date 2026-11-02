import { FLAME_KEYS } from '@/data/palette'
import type { LightPoint } from '@/components/InfinityCanvas'

/**
 * Clearly labelled illustrative lights, used ONLY when there are no real contributions.
 * They are generated, not people, and are always shown with an "illustrative" label.
 */
export function illustrativePoints(count = 64): LightPoint[] {
  const base = 1_700_000_000_000
  return Array.from({ length: count }, (_, i) => ({
    id: `sample-${i}`,
    name: 'Illustrative light',
    wish: 'An example light. Real wishes appear here once people contribute.',
    color: FLAME_KEYS[i % FLAME_KEYS.length],
    createdAt: base + i * 1000,
    illustrative: true,
  }))
}
