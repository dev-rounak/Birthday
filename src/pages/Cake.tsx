import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Sprite from '../components/Sprite'
import PixelButton from '../components/PixelButton'
import Fireworks from '../components/Fireworks'
import Confetti from '../components/Confetti'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import { person, dialogue } from '../config.js'
import { sfx } from '../utils/sfx'
import { playHappyBirthdaySong, stopHappyBirthdaySong } from '../utils/birthdaySong'

type Phase = 'dark' | 'lit' | 'celebrating' | 'cutting' | 'done'

const CANDLE_COUNT = 5

export default function Cake() {
  const navigate = useNavigate()
  const { say } = useBuddy()
  const { completeLevel } = useXP()

  const [phase, setPhase] = useState<Phase>('dark')
  const [litCandles, setLitCandles] = useState<boolean[]>(Array(CANDLE_COUNT).fill(false))
  const [blownCandles, setBlownCandles] = useState<boolean[]>(Array(CANDLE_COUNT).fill(false))
  const [knifeX, setKnifeX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [sliceCut, setSliceCut] = useState(false)

  const litTimerRef = useRef<number | undefined>(undefined)
  const dialogueShownRef = useRef(false)
  const cakeAreaRef = useRef<HTMLDivElement>(null)

  // Show cake dialogue on initial mount
  useEffect(() => {
    if (dialogueShownRef.current) return
    dialogueShownRef.current = true
    const cake = dialogue.cake
    if (cake) {
      say(cake.pose, cake.text, cake.face)
    }
  }, [say])

  // Sequentially ignite candles
  const lightCandles = () => {
    sfx.pop()
    setPhase('lit')
    litCandles.forEach((_, i) => {
      litTimerRef.current = window.setTimeout(() => {
        setLitCandles((prev) => {
          const next = [...prev]
          next[i] = true
          return next
        })
        sfx.pop()
      }, i * 200)
    })
  }

  // Blow out candles with tap
  const blowOutCandles = useCallback(() => {
    sfx.pop()

    blownCandles.forEach((_, i) => {
      setTimeout(() => {
        setBlownCandles((prev) => {
          const next = [...prev]
          next[i] = true
          return next
        })
        sfx.pop()
      }, i * 120)
    })

    setTimeout(() => {
      setPhase('celebrating')
      sfx.success()
      playHappyBirthdaySong()
      say('celebrating', `Happy Birthday, ${person.name}!`, 'smile')
      completeLevel('cake')
    }, CANDLE_COUNT * 120 + 250)
  }, [blownCandles, say, completeLevel])

  const startCutting = () => {
    setPhase('cutting')
    say('happy', 'Now cut the cake! Drag the knife across it!', 'smile')
  }

  // Pointer drag for cutting knife
  const handlePointerDown = (e: React.PointerEvent) => {
    if (phase !== 'cutting' || sliceCut) return
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = cakeAreaRef.current?.getBoundingClientRect()
    if (rect) {
      setKnifeX(e.clientX - rect.left)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || phase !== 'cutting' || sliceCut) return
    const rect = cakeAreaRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    setKnifeX(x)

    if (x > rect.width * 0.6) {
      setSliceCut(true)
      setIsDragging(false)
      sfx.slice()
      say('celebrating', 'Yum! That slice looks delicious!', 'smile')
      setTimeout(() => {
        setPhase('done')
      }, 900)
    }
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    return () => {
      stopHappyBirthdaySong()
      if (litTimerRef.current) clearTimeout(litTimerRef.current)
    }
  }, [])

  const allLit = litCandles.every(Boolean)
  const isDark = phase === 'dark' || (phase === 'lit' && !allLit)
  const showCake = phase !== 'cutting' && phase !== 'done'
  const cakeWidth = 130

  return (
    <div className={`relative flex flex-col items-center justify-between min-h-[78vh] w-full max-w-xl mx-auto py-4 transition-all duration-700 ${isDark ? 'brightness-[0.4]' : 'brightness-100'}`}>

      {/* Top Header / Celebration Banner */}
      <div className="text-center z-10 w-full flex flex-col items-center justify-center min-h-[64px]">
        {phase === 'celebrating' ? (
          <div className="animate-bounce">
            <div
              className="bg-navy-900 border-2 border-neon-pink px-6 py-2.5 shadow-[0_0_24px_rgba(244,114,182,0.6)]"
              style={{ borderRadius: '2px' }}
            >
              <div className="font-pixel text-xs sm:text-sm text-neon-pink uppercase tracking-widest text-center">
                HAPPY BIRTHDAY
              </div>
              <div className="font-pixel text-sm sm:text-base text-neon-sky uppercase tracking-widest text-center mt-1">
                {person.name.toUpperCase()}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-widest">
              {'\u25C6'} CAKE STATION {'\u25C6'}
            </div>
            <h1 className="font-pixel text-sm sm:text-base text-soft uppercase tracking-widest">
              {phase === 'cutting' ? 'Cut the Cake' : phase === 'done' ? 'Delicious!' : 'Birthday Cake'}
            </h1>
          </div>
        )}
      </div>

      {/* Center Stage: Buddy + Cake */}
      {showCake && (
        <div className="relative flex items-end justify-center gap-6 sm:gap-10 my-auto z-10 min-h-[170px]">
          <div className={phase === 'celebrating' ? 'buddy-celebrate' : ''}>
            <Sprite
              name={phase === 'celebrating' ? 'celebrating' : 'birthday'}
              kind="poses"
              scale={3.5}
            />
          </div>

          {/* Pixel Birthday Cake */}
          <div className="relative" style={{ width: 160, height: 130 }}>
            {/* Base Cake Layers */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              style={{ width: cakeWidth, height: 75 }}
            >
              <div
                className="absolute bottom-0 w-full"
                style={{
                  height: 48,
                  background: '#f472b6',
                  border: '2px solid #be185d',
                  borderRadius: '3px',
                }}
              >
                {[0, 22, 44, 66, 88, 110].map((x) => (
                  <div
                    key={x}
                    className="absolute top-0"
                    style={{
                      left: x,
                      width: 14,
                      height: 10 + Math.sin(x) * 3,
                      background: '#fbcfe8',
                      borderRadius: '0 0 6px 6px',
                    }}
                  />
                ))}
              </div>
              <div
                className="absolute w-full"
                style={{
                  bottom: 44,
                  height: 30,
                  background: '#f9a8d4',
                  border: '2px solid #be185d',
                  borderRadius: '3px',
                }}
              />
            </div>

            {/* Birthday Candles */}
            {Array.from({ length: CANDLE_COUNT }).map((_, i) => {
              const candleX = 14 + i * 26
              const isLit = litCandles[i] && !blownCandles[i]
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: candleX, bottom: 74, width: 6, height: 22 }}
                >
                  <div
                    className="w-full"
                    style={{
                      height: 18,
                      background: i % 2 === 0 ? '#38bdf8' : '#fbbf24',
                      border: '1px solid rgba(255,255,255,0.4)',
                    }}
                  />
                  {isLit && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 candle-flame"
                      style={{ bottom: 16, width: 8, height: 12 }}
                    >
                      <div
                        className="w-full h-full"
                        style={{
                          background: 'radial-gradient(circle at 50% 70%, #fbbf24 0%, #f97316 60%, transparent 100%)',
                          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        }}
                      />
                    </div>
                  )}
                  {!isLit && blownCandles[i] && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{ bottom: 16, fontSize: 10, opacity: 0.4 }}
                    >
                      {'\u223F'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Interactive Cutting Phase */}
      {(phase === 'cutting' || phase === 'done') && (
        <div className="flex flex-col items-center gap-4 my-auto z-10">
          <div className="flex items-end gap-6 sm:gap-10">
            <Sprite
              name={phase === 'done' ? 'happy' : 'stand'}
              kind="poses"
              scale={3.5}
            />

            <div
              ref={cakeAreaRef}
              className="relative select-none"
              style={{ width: 180, height: 130, touchAction: 'none' }}
            >
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{ width: cakeWidth, height: 75 }}
              >
                <div
                  className="absolute bottom-0 w-full overflow-hidden"
                  style={{
                    height: 48,
                    background: '#f472b6',
                    border: '2px solid #be185d',
                    borderRadius: '3px',
                  }}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center font-pixel text-[8px] text-soft uppercase tracking-wider"
                    style={{ textShadow: '1px 1px 0 #be185d' }}
                  >
                    {person.name}
                  </div>
                </div>
                <div
                  className="absolute w-full"
                  style={{
                    bottom: 44,
                    height: 30,
                    background: '#f9a8d4',
                    border: '2px solid #be185d',
                    borderRadius: '3px',
                  }}
                />
              </div>

              {phase === 'cutting' && knifeX > 0 && (
                <div
                  className="absolute"
                  style={{
                    left: 25 + (knifeX / 180) * cakeWidth,
                    bottom: 0,
                    width: 2,
                    height: 75,
                    background: 'rgba(190, 24, 93, 0.6)',
                  }}
                />
              )}

              {sliceCut && (
                <div
                  className="absolute bottom-0 cake-slice-out"
                  style={{
                    left: '50%',
                    width: 30,
                    height: 48,
                    marginLeft: -15,
                    background: '#f472b6',
                    border: '2px solid #be185d',
                    borderRadius: '3px',
                  }}
                />
              )}

              {phase === 'cutting' && !sliceCut && (
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className={`absolute cursor-grab ${isDragging ? 'cursor-grabbing' : 'knife-hint'}`}
                  style={{
                    left: 25 + (knifeX / 180) * cakeWidth,
                    bottom: 80,
                    width: 44,
                    height: 22,
                    touchAction: 'none',
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 6,
                      background: 'linear-gradient(180deg, #e2e8f0 0%, #94a3b8 100%)',
                      border: '1px solid #64748b',
                      borderRadius: '2px 8px 8px 2px',
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      right: 0,
                      top: 0,
                      width: 14,
                      height: 8,
                      background: '#1e293b',
                      border: '1px solid #0f172a',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              )}

              {phase === 'cutting' && !isDragging && !sliceCut && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-pixel text-[7px] text-neon-sky/70 uppercase">
                  {'\u2192'} Drag knife to slice {'\u2192'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs z-20 pb-28">
        {phase === 'dark' && (
          <PixelButton variant="pink" size="md" onClick={lightCandles}>
            {'\u25B6'} Light the Candles
          </PixelButton>
        )}

        {phase === 'lit' && allLit && (
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="font-pixel text-[8px] text-neon-sky/80 uppercase tracking-wider text-center">
              Make a wish!
            </div>
            <PixelButton variant="pink" size="md" onClick={blowOutCandles}>
              {'\u25B6'} Tap to Blow Out Candles
            </PixelButton>
          </div>
        )}

        {phase === 'celebrating' && (
          <PixelButton variant="pink" size="md" onClick={startCutting}>
            {'\u25B6'} Cut the Cake
          </PixelButton>
        )}

        {phase === 'done' && (
          <PixelButton variant="blue" size="md" onClick={() => navigate('/gallery')}>
            Next: Hall of Fame {'\u2192'}
          </PixelButton>
        )}
      </div>

      {/* Screen-Wide Visual Effects */}
      <Fireworks active={phase === 'celebrating'} onTap={() => sfx.pop()} />
      <Confetti active={phase === 'celebrating'} />
    </div>
  )
}