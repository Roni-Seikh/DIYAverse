import { memo, useMemo } from 'react'
import { diyaSvg } from '@/lib/diyaSvg'
import type { DiyaDesign, FlameColor } from '@/lib/types'

interface Props {
  design: DiyaDesign
  color: FlameColor
  lit: boolean
  className?: string
}

/** The SVG string only contains fixed palette values (never user text), so injecting it is safe. */
export const Diya = memo(function Diya({ design, color, lit, className }: Props) {
  const html = useMemo(() => diyaSvg(design, color, lit), [design, color, lit])
  return <div className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
})
