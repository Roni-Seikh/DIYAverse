export type DiyaDesign = 'clay' | 'lotus' | 'brass' | 'peacock'
export type FlameColor = 'gold' | 'ember' | 'rose' | 'teal' | 'violet'
export type DiyaSource = 'local' | 'cloud'

export interface Diya {
  id: string
  name: string
  wish: string
  design: DiyaDesign
  color: FlameColor
  createdAt: number
  source: DiyaSource
  region?: string
}

export type NewDiya = Omit<Diya, 'id' | 'createdAt' | 'source'>

/** Honest connection states. 'connected' is only ever set after a real server snapshot. */
export type CloudStatus = 'local' | 'connecting' | 'connected' | 'error'

export type Lang = 'en' | 'hi' | 'bn'
export type Tone = 'emotional' | 'heartwarming' | 'professional' | 'friendly' | 'inspirational' | 'traditional'
export type Relationship = 'family' | 'friend' | 'partner' | 'colleague' | 'mentor' | 'client'
export type Length = 'short' | 'medium' | 'long'
