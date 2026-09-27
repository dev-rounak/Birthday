import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sprite from './Sprite'
import { useBuddy } from '../context/BuddyContext'
import { useMusic } from '../context/MusicContext'

const RANDOM_LINES = [
  { pose: 'happy', face: 'smile', text: 'Did you know? You are amazing!' },
  { pose: 'think', face: 'wink', text: 'Hmm... I wonder what is on the next page.' },
  { pose: 'wave', face: 'smile', text: 'Hey! Thanks for visiting me!' },
  { pose: 'sit', face: 'blush', text: 'I am so glad you are here.' },
  { pose: 'celebrating', face: 'happy', text: 'Woo! This is fun!' },
  { pose: 'thinking', face: 'surprised', text: 'Wait... did you hear that?' },
  { pose: 'happy', face: 'wink', text: 'You are doing great. Keep going!' },
  { pose: 'stand', face: 'smile', text: 'Tap me again, I dare you!' },
]

const SECRET_THRESHOLD = 7

export default function Buddy() {
  const navigate = useNavigate()
  const { say } = useBuddy()
  const { isPlaying } = useMusic()
  const [hopping, setHopping] = useState(false)
  const [pose, setPose] = useState('stand')
  const [userOverride, setUserOverride] = useState(false)
  const overrideTimerRef = useRef<number | undefined>(undefined)
  const tapCountRef = useRef(0)
  const lastTapRef = useRef(0)
  const bobRef = useRef<HTMLDivElement>(null)

  const handleTap = () => {
    const now = Date.now()
    if (now - lastTapRef.current > 2000) {
      tapCountRef.current = 0
    }
    tapCountRef.current += 1
    lastTapRef.current = now

    // Hop animation
    setHopping(true)
    setTimeout(() => setHopping(false), 300)

    // Mark user override so music pose does not fight tap poses
    setUserOverride(true)
    if (overrideTimerRef.current) clearTimeout(overrideTimerRef.current)
    overrideTimerRef.current = window.setTimeout(() => setUserOverride(false), 4000)

    if (tapCountRef.current >= SECRET_THRESHOLD) {
      tapCountRef.current = 0
      setPose('thinking')
      say('thinking', 'You found me! Let me take you somewhere secret...', 'wink')
      setTimeout(() => navigate('/secret'), 1000)
      return
    }

    // Random line
    const line = RANDOM_LINES[Math.floor(Math.random() * RANDOM_LINES.length)]
    setPose(line.pose)
    say(line.pose, line.text, line.face)
  }

  // Sync pose with music state when user is not actively tapping
  useEffect(() => {
    if (!userOverride) {
      setPose(isPlaying ? 'listening' : 'stand')
    }
  }, [isPlaying, userOverride])

  // Idle bob handled by CSS animation
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced && bobRef.current) {
      bobRef.current.style.animation = 'none'
    }
  }, [])

  return (
    <div
      ref={bobRef}
      onClick={handleTap}
      className="fixed left-3 bottom-16 md:bottom-4 z-40 cursor-pointer select-none buddy-bob"
      style={{ touchAction: 'manipulation' }}
      role="button"
      aria-label="Buddy companion"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTap() }}
    >
      <div
        className="transition-transform duration-200"
        style={{
          transform: hopping ? 'translateY(-12px) scale(1.1)' : 'translateY(0) scale(1)',
        }}
      >
        <Sprite name={pose} kind="poses" scale={3} />
      </div>
      <div className="font-pixel text-[6px] text-neon-sky/50 text-center mt-1 uppercase">
        tap me
      </div>
    </div>
  )
}
