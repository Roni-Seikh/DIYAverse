/**
 * Original, fully synthesised audio (Web Audio API). No audio files are bundled,
 * so there are no licensing concerns. Everything is off until the user opts in.
 */
type Ctx = AudioContext

// Bhupali-like pentatonic (C D E G A) in Hz across two octaves
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0]

class FestivalAudio {
  private ctx: Ctx | null = null
  private master: GainNode | null = null
  private musicTimer: number | null = null
  private musicNodes: AudioNode[] = []
  private ambientNodes: (AudioNode & { stop?: () => void })[] = []
  private ambientTimer: number | null = null
  private step = 0

  private ensure(): Ctx | null {
    if (typeof window === 'undefined') return null
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    if (!this.ctx) {
      this.ctx = new AC()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.7
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  private pluck(freq: number, when: number, vol = 0.12, dur = 1.6) {
    const ctx = this.ctx
    if (!ctx || !this.master) return
    const o = ctx.createOscillator()
    const o2 = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'triangle'
    o2.type = 'sine'
    o.frequency.value = freq
    o2.frequency.value = freq * 2.003
    g.gain.setValueAtTime(0.0001, when)
    g.gain.exponentialRampToValueAtTime(vol, when + 0.015)
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur)
    o.connect(g)
    o2.connect(g)
    g.connect(this.master)
    o.start(when)
    o2.start(when)
    o.stop(when + dur + 0.05)
    o2.stop(when + dur + 0.05)
  }

  /** Soft bell when a diya is lit. */
  chime() {
    const ctx = this.ensure()
    if (!ctx) return
    const t = ctx.currentTime
    ;[0, 2, 4].forEach((i, k) => this.pluck(SCALE[5 + i] ?? 523, t + k * 0.12, 0.1, 2.2))
  }

  /** Firework: a short noise burst through a falling filter. */
  boom() {
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    const len = Math.floor(ctx.sampleRate * 0.5)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2)
    const src = ctx.createBufferSource()
    src.buffer = buf
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.setValueAtTime(1800, ctx.currentTime)
    f.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.45)
    const g = ctx.createGain()
    g.gain.value = 0.35
    src.connect(f)
    f.connect(g)
    g.connect(this.master)
    src.start()
  }

  get musicOn() {
    return this.musicTimer !== null
  }

  startMusic() {
    const ctx = this.ensure()
    if (!ctx || !this.master || this.musicTimer !== null) return
    // tanpura-style drone
    ;[130.81, 196.0].forEach((f) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sawtooth'
      o.frequency.value = f
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 420
      g.gain.value = 0.035
      o.connect(lp)
      lp.connect(g)
      g.connect(this.master!)
      o.start()
      this.musicNodes.push(o, g, lp)
    })
    const phrase = [0, 2, 4, 5, 4, 2, 3, 1, 0, 2, 4, 6, 5, 4, 2, 0]
    this.step = 0
    const tick = () => {
      const c = this.ctx
      if (!c) return
      const note = SCALE[phrase[this.step % phrase.length]]
      this.pluck(note, c.currentTime + 0.02, 0.09, 1.8)
      this.step++
    }
    tick()
    this.musicTimer = window.setInterval(tick, 700)
  }

  stopMusic() {
    if (this.musicTimer !== null) window.clearInterval(this.musicTimer)
    this.musicTimer = null
    this.musicNodes.forEach((n) => {
      const s = n as AudioNode & { stop?: () => void }
      try {
        s.stop?.()
      } catch {
        /* already stopped */
      }
      n.disconnect()
    })
    this.musicNodes = []
  }

  get ambientOn() {
    return this.ambientTimer !== null
  }

  /** Gentle wind (filtered noise) with occasional temple-bell tones. */
  startAmbient() {
    const ctx = this.ensure()
    if (!ctx || !this.master || this.ambientTimer !== null) return
    const len = ctx.sampleRate * 2
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop = true
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 500
    bp.Q.value = 0.6
    const g = ctx.createGain()
    g.gain.value = 0.05
    src.connect(bp)
    bp.connect(g)
    g.connect(this.master)
    src.start()
    this.ambientNodes.push(src as unknown as AudioNode & { stop?: () => void }, bp, g)
    this.ambientTimer = window.setInterval(() => {
      const c = this.ctx
      if (!c) return
      if (Math.random() < 0.55) this.pluck(SCALE[3 + Math.floor(Math.random() * 6)], c.currentTime, 0.05, 3)
    }, 3200)
  }

  stopAmbient() {
    if (this.ambientTimer !== null) window.clearInterval(this.ambientTimer)
    this.ambientTimer = null
    this.ambientNodes.forEach((n) => {
      try {
        n.stop?.()
      } catch {
        /* already stopped */
      }
      n.disconnect()
    })
    this.ambientNodes = []
  }

  stopAll() {
    this.stopMusic()
    this.stopAmbient()
  }
}

export const festivalAudio = new FestivalAudio()
