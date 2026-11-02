import { FLAMES } from '@/data/palette'
import type { DiyaDesign, FlameColor } from './types'

let uid = 0

interface BowlStyle {
  body: string
  rim: string
  deco: string
}

function bowl(design: DiyaDesign, u: string): BowlStyle {
  switch (design) {
    case 'lotus':
      return {
        body: `
          <g>
            <path d="M100 124 C60 124 34 104 24 78 C52 84 76 98 100 124Z" fill="url(#pet${u})"/>
            <path d="M100 124 C140 124 166 104 176 78 C148 84 124 98 100 124Z" fill="url(#pet${u})"/>
            <path d="M100 124 C78 108 62 84 66 56 C86 70 98 94 100 124Z" fill="url(#pet${u})" opacity=".92"/>
            <path d="M100 124 C122 108 138 84 134 56 C114 70 102 94 100 124Z" fill="url(#pet${u})" opacity=".92"/>
          </g>
          <path d="M44 128 C54 160 76 172 100 172 C124 172 146 160 156 128 C136 138 118 142 100 142 C82 142 64 138 44 128Z" fill="url(#bowl${u})"/>`,
        rim: '',
        deco: '',
      }
    case 'brass':
      return {
        body: `
          <path d="M30 120 C34 156 62 172 100 172 C138 172 166 156 170 120 Z" fill="url(#brass${u})"/>
          <rect x="82" y="170" width="36" height="8" rx="3" fill="#8a5a14"/>
          <rect x="68" y="177" width="64" height="8" rx="4" fill="url(#brass${u})"/>
          <path d="M170 124 C190 118 192 140 176 146" fill="none" stroke="#c98a26" stroke-width="6" stroke-linecap="round"/>`,
        rim: `<ellipse cx="100" cy="120" rx="70" ry="11" fill="#f2c25a"/><ellipse cx="100" cy="122" rx="58" ry="7" fill="#7a4a10"/>`,
        deco: `<path d="M56 140 C80 152 120 152 144 140" fill="none" stroke="#fff0b8" stroke-opacity=".55" stroke-width="2.5" stroke-linecap="round"/>`,
      }
    case 'peacock':
      return {
        body: `<path d="M26 118 C30 156 60 174 100 174 C140 174 170 156 174 118 Z" fill="url(#peacock${u})"/>`,
        rim: `<ellipse cx="100" cy="118" rx="74" ry="12" fill="#e9b04a"/><ellipse cx="100" cy="120" rx="62" ry="8" fill="#4a1f0a"/>`,
        deco: `
          <path d="M100 168 C84 160 80 146 90 138 C98 150 100 154 100 168Z" fill="#1fb7a6"/>
          <path d="M100 168 C116 160 120 146 110 138 C102 150 100 154 100 168Z" fill="#3a6fe0"/>
          <ellipse cx="100" cy="146" rx="6" ry="9" fill="#f2c25a"/><ellipse cx="100" cy="146" rx="2.8" ry="4.6" fill="#1b2a6b"/>
          <circle cx="52" cy="140" r="3.2" fill="#ffe08a"/><circle cx="148" cy="140" r="3.2" fill="#ffe08a"/>`,
      }
    case 'clay':
    default:
      return {
        body: `<path d="M24 116 C26 154 58 172 100 172 C142 172 174 154 176 116 Z" fill="url(#clay${u})"/>`,
        rim: `<ellipse cx="100" cy="116" rx="76" ry="13" fill="#d9773a"/><ellipse cx="100" cy="118" rx="64" ry="8.5" fill="#4a1c08"/>`,
        deco: `
          <path d="M44 138 C70 150 130 150 156 138" fill="none" stroke="#ffd9a0" stroke-opacity=".7" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 9"/>
          <path d="M60 154 C84 162 116 162 140 154" fill="none" stroke="#ffd9a0" stroke-opacity=".45" stroke-width="2.5" stroke-linecap="round"/>`,
      }
  }
}

/**
 * Builds a self-contained SVG string for a diya. It only interpolates fixed palette values
 * (never user text), so it is safe to inject and also safe to rasterise for PNG cards.
 */
export function diyaSvg(design: DiyaDesign, color: FlameColor, lit: boolean): string {
  const u = String(++uid)
  const f = FLAMES[color]
  const b = bowl(design, u)
  const flame = lit
    ? `
    <circle cx="100" cy="86" r="62" fill="url(#glow${u})" class="glow-pulse"/>
    <g class="flame lit-flame">
      <path d="M100 38 C112 58 126 70 126 90 C126 106 114 116 100 116 C86 116 74 106 74 90 C74 70 88 58 100 38Z" fill="url(#fl${u})"/>
      <path d="M100 70 C107 82 114 90 114 100 C114 109 108 115 100 115 C92 115 86 109 86 100 C86 90 93 82 100 70Z" fill="${f.core}" opacity=".95"/>
    </g>`
    : `<path d="M100 104 L100 116" stroke="#3a2a1a" stroke-width="3.5" stroke-linecap="round"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-hidden="true">
  <defs>
    <radialGradient id="glow${u}" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="${f.glow}" stop-opacity=".75"/>
      <stop offset="1" stop-color="${f.glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fl${u}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${f.core}"/>
      <stop offset=".35" stop-color="${f.main}"/>
      <stop offset="1" stop-color="${f.main}" stop-opacity=".85"/>
    </linearGradient>
    <linearGradient id="clay${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e58a46"/><stop offset="1" stop-color="#8f3f12"/></linearGradient>
    <linearGradient id="brass${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d57a"/><stop offset=".5" stop-color="#d4952c"/><stop offset="1" stop-color="#8a5a14"/></linearGradient>
    <linearGradient id="peacock${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d3fa8"/><stop offset="1" stop-color="#12185a"/></linearGradient>
    <linearGradient id="pet${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb3d1"/><stop offset="1" stop-color="#e0538a"/></linearGradient>
    <linearGradient id="bowl${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9a23b"/><stop offset="1" stop-color="#8f3f12"/></linearGradient>
  </defs>
  ${design === 'lotus' ? '' : ''}
  ${b.body}
  ${b.rim}
  ${b.deco}
  ${flame}
</svg>`
}
