import { useState, useEffect, useRef } from 'react'
import Sprite from './Sprite'
import { useBuddy } from '../context/BuddyContext'

const TYPEWRITER_SPEED = 35

export default function DialogueBox() {
  const { currentLine, dismiss } = useBuddy()
  const [displayedText, setDisplayedText] = useState('')
  const [done, setDone] = useState(false)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!currentLine) {
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
      if (i >= text.length) {
        setDone(true)
        return
      }
      timerRef.current = window.setTimeout(tick, TYPEWRITER_SPEED)
    }

    timerRef.current = window.setTimeout(tick, TYPEWRITER_SPEED)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentLine])

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

  if (!currentLine) return null

  return (
    <div
      className="fixed bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md"
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleTap()
      }}
    >
      <div
        className="relative bg-navy-800/90 backdrop-blur-md border-2 border-neon-sky/50 p-3 flex gap-3 items-start"
        style={{
          borderRadius: '2px',
          boxShadow: '0 0 16px rgba(56, 189, 248, 0.2)',
        }}
      >
        {/* Corner brackets */}
        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-neon-sky pointer-events-none" />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-neon-sky pointer-events-none" />
        <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-neon-sky pointer-events-none" />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-neon-sky pointer-events-none" />

        {/* Face portrait */}
        <div className="flex-shrink-0 border-2 border-neon-blue/40 bg-navy-900/60 p-1" style={{ borderRadius: '2px' }}>
          <Sprite name={currentLine.face} kind="faces" scale={2} />
        </div>

        {/* Text */}
        <div className="flex-1 min-h-[3rem] flex flex-col justify-center">
          <p className="font-body text-sm text-soft leading-relaxed">
            {displayedText}
            {!done && <span className="cursor-blink text-neon-sky">▌</span>}
          </p>
        </div>

        {/* Continue indicator */}
        {done && (
          <div className="absolute bottom-2 right-3 font-pixel text-[8px] text-neon-sky/70">
            <span className="cursor-blink">{'\u25BC'}</span>
          </div>
        )}
      </div>
    </div>
  )
}