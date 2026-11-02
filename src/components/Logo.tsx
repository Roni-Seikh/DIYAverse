export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id="lg-f" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#ff9a1f" />
        </radialGradient>
        <linearGradient id="lg-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9a23b" />
          <stop offset="1" stopColor="#a8531a" />
        </linearGradient>
      </defs>
      <path d="M32 6c5 7 9 11 9 17a9 9 0 0 1-18 0c0-6 4-10 9-17z" fill="url(#lg-f)" />
      <path d="M8 34h48c0 11-10 20-24 20S8 45 8 34z" fill="url(#lg-b)" />
      <ellipse cx="32" cy="34" rx="24" ry="4" fill="#ffcf6b" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className="font-display text-2xl font-bold tracking-wide gold-text">DIYAverse</span>
    </span>
  )
}
