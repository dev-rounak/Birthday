import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { person, dialogue, presetWishes } from '../config.js'
import { useBuddy } from '../context/BuddyContext'
import { useXP, LEVELS } from '../context/XPContext'
import HudCard from '../components/HudCard'
import Sprite from '../components/Sprite'

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  isToday: boolean
}

function parseDate(dateStr: string): Date {
  if (/^\d{8}$/.test(dateStr)) {
    const day = parseInt(dateStr.slice(0, 2), 10)
    const month = parseInt(dateStr.slice(2, 4), 10) - 1
    const year = parseInt(dateStr.slice(4, 8), 10)
    return new Date(year, month, day)
  }
  return new Date(dateStr)
}

function calculateAge(dobStr: string): number {
  if (!dobStr) return 0
  const birthDate = parseDate(dobStr)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

function calculateDaysTogether(startDateStr: string): number {
  if (!startDateStr) return 0
  const start = parseDate(startDateStr)
  const now = new Date()
  const diffTime = Math.max(0, now.getTime() - start.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

function calculateNextBirthday(dobStr: string): TimeRemaining {
  const birthDate = parseDate(dobStr || '06102006')
  const now = new Date()
  const currentYear = now.getFullYear()
  let nextBday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate())

  const isToday =
    now.getDate() === birthDate.getDate() && now.getMonth() === birthDate.getMonth()

  if (now.getTime() > nextBday.getTime() && !isToday) {
    nextBday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate())
  }

  const diff = Math.max(0, nextBday.getTime() - now.getTime())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds, isToday }
}

