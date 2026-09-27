// Retro 8-bit Synthesized Happy Birthday Melody
const NOTES: Record<string, number> = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.0,
    A4: 440.0,
    Bb4: 466.16,
    B4: 493.88,
    C5: 523.25,
}

// Melody: note and duration in beats
const MELODY: [string, number][] = [
    ['C4', 0.75], ['C4', 0.25], ['D4', 1], ['C4', 1], ['F4', 1], ['E4', 2],
    ['C4', 0.75], ['C4', 0.25], ['D4', 1], ['C4', 1], ['G4', 1], ['F4', 2],
    ['C4', 0.75], ['C4', 0.25], ['C5', 1], ['A4', 1], ['F4', 1], ['E4', 1], ['D4', 2],
    ['Bb4', 0.75], ['Bb4', 0.25], ['A4', 1], ['F4', 1], ['G4', 1], ['F4', 2],
]

let audioCtx: AudioContext | null = null
let isPlaying = false

export function playHappyBirthdaySong() {
    if (isPlaying) return
    isPlaying = true

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioCtx = new AudioCtx()
    if (audioCtx.state === 'suspended') {
        audioCtx.resume()
    }

    const tempo = 140
    const beatDuration = 60 / tempo
    let time = audioCtx.currentTime + 0.1

    MELODY.forEach(([note, beats]) => {
        const freq = NOTES[note]
        if (!freq || !audioCtx) return

        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()

        osc.type = 'square' // Retro 8-bit sound
        osc.frequency.setValueAtTime(freq, time)

        const dur = beats * beatDuration
        gain.gain.setValueAtTime(0.12, time)
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur - 0.04)

        osc.connect(gain)
        gain.connect(audioCtx.destination)

        osc.start(time)
        osc.stop(time + dur)

        time += dur
    })

    setTimeout(() => {
        isPlaying = false
    }, (time - audioCtx.currentTime) * 1000)
}

export function stopHappyBirthdaySong() {
    if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(() => { })
        audioCtx = null
    }
    isPlaying = false
}