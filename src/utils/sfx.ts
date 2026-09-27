let audioCtx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    } catch {
      return null
    }
  }
  return audioCtx
}

function beep(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.15) {
  const ctx = getCtx()
  if (!ctx) return
  if (ctx.state === 'suspended') ctx.resume()

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

function sequence(notes: { freq: number; dur: number; type?: OscillatorType; vol?: number }[]) {
  const ctx = getCtx()
  if (!ctx) return
  let delay = 0
  for (const note of notes) {
    setTimeout(() => beep(note.freq, note.dur, note.type, note.vol), delay)
    delay += note.dur * 1000
  }
}

export const sfx = {
  click: () => beep(800, 0.05, 'square', 0.1),
  unlock: () => sequence([
    { freq: 523, dur: 0.08 },
    { freq: 659, dur: 0.08 },
    { freq: 784, dur: 0.12 },
  ]),
  success: () => sequence([
    { freq: 523, dur: 0.06 },
    { freq: 659, dur: 0.06 },
    { freq: 784, dur: 0.06 },
    { freq: 1047, dur: 0.15 },
  ]),
  pop: () => beep(440, 0.08, 'sine', 0.12),
  purr: () => sequence([
    { freq: 120, dur: 0.1, type: 'sine', vol: 0.08 },
    { freq: 140, dur: 0.1, type: 'sine', vol: 0.08 },
    { freq: 110, dur: 0.15, type: 'sine', vol: 0.06 },
  ]),
  slice: () => sequence([
    { freq: 300, dur: 0.05, type: 'sawtooth', vol: 0.08 },
    { freq: 200, dur: 0.08, type: 'sawtooth', vol: 0.06 },
    { freq: 150, dur: 0.06, type: 'sine', vol: 0.05 },
  ]),
}
