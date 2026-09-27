import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HudCard from '../components/HudCard'
import Sprite from '../components/Sprite'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import { person, dialogue, presetWishes } from '../config.js'
import { sfx } from '../utils/sfx'

function calcAge(dob: string): number {
  const birth = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function calcDaysTogether(start: string): number {
  const startDate = new Date(start)
  const now = new Date()
  return Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
}

function getNextBirthday(dob: string): { isToday: boolean; days: number; hours: number; mins: number; secs: number } {
  const birth = new Date(dob)
  const now = new Date()
  const next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate(), 0, 0, 0)

  if (next.getTime() < now.getTime()) {
    next.setFullYear(now.getFullYear() + 1)
  }

  const isToday = now.getMonth() === birth.getMonth() && now.getDate() === birth.getDate()
  const diff = next.getTime() - now.getTime()
  const totalSecs = Math.floor(diff / 1000)

  return {
    isToday,
    days: Math.floor(totalSecs / 86400),
    hours: Math.floor((totalSecs % 86400) / 3600),
    mins: Math.floor((totalSecs % 3600) / 60),
    secs: totalSecs % 60,
  }
}

function getWishCount(): number {
  let stored = 0
  try {
    const raw = localStorage.getItem('wishes')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) stored = parsed.length
    }
  } catch {
    // ignore
  }
  return stored + presetWishes.length
}

const LEVEL_TILES = [
  { id: 'cake', path: '/cake', label: 'Cake', glow: 'pink' as const },
  { id: 'memories', path: '/memories', label: 'Memories', glow: 'blue' as const },
  { id: 'gallery', path: '/gallery', label: 'Gallery', glow: 'blue' as const },
  { id: 'videos', path: '/videos', label: 'Videos', glow: 'pink' as const },
  { id: 'reasons', path: '/reasons', label: 'Reasons', glow: 'blue' as const },
  { id: 'quiz', path: '/quiz', label: 'Quiz', glow: 'pink' as const },
  { id: 'game', path: '/game', label: 'Game', glow: 'blue' as const },
  { id: 'wishes', path: '/wishes', label: 'Wishes', glow: 'pink' as const },
  { id: 'letter', path: '/letter', label: 'Letter', glow: 'blue' as const },
  { id: 'secret', path: '/secret', label: 'Secret', glow: 'pink' as const },
]

