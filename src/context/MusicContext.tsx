import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react'
import { music } from '../config.js'

interface MusicContextValue {
  isPlaying: boolean
  currentTrack: number
  volume: number
  ducked: boolean
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  setVolume: (v: number) => void
  duck: () => void
  resume: () => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolumeState] = useState(0.5)
  const [ducked, setDucked] = useState(false)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = volume
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const track = music[currentTrack]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track) return
    audio.src = track.src
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    }
  }, [currentTrack, track, isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = ducked ? volume * 0.3 : volume
    }
  }, [volume, ducked])

  const play = () => {
    setIsPlaying(true)
  }

  const pause = () => {
    setIsPlaying(false)
    audioRef.current?.pause()
  }

  const toggle = () => {
    if (isPlaying) pause()
    else play()
  }

  const next = () => {
    setCurrentTrack((t) => (t + 1) % music.length)
  }

  const prev = () => {
    setCurrentTrack((t) => (t - 1 + music.length) % music.length)
  }

  const setVolume = (v: number) => {
    setVolumeState(Math.max(0, Math.min(1, v)))
  }

  const duck = () => setDucked(true)
  const resume = () => setDucked(false)

  return (
    <MusicContext.Provider value={{ isPlaying, currentTrack, volume, ducked, play, pause, toggle, next, prev, setVolume, duck, resume }}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used within MusicProvider')
  return ctx
}