export default function Hub() {
  const navigate = useNavigate()
  const { say } = useBuddy()
  const { isUnlocked, isLevelCompleted, completeLevel } = useXP()
  const [loading, setLoading] = useState(true)
  const [wishesCount, setWishesCount] = useState(0)
  const hasTriggeredGreeting = useRef(false)

  const personConfig = person as any

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateNextBirthday(personConfig?.dob || personConfig?.password || '06102006')
  )

  useEffect(() => {
    if (!isUnlocked('hub')) {
      navigate('/', { replace: true })
      return
    }

    if (!isLevelCompleted('hub')) {
      completeLevel('hub', 25)
    }

    try {
      const stored = localStorage.getItem('wishes')
      const localWishes = stored ? JSON.parse(stored) : []
      const presets = Array.isArray(presetWishes) ? presetWishes.length : 0
      setWishesCount(localWishes.length + presets)
    } catch {
      setWishesCount(Array.isArray(presetWishes) ? presetWishes.length : 0)
    }

    setLoading(false)
  }, [navigate, isUnlocked, isLevelCompleted, completeLevel])

  useEffect(() => {
    if (!loading && !hasTriggeredGreeting.current) {
      hasTriggeredGreeting.current = true
      const hubDialogue = dialogue?.hub
      if (hubDialogue) {
        say('wave', hubDialogue.text, hubDialogue.face || 'smile')
      } else {
        say('wave', 'Welcome to Mission Control! Choose your next path.', 'smile')
      }
    }
  }, [loading, say])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateNextBirthday(personConfig?.dob || personConfig?.password || '06102006'))
    }, 1000)
    return () => clearInterval(timer)
  }, [personConfig])

  const age = useMemo(() => calculateAge(personConfig?.dob || personConfig?.password || '06102006'), [personConfig])
  const daysTogether = useMemo(
    () => calculateDaysTogether(personConfig?.relationshipStart || personConfig?.startDate || ''),
    [personConfig]
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-bounce">
          <Sprite name="bubbletea" kind="props" scale={3} />
        </div>
        <p className="font-pixel text-[10px] text-neon-sky tracking-widest animate-pulse">
          INITIALIZING MISSION CONTROL...
        </p>
      </div>
    )
  }

  const playableLevels = LEVELS.filter((lvl) => lvl.id !== 'gate' && lvl.id !== 'hub')

  // Helper cast for HudCard component props to bypass ts(2322)
  const CardComponent = HudCard as any

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-4xl px-2 sm:px-4 py-2 pb-24">
      {/* Title Header */}
      <div className="text-center space-y-1 sm:space-y-2">
        <div className="font-pixel text-[8px] sm:text-[9px] text-neon-pink uppercase tracking-widest">
          {'◀'} SECTOR 01: HUB {'▶'}
        </div>
        <h1 className="font-pixel text-xl sm:text-2xl text-soft uppercase tracking-wider">
          Mission Control
        </h1>
        <p className="font-body text-xs sm:text-sm text-soft/60">
          Select an unlocked mission sector to continue
        </p>
      </div>

      {/* 3 Top HUD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
        <CardComponent title="AGE UNLOCKED" label="AGE UNLOCKED">
          <div className="flex items-center justify-center gap-3">
            <span className="font-pixel text-2xl sm:text-3xl text-neon-sky">{age}</span>
            <span className="font-pixel text-[8px] text-neon-pink uppercase">YEARS</span>
          </div>
        </CardComponent>

        <CardComponent title="DAYS TOGETHER" label="DAYS TOGETHER">
          <div className="flex items-center justify-center gap-3">
            <span className="font-pixel text-2xl sm:text-3xl text-neon-sky">
              {daysTogether}
            </span>
            <span className="font-pixel text-[8px] text-neon-pink uppercase">DAYS</span>
          </div>
        </CardComponent>

        <CardComponent title="WISHES COLLECTED" label="WISHES COLLECTED">
          <div className="flex items-center justify-center gap-3">
            <Sprite name="phone" kind="props" scale={1.4} />
            <span className="font-pixel text-2xl sm:text-3xl text-neon-sky">
              {wishesCount}
            </span>
          </div>
        </CardComponent>
      </div>

      {/* Live Birthday Countdown */}
      <div
        className="w-full bg-navy-900/80 backdrop-blur-sm border-2 border-neon-blue/40 p-4 sm:p-5 flex flex-col items-center gap-3 shadow-[0_0_16px_rgba(37,99,235,0.15)]"
        style={{ borderRadius: '2px' }}
      >
        <div className="font-pixel text-[8px] text-neon-sky uppercase tracking-widest">
          {'▶'} NEXT BIRTHDAY COUNTDOWN {'◀'}
        </div>

        {timeLeft.isToday ? (
          <div className="py-2 text-center">
            <h2 className="font-pixel text-sm sm:text-lg text-neon-pink animate-pulse">
              ✨ TODAY IS THE DAY! HAPPY BIRTHDAY! ✨
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-md">
            {[
              { label: 'DAYS', val: timeLeft.days },
              { label: 'HOURS', val: timeLeft.hours },
              { label: 'MINS', val: timeLeft.minutes },
              { label: 'SECS', val: timeLeft.seconds },
            ].map((chip) => (
              <div
                key={chip.label}
                className="bg-navy-800/80 border border-neon-sky/30 p-2 sm:p-3 flex flex-col items-center justify-center"
                style={{ borderRadius: '2px' }}
              >
                <span className="font-pixel text-base sm:text-xl text-neon-sky">
                  {String(chip.val).padStart(2, '0')}
                </span>
                <span className="font-pixel text-[6px] sm:text-[7px] text-soft/50 mt-1">
                  {chip.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mission Level Tiles */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between border-b border-neon-blue/30 pb-2">
          <span className="font-pixel text-[9px] text-neon-pink uppercase tracking-widest">
            MISSION LEVELS
          </span>
          <Link
            to="/awards"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-neon-pink/50 bg-navy-800/60 hover:bg-neon-pink/10 transition-all text-soft hover:text-neon-pink"
            style={{ borderRadius: '2px' }}
          >
            <Sprite name="backpack" kind="props" scale={1.2} />
            <span className="font-pixel text-[7px] sm:text-[8px] uppercase tracking-wider">
              Achievements
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {playableLevels.map((lvl) => {
            const unlocked = isUnlocked(lvl.id)
            const completed = isLevelCompleted(lvl.id)

            if (!unlocked) {
              return (
                <div
                  key={lvl.id}
                  className="relative p-3.5 bg-navy-950/60 border border-soft/10 flex flex-col items-center justify-center gap-2 opacity-50 cursor-not-allowed select-none min-h-[110px]"
                  style={{ borderRadius: '2px' }}
                >
                  <span className="font-pixel text-base text-soft/30">🔒</span>
                  <div className="text-center">
                    <div className="font-pixel text-[8px] text-soft/40 uppercase">
                      {lvl.name}
                    </div>
                    <div className="font-pixel text-[6px] text-neon-pink/50 mt-1">
                      LOCKED
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={lvl.id}
                to={`/${lvl.id}`}
                className="group relative p-3.5 bg-navy-800/60 hover:bg-navy-800/90 border border-neon-sky/40 hover:border-neon-sky flex flex-col items-center justify-center gap-2 transition-all hover:shadow-[0_0_12px_rgba(56,189,248,0.25)] min-h-[110px]"
                style={{ borderRadius: '2px' }}
              >
                {completed && (
                  <span className="absolute top-1.5 right-1.5 font-pixel text-[7px] text-neon-sky">
                    ✓
                  </span>
                )}
                <div className="group-hover:scale-110 transition-transform">
                  <Sprite name="books" kind="props" scale={1.7} />
                </div>
                <div className="text-center">
                  <div className="font-pixel text-[8px] text-soft group-hover:text-neon-sky uppercase transition-colors">
                    {lvl.name}
                  </div>
                  <div className="font-pixel text-[6px] text-neon-sky/50 mt-1">
                    {completed ? 'COMPLETED' : 'UNLOCKED'}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}