export default function Hub() {
  const navigate = useNavigate()
  const { say } = useBuddy()
  const { isUnlocked, completed } = useXP()
  const [countdown, setCountdown] = useState(getNextBirthday(person.dob))
  const [wishCount, setWishCount] = useState(getWishCount())
  const [loading, setLoading] = useState(true)
  const loadedRef = useRef(false)

  // Redirect to / if gate not unlocked
  useEffect(() => {
    if (!isUnlocked('hub')) {
      navigate('/', { replace: true })
      return
    }
  }, [isUnlocked, navigate])

  // Buddy waves with hub dialogue
  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    const hub = dialogue.hub
    if (hub) {
      say(hub.pose, hub.text, hub.face)
    }
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [say])

  // Live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getNextBirthday(person.dob))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Refresh wish count when page regains focus
  useEffect(() => {
    const onFocus = () => setWishCount(getWishCount())
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const age = calcAge(person.dob)
  const daysTogether = calcDaysTogether(person.relationshipStart)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full mt-20">
        <div className="bubbletea-spin">
          <Sprite name="bubbletea" kind="props" scale={4} />
        </div>
        <div className="font-pixel text-[8px] text-neon-sky/50 uppercase tracking-widest">
          Loading Mission Control
          <span className="cursor-blink">{'\u258C'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mt-4">
      <h1 className="font-pixel text-sm sm:text-base text-neon-sky uppercase tracking-widest">
        {'\u25C8'} Mission Control {'\u25C8'}
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        <HudCard icon={'\u2726'} label="Age Unlocked" glow="pink" className="w-full">
          <div className="font-pixel text-2xl sm:text-3xl text-neon-pink mb-1">
            {age}
          </div>
          <div className="font-pixel text-[6px] text-soft/40 uppercase tracking-wider">
            Years
          </div>
        </HudCard>

        <HudCard icon={'\u2764'} label="Days Together" glow="blue" className="w-full">
          <div className="font-pixel text-2xl sm:text-3xl text-neon-sky mb-1">
            {daysTogether.toLocaleString()}
          </div>
          <div className="font-pixel text-[6px] text-soft/40 uppercase tracking-wider">
            Since {new Date(person.relationshipStart).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </HudCard>

        <HudCard icon={<Sprite name="phone" kind="props" scale={1} />} label="Wishes Collected" glow="pink" className="w-full">
          <div className="font-pixel text-2xl sm:text-3xl text-neon-pink mb-1">
            {wishCount}
          </div>
          <div className="font-pixel text-[6px] text-soft/40 uppercase tracking-wider">
            Messages
          </div>
        </HudCard>
      </div>

      {/* Birthday countdown */}
      <div className="w-full">
        <div className="font-pixel text-[8px] text-neon-sky/60 uppercase tracking-widest text-center mb-3">
          {'\u25C6'} Countdown to Birthday {'\u25C6'}
        </div>
        {countdown.isToday ? (
          <div
            className="relative bg-navy-800/60 backdrop-blur-sm border-2 border-neon-pink/50 p-4 text-center"
            style={{ borderRadius: '2px', boxShadow: '0 0 20px rgba(244, 114, 182, 0.3)' }}
          >
            <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-neon-pink pointer-events-none" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-neon-pink pointer-events-none" />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-neon-pink pointer-events-none" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-neon-pink pointer-events-none" />
            <div className="font-pixel text-sm sm:text-base text-neon-pink uppercase tracking-widest animate-pulse">
              {'\u2605'} TODAY IS THE DAY {'\u2605'}
            </div>
            <div className="font-pixel text-[7px] text-neon-pink/60 mt-2">
              Happy Birthday, {person.name}!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 w-full">
            {[
              { label: 'Days', value: countdown.days },
              { label: 'Hours', value: countdown.hours },
              { label: 'Mins', value: countdown.mins },
              { label: 'Secs', value: countdown.secs },
            ].map((chip) => (
              <div
                key={chip.label}
                className="relative bg-navy-800/60 backdrop-blur-sm border border-neon-blue/40 p-2 sm:p-3 text-center"
                style={{ borderRadius: '2px' }}
              >
                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-sky pointer-events-none" />
                <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-sky pointer-events-none" />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-sky pointer-events-none" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-sky pointer-events-none" />
                <div className="font-pixel text-lg sm:text-xl text-neon-sky tabular-nums">
                  {String(chip.value).padStart(2, '0')}
                </div>
                <div className="font-pixel text-[6px] text-soft/40 uppercase tracking-wider mt-1">
                  {chip.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Level tiles */}
      <div className="w-full">
        <div className="font-pixel text-[8px] text-neon-sky/60 uppercase tracking-widest text-center mb-3">
          {'\u25C6'} Mission Levels {'\u25C6'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          {LEVEL_TILES.map((tile) => {
            const unlocked = isUnlocked(tile.id)
            const done = !!completed[tile.id]
            return (
              <Link
                key={tile.id}
                to={unlocked ? tile.path : '#'}
                onClick={(e) => {
                  if (!unlocked) {
                    e.preventDefault()
                    sfx.click()
                    say('think', 'This level is still locked. Complete the previous one first!', 'surprised')
                    return
                  }
                  sfx.click()
                }}
                className={`relative bg-navy-800/60 backdrop-blur-sm border rounded-sm p-4 flex flex-col items-center gap-2 transition-all duration-200 ${
                  !unlocked
                    ? 'border-soft/20 opacity-50 cursor-not-allowed'
                    : done
                    ? tile.glow === 'pink'
                      ? 'border-neon-pink/60 hover:scale-105 hover:shadow-[0_0_12px_rgba(244,114,182,0.3)]'
                      : 'border-neon-blue/60 hover:scale-105 hover:shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                    : tile.glow === 'pink'
                    ? 'border-neon-pink/40 hover:scale-105 hover:border-neon-pink hover:shadow-[0_0_12px_rgba(244,114,182,0.3)]'
                    : 'border-neon-blue/40 hover:scale-105 hover:border-neon-blue hover:shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sprite name="books" kind="props" scale={2} />
                  {done && (
                    <span className="font-pixel text-[8px] text-neon-sky">{'\u2713'}</span>
                  )}
                </div>
                <span className={`font-pixel text-[8px] uppercase tracking-wider ${unlocked ? 'text-soft/70' : 'text-soft/30'}`}>
                  {tile.label}
                </span>
                {!unlocked && (
                  <span className="font-pixel text-[10px] text-soft/30">{'\u25A0'}</span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Achievements link */}
      <Link
        to="/achievements"
        onClick={() => sfx.click()}
        className="relative bg-navy-800/60 backdrop-blur-sm border border-neon-blue/40 rounded-sm p-4 flex items-center gap-3 transition-all duration-200 hover:scale-105 hover:border-neon-blue hover:shadow-[0_0_12px_rgba(37,99,235,0.3)] w-full max-w-xs justify-center"
      >
        <Sprite name="backpack" kind="props" scale={2} />
        <span className="font-pixel text-[8px] uppercase tracking-wider text-neon-sky/70">
          Achievements
        </span>
      </Link>
    </div>
  )
}
