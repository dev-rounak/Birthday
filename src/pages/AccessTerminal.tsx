import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { person, dialogue } from '../config.js'
import { useBuddy } from '../context/BuddyContext'
import { useMusic } from '../context/MusicContext'
import { useXP } from '../context/XPContext'
import { sfx } from '../utils/sfx'

const BOOT_LINES = [
  '> Initializing birthday mission system...',
  '> Loading companion AI...',
  '> Scanning identity signature...',
  '> Establishing secure connection...',
  '> Access terminal ready.',
]

function normalizePassword(input: string): string {
  return input.replace(/[^0-9]/g, '')
}

type Phase = 'booting' | 'input' | 'denied' | 'granted'

export default function AccessTerminal() {
  const navigate = useNavigate()
  const { say } = useBuddy()
  const { play } = useMusic()
  const { completeLevel } = useXP()
  const [phase, setPhase] = useState<Phase>('booting')
  const [bootIndex, setBootIndex] = useState(0)
  const [typedBoot, setTypedBoot] = useState('')
  const [password, setPassword] = useState('')
  const [failCount, setFailCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasTriggeredDialogue = useRef(false)

  // Boot sequence: type out each line
  useEffect(() => {
    if (phase !== 'booting') return
    if (bootIndex >= BOOT_LINES.length) {
      setPhase('input')
      return
    }
    const line = BOOT_LINES[bootIndex]
    if (typedBoot.length < line.length) {
      const timer = setTimeout(() => {
        setTypedBoot(line.slice(0, typedBoot.length + 1))
      }, 25)
      return () => clearTimeout(timer)
    } else {
      sfx.click()
      const timer = setTimeout(() => {
        setBootIndex((i) => i + 1)
        setTypedBoot('')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [phase, bootIndex, typedBoot])

  // Show gate dialogue when input phase starts (only once)
  useEffect(() => {
    if (phase === 'input' && !hasTriggeredDialogue.current) {
      hasTriggeredDialogue.current = true
      const gate = dialogue.gate
      if (gate) {
        say(gate.pose, gate.text, gate.face)
      }
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [phase, say])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = normalizePassword(password)

    if (normalized === person.password) {
      // Success
      setPhase('granted')
      sfx.unlock()
      setTimeout(() => sfx.success(), 300)
      say('happy', 'Access granted! Welcome to your birthday mission!', 'smile')
      setTimeout(() => {
        say('celebrating', 'Lets go! Adventure time!', 'smile')
      }, 1500)
      play()
      completeLevel('gate')
      setTimeout(() => navigate('/hub'), 2500)
    } else {
      // Failure
      setPhase('denied')
      setShake(true)
      setFailCount((c) => c + 1)
      sfx.click()
      say('angry', 'ACCESS DENIED! That is not the right code.', 'angry')
      setTimeout(() => {
        say('sad', 'Hmm... try again?', 'sad')
        setShake(false)
        setPhase('input')
        setPassword('')
        if (failCount + 1 >= 3) {
          setShowHint(true)
          say('think', `Hint: ${person.hint}`, 'smile')
        }
        setTimeout(() => inputRef.current?.focus(), 100)
      }, 1500)
    }
  }

  return (
    <div className={`flex flex-col items-center gap-6 w-full max-w-lg mt-4 ${shake ? 'glitch-shake' : ''}`}>
      {/* Terminal header */}
      <div className="text-center">
        <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-widest mb-4">
          {'\u25C0'} ACCESS TERMINAL {'\u25B6'}
        </div>
        <h1 className="font-pixel text-lg sm:text-2xl text-soft uppercase leading-tight mb-2">
          Birthday
        </h1>
        <h1 className="font-pixel text-lg sm:text-2xl text-neon-sky uppercase leading-tight">
          Mission
        </h1>
      </div>

      {/* Terminal screen */}
      <div
        className="w-full bg-navy-900/80 backdrop-blur-sm border-2 border-neon-blue/40 p-4 sm:p-6 min-h-[280px] flex flex-col"
        style={{ borderRadius: '2px', boxShadow: '0 0 16px rgba(37, 99, 235, 0.2)' }}
      >
        {/* Corner brackets */}
        <span className="relative w-full">
          <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-neon-sky pointer-events-none" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-neon-sky pointer-events-none" />
        </span>

        {/* Boot lines */}
        <div className="flex-1 font-pixel text-[8px] text-neon-sky/70 leading-relaxed space-y-1 mb-4">
          {BOOT_LINES.slice(0, bootIndex).map((line, i) => (
            <div key={i} className="flex items-start gap-1">
              <span className="text-neon-sky/50">{'\u25B6'}</span>
              <span>{line}</span>
              <span className="text-neon-sky">{'\u2713'}</span>
            </div>
          ))}
          {phase === 'booting' && bootIndex < BOOT_LINES.length && (
            <div className="flex items-start gap-1">
              <span className="text-neon-sky/50">{'\u25B6'}</span>
              <span>{typedBoot}</span>
              <span className="cursor-blink text-neon-sky">{'\u258C'}</span>
            </div>
          )}
        </div>

        {/* Password input */}
        {phase === 'input' && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="font-pixel text-[8px] text-neon-pink/80 uppercase tracking-wider">
              {'\u25B6'} Enter date of birth to proceed:
            </div>
            <div className="font-pixel text-[6px] text-soft/40">
              Format: DDMMYYYY (separators OK)
            </div>
            <input
              ref={inputRef}
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-800/60 border-2 border-neon-blue/40 px-3 py-2.5 font-pixel text-sm text-neon-sky text-center tracking-[0.3em] outline-none focus:border-neon-sky focus:shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all"
              style={{ borderRadius: '2px' }}
              placeholder="--------"
              autoComplete="off"
              inputMode="numeric"
            />
            {showHint && (
              <div className="font-pixel text-[7px] text-neon-pink/70 text-center animate-pulse">
                HINT: {person.hint}
              </div>
            )}
            <button
              type="submit"
              className="w-full font-pixel text-[10px] uppercase tracking-wider border-2 border-neon-pink text-neon-pink py-2.5 transition-all hover:bg-neon-pink/10 hover:shadow-[0_0_16px_rgba(244,114,182,0.5)] active:scale-95"
              style={{ borderRadius: '2px' }}
              onClick={sfx.click}
            >
              {'\u25B6'} Authenticate
            </button>
          </form>
        )}

        {/* Denied flash */}
        {phase === 'denied' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="font-pixel text-base sm:text-lg text-neon-pink uppercase tracking-widest animate-pulse">
              {'\u26A0'} ACCESS DENIED {'\u26A0'}
            </div>
            <div className="font-pixel text-[7px] text-neon-pink/60 mt-2">
              Invalid identity code
            </div>
          </div>
        )}

        {/* Granted flash */}
        {phase === 'granted' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="font-pixel text-base sm:text-lg text-neon-sky uppercase tracking-widest granted-flash">
              {'\u2713'} ACCESS GRANTED {'\u2713'}
            </div>
            <div className="font-pixel text-[7px] text-neon-sky/60 mt-2">
              Welcome, {person.name}
            </div>
          </div>
        )}

        {/* Fail counter */}
        {phase === 'input' && failCount > 0 && (
          <div className="font-pixel text-[6px] text-neon-pink/40 text-center mt-2">
            Attempts: {failCount}
          </div>
        )}
      </div>
    </div>
  )
}