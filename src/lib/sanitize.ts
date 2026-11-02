export const LIMITS = { name: 24, wish: 140, region: 30 } as const

/** Collapse whitespace, strip control characters and angle brackets. React also escapes on render. */
export function cleanText(input: string, max: number): string {
  // eslint-disable-next-line no-control-regex
  const noControl = input.replace(/[\u0000-\u001F\u007F]/g, ' ')
  return noControl.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max)
}

// Small client-side safeguard list. This is a courtesy filter, not real moderation:
// Firestore rules enforce size/shape, and a production deployment should add server-side review.
const BLOCKED = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'slut', 'porn', 'nazi', 'rape',
  'madarchod', 'bhenchod', 'chutiya', 'gandu', 'randi', 'harami',
]

function normalise(s: string): string {
  return s
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/[1!|]/g, 'i')
    .replace(/3/g, 'e')
    .replace(/[4@]/g, 'a')
    .replace(/[5$]/g, 's')
    .replace(/[^a-z\s]/g, '')
}

export function looksUnsafe(text: string): boolean {
  const n = normalise(text)
  const squashed = n.replace(/\s+/g, '')
  return BLOCKED.some((w) => new RegExp(`\\b${w}`).test(n) || squashed.includes(w))
}

const URL_RE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|in|xyz|ly)\b)/i

export interface EntryCheck {
  ok: boolean
  errors: Partial<Record<'name' | 'wish' | 'region', string>>
}

export function validateEntry(name: string, wish: string, region = ''): EntryCheck {
  const errors: EntryCheck['errors'] = {}
  if (name.length < 1) errors.name = 'Please add a name or nickname (anonymous is fine).'
  else if (name.length > LIMITS.name) errors.name = `Keep the name under ${LIMITS.name} characters.`
  else if (looksUnsafe(name) || URL_RE.test(name)) errors.name = 'Please choose a different name.'

  if (wish.length < 3) errors.wish = 'Your wish needs at least a few words.'
  else if (wish.length > LIMITS.wish) errors.wish = `Keep the wish under ${LIMITS.wish} characters.`
  else if (URL_RE.test(wish)) errors.wish = 'Links are not allowed in wishes.'
  else if (looksUnsafe(wish)) errors.wish = 'Let’s keep wishes kind and festive. Please rephrase.'

  if (region) {
    if (region.length > LIMITS.region) errors.region = `Keep the region under ${LIMITS.region} characters.`
    else if (looksUnsafe(region) || URL_RE.test(region)) errors.region = 'Please enter a valid city or region.'
  }
  return { ok: Object.keys(errors).length === 0, errors }
}
