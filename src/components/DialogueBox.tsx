import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Sprite from './Sprite'
import { useBuddy } from '../context/BuddyContext'
import { person } from '../config.js'
import { sfx } from '../utils/sfx'

const TYPEWRITER_SPEED = 24

export default function DialogueBox() {
  const location = useLocation()
  const { currentLine, dismiss } = useBuddy()
  const [displayedText, setDisplayedText] = useState('')
  const [done, setDone] = useState(false)
  const timerRef = useRef<number | undefined>(undefined)

  // Don't show floating box on the terminal login page
  const isGate = location.pathname === '/'

  useEffect(() => {
    if (!currentLine || isGate) {
      setDisplayedText('')
      setDone(false)
      return
    }

    setDisplayedText('')
    setDone(false)
    const text = currentLine.text
    let i = 0

    const tick = () => {
      i++
      setDisplayedText(text.slice(0, i))

      if (text[i - 1] !== ' ' && i % 2 === 0) {
        try {
          sfx?.pop?.()
        } catch {
          // ignore audio restrictions
        }
      }

      if (i >= text.length) {
        setDone(true)
        return
      }
      timerRef.current = window.setTimeout(tick, TYPEWRITER_SPEED)
    }

    timerRef.current = window.setTimeout(tick, 100)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentLine, isGate])

  const handleTap = () => {
    if (!currentLine) return
    if (!done) {
      if (timerRef.current) clearTimeout(timerRef.current)
      setDisplayedText(currentLine.text)
      setDone(true)
    } else {
      dismiss()
    }
  }

  if (!currentLine || isGate) return null

  const activePose = currentLine.pose || 'stand'

  return (
    <div
      className="fixed bottom-14 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl cursor-pointer select-none"
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleTap()
      }}
    >
      {/* Side-by-Side Flex Layout (Buddy on Left, Speech Bubble on Right) */}
      <div className="relative flex items-end gap-3 sm:gap-4">

        {/* ================= LEFT: FLOATING BUDDY & NAME TAG ================= */}
        <div className="flex flex-col items-center flex-shrink-0 z-20">
          {/* Animated Floating Character */}
          <div
            className="transform transition-transform hover:scale-105"
            style={{
              animation: 'buddy-sway 2.5s ease-in-out infinite alternate',
              filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.8)) drop-shadow(0 0 10px rgba(56,189,248,0.5))',
            }}
          >
            <Sprite name={activePose} kind="poses" scale={2.8} />
          </div>

          {/* Name Tag Pill */}
          <div
            className="mt-1 px-2.5 py-0.5 bg-navy-950 border border-neon-pink shadow-[0_0_10px_rgba(244,114,182,0.5)]"
            style={{ borderRadius: '2px' }}
          >
            <span className="font-pixel text-[7px] text-neon-pink uppercase tracking-widest font-bold whitespace-nowrap">
              {person?.name ? `${person.name.toUpperCase()}'S BUDDY` : 'BUDDY'}
            </span>
          </div>
        </div>

        {/* ================= RIGHT: SPEECH BUBBLE ================= */}
        <div
          className="relative flex-1 bg-navy-950/95 backdrop-blur-md border-2 border-neon-sky p-3.5 sm:p-4 shadow-[0_0_24px_rgba(56,189,248,0.35)] min-h-[4.2rem] flex flex-col justify-between"
          style={{ borderRadius: '2px' }}
        >
          {/* Speech Pointer Tail (Pointing toward Buddy on left) */}
          <div className="absolute -left-2 bottom-4 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-neon-sky" />

          {/* Corner Neon Accents */}
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-pink pointer-events-none" />
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-neon-pink pointer-events-none" />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-neon-pink pointer-events-none" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-pink pointer-events-none" />

          {/* Clear Dialogue Text */}
          <div className="pr-4">
            <p className="font-body text-xs sm:text-sm text-white font-medium leading-relaxed tracking-wide">
              {displayedText}
              {!done && (
                <span className="cursor-blink text-neon-sky font-bold ml-1">▌</span>
              )}
            </p>
          </div>

          {/* Tap Prompt / Next Arrow */}
          <div className="self-end mt-1 flex items-center gap-1.5">
            {done ? (
              <span className="font-pixel text-[7px] text-neon-sky flex items-center gap-1 animate-pulse">
                <span>TAP TO ADVANCE</span>
                <span className="animate-bounce">▼</span>
              </span>
            ) : (
              <span className="font-pixel text-[6px] text-soft/40 uppercase">
                TAP TO SKIP ▶
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Gentle Floating Animation Keyframes */}
      <style>{`
        @keyframes buddy-sway {
          0% {
            transform: translateY(0px) rotate(-1deg);
          }
          100% {
            transform: translateY(-6px) rotate(1deg);
          }
        }
      `}</style>
    </div>
  )
}