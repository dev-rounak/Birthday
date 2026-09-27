import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Sprite from '../components/Sprite'
import PixelButton from '../components/PixelButton'
import Fireworks from '../components/Fireworks'
import Confetti from '../components/Confetti'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import { useMusic } from '../context/MusicContext'
import { person, dialogue } from '../config.js'
import { sfx } from '../utils/sfx'

type Phase = 'dark' | 'lit' | 'blowing' | 'celebrating' | 'cutting' | 'done'

const CANDLE_COUNT = 5

export default function Cake() {
  const navigate = useNavigate()
  const { say } = useBuddy()
  const { completeLevel } = useXP()
  const { duck, resume } = useMusic()
  const [phase, setPhase] = useState<Phase>('dark')
  const [litCandles, setLitCandles] = useState<boolean[]>(Array(CANDLE_COUNT).fill(false))
  const [blownCandles, setBlownCandles] = useState<boolean[]>(Array(CANDLE_COUNT).fill(false))
  const [micActive, setMicActive] = useState(false)
  const [micDenied, setMicDenied] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(false)
  const [knifeX, setKnifeX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [sliceCut, setSliceCut] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const micRafRef = useRef<number>(0)
  const litTimerRef = useRef<number | undefined>(undefined)
  const dialogueShownRef = useRef(false)
  const cakeAreaRef = useRef<HTMLDivElement>(null)

  // Show cake dialogue on mount
  useEffect(() => {
    if (dialogueShownRef.current) return
    dialogueShownRef.current = true
    const cake = dialogue.cake
    if (cake) {
      say(cake.pose, cake.text, cake.face)
    }
  }, [say])

  // Light candles one by one
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
      }, i * 250)
    })
  }

  // Start mic listening
  const startMic = useCallback(async () => {
    setPhase('blowing')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser
      setMicActive(true)
      setMicDenied(false)
      duck()

      const data = new Uint8Array(analyser.frequencyBinCount)
      let blowFrames = 0

      const checkVolume = () => {
        analyser.getByteFrequencyData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) sum += data[i]
        const avg = sum / data.length

        if (avg > 45) {
          blowFrames++
          if (blowFrames >= 3) {
            blowOutCandles()
            return
          }
        } else {
          blowFrames = Math.max(0, blowFrames - 1)
        }

        micRafRef.current = requestAnimationFrame(checkVolume)
      }
      micRafRef.current = requestAnimationFrame(checkVolume)
    } catch {
      setMicDenied(true)
      setMicActive(false)
    }
  }, [duck])

  // Blow out candles
  const blowOutCandles = useCallback(() => {
    // Stop mic
    if (micRafRef.current) cancelAnimationFrame(micRafRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close()
      audioCtxRef.current = null
    }
    setMicActive(false)

    // Blow out candles one by one
    blownCandles.forEach((_, i) => {
      setTimeout(() => {
        setBlownCandles((prev) => {
          const next = [...prev]
          next[i] = true
          return next
        })
        sfx.pop()
      }, i * 150)
    })

    setTimeout(() => {
      setPhase('celebrating')
      resume()
      sfx.success()
      say('celebrating', `Happy Birthday, ${person.name}!`, 'smile')
      setBannerVisible(true)
      completeLevel('cake')
    }, CANDLE_COUNT * 150 + 300)
  }, [blownCandles, resume, say, completeLevel])

  // Transition to cutting phase after celebration
  const startCutting = () => {
    setPhase('cutting')
    setBannerVisible(false)
    say('happy', 'Now cut the cake! Drag the knife across it!', 'smile')
  }

  // Knife drag handlers
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
    // When the knife crosses past 60% of the cake, cut is complete
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (micRafRef.current) cancelAnimationFrame(micRafRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
      if (litTimerRef.current) clearTimeout(litTimerRef.current)
      resume()
    }
  }, [resume])

  const allLit = litCandles.every(Boolean)
  const isDark = phase === 'dark' || (phase === 'lit' && !allLit)
  const showCake = phase !== 'cutting' && phase !== 'done'
  const cakeWidth = 120

  return (
    <div className={`flex flex-col items-center gap-6 w-full max-w-lg mt-4 transition-all duration-700 ${isDark ? 'brightness-[0.3]' : 'brightness-100'}`}>
      {/* Header */}
      <div className="text-center">
        <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-widest mb-3">
          {'\u25C6'} Cake Station {'\u25C6'}
        </div>
        <h1 className="font-pixel text-sm sm:text-base text-soft uppercase tracking-widest">
          {phase === 'cutting' ? 'Cut the Cake' : phase === 'done' ? 'Enjoy!' : 'Light the Candles'}
        </h1>
      </div>

      {/* Cake scene (phases: dark, lit, blowing, celebrating) */}
      {showCake && (
        <div className="relative flex flex-col items-center gap-4">
          <div className="flex items-end gap-4 sm:gap-8">
            <div className={phase === 'celebrating' ? 'buddy-celebrate' : ''}>
              <Sprite
                name={phase === 'celebrating' ? 'celebrating' : 'birthday'}
                kind="poses"
                scale={3}
              />
            </div>

            {/* Pixel cake with candles */}
            <div className="relative" style={{ width: 160, height: 140 }}>
              {/* Cake base */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{ width: cakeWidth, height: 80 }}
              >
                {/* Bottom layer */}
                <div
                  className="absolute bottom-0 w-full"
                  style={{
                    height: 50,
                    background: '#f472b6',
                    border: '2px solid #be185d',
                    borderRadius: '4px',
                  }}
                >
                  {/* Frosting drips */}
                  {[0, 20, 40, 60, 80, 100].map((x) => (
                    <div
                      key={x}
                      className="absolute top-0"
                      style={{
                        left: x,
                        width: 16,
                        height: 12 + Math.sin(x) * 4,
                        background: '#fbcfe8',
                        borderRadius: '0 0 8px 8px',
                      }}
                    />
                  ))}
                </div>
                {/* Top layer */}
                <div
                  className="absolute w-full"
                  style={{
                    bottom: 48,
                    height: 32,
                    background: '#f9a8d4',
                    border: '2px solid #be185d',
                    borderRadius: '4px',
                  }}
                />
              </div>

              {/* Candles */}
              {Array.from({ length: CANDLE_COUNT }).map((_, i) => {
                const candleX = 20 + i * 28
                const isLit = litCandles[i] && !blownCandles[i]
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{ left: candleX, bottom: 82, width: 6, height: 24 }}
                  >
                    {/* Candle body */}
                    <div
                      className="w-full"
                      style={{
                        height: 20,
                        background: i % 2 === 0 ? '#38bdf8' : '#fbbf24',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    />
                    {/* Flame */}
                    {isLit && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 candle-flame"
                        style={{ bottom: 18, width: 8, height: 12 }}
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
                    {/* Smoke when blown */}
                    {!isLit && blownCandles[i] && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{ bottom: 18, fontSize: 10, opacity: 0.4 }}
                      >
                        {'\u223F'}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cutting scene */}
      {(phase === 'cutting' || phase === 'done') && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-end gap-4 sm:gap-8">
            <Sprite
              name={phase === 'done' ? 'happy' : 'stand'}
              kind="poses"
              scale={3}
            />

            {/* Cake with name in icing + knife */}
            <div
              ref={cakeAreaRef}
              className="relative select-none"
              style={{ width: 180, height: 140, touchAction: 'none' }}
            >
              {/* Cake base */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{ width: cakeWidth, height: 80 }}
              >
                {/* Bottom layer */}
                <div
                  className="absolute bottom-0 w-full overflow-hidden"
                  style={{
                    height: 50,
                    background: '#f472b6',
                    border: '2px solid #be185d',
                    borderRadius: '4px',
                  }}
                >
                  {/* Name in icing */}
                  <div
                    className="absolute inset-0 flex items-center justify-center font-pixel text-[7px] text-soft uppercase tracking-wider"
                    style={{ textShadow: '1px 1px 0 #be185d' }}
                  >
                    {person.name}
                  </div>
                </div>
                {/* Top layer */}
                <div
                  className="absolute w-full"
                  style={{
                    bottom: 48,
                    height: 32,
                    background: '#f9a8d4',
                    border: '2px solid #be185d',
                    borderRadius: '4px',
                  }}
                >
                  {/* Frosting drips */}
                  {[0, 20, 40, 60, 80, 100].map((x) => (
                    <div
                      key={x}
                      className="absolute top-0"
                      style={{
                        left: x,
                        width: 16,
                        height: 10 + Math.sin(x) * 4,
                        background: '#fbcfe8',
                        borderRadius: '0 0 8px 8px',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Cut line (appears as knife drags) */}
              {phase === 'cutting' && knifeX > 0 && (
                <div
                  className="absolute"
                  style={{
                    left: 30 + (knifeX / 180) * cakeWidth,
                    bottom: 0,
                    width: 2,
                    height: 80,
                    background: 'rgba(190, 24, 93, 0.5)',
                    transition: 'left 0.05s',
                  }}
                />
              )}

              {/* Slice sliding out after cut */}
              {sliceCut && (
                <div
                  className="absolute bottom-0 cake-slice-out"
                  style={{
                    left: '50%',
                    width: 30,
                    height: 50,
                    marginLeft: -15,
                    background: '#f472b6',
                    border: '2px solid #be185d',
                    borderRadius: '4px',
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0"
                    style={{
                      height: 12,
                      background: '#f9a8d4',
                      border: '2px solid #be185d',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                </div>
              )}

              {/* Knife */}
              {phase === 'cutting' && !sliceCut && (
                <div
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className={`absolute cursor-grab ${isDragging ? 'cursor-grabbing' : 'knife-hint'}`}
                  style={{
                    left: 30 + (knifeX / 180) * cakeWidth,
                    bottom: 85,
                    width: 40,
                    height: 20,
                    touchAction: 'none',
                  }}
                >
                  {/* Blade */}
                  <div
                    style={{
                      width: 28,
                      height: 6,
                      background: 'linear-gradient(180deg, #e2e8f0 0%, #94a3b8 100%)',
                      border: '1px solid #64748b',
                      borderRadius: '2px 8px 8px 2px',
                    }}
                  />
                  {/* Handle */}
                  <div
                    className="absolute"
                    style={{
                      right: 0,
                      top: 0,
                      width: 12,
                      height: 8,
                      background: '#1e293b',
                      border: '1px solid #0f172a',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              )}

              {/* Drag hint */}
              {phase === 'cutting' && !isDragging && !sliceCut && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-pixel text-[6px] text-neon-sky/60 uppercase tracking-wider">
                  {'\u2192'} drag to cut {'\u2192'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col items-center gap-3 w-full">
        {phase === 'dark' && (
          <PixelButton variant="pink" size="md" onClick={lightCandles}>
            {'\u25B6'} Light the Candles
          </PixelButton>
        )}

        {phase === 'lit' && allLit && (
          <>
            <div className="font-pixel text-[8px] text-neon-sky/70 uppercase tracking-wider text-center">
              Now blow them out!
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <PixelButton variant="pink" size="md" onClick={startMic}>
                {'\u25C9'} Use Microphone
              </PixelButton>
              <PixelButton variant="blue" size="md" onClick={blowOutCandles}>
                {'\u25B6'} Tap to Blow
              </PixelButton>
            </div>
          </>
        )}

        {phase === 'blowing' && micActive && (
          <div className="flex flex-col items-center gap-2">
            <div className="font-pixel text-[8px] text-neon-sky uppercase tracking-wider animate-pulse">
              {'\u25C9'} Listening... Blow!
            </div>
            <PixelButton variant="blue" size="sm" onClick={blowOutCandles}>
              Tap to Blow Instead
            </PixelButton>
          </div>
        )}

        {phase === 'blowing' && micDenied && (
          <div className="flex flex-col items-center gap-2">
            <div className="font-pixel text-[7px] text-neon-pink/70 text-center">
              Microphone unavailable. Use the button below.
            </div>
            <PixelButton variant="pink" size="md" onClick={blowOutCandles}>
              {'\u25B6'} Blow Out Candles
            </PixelButton>
          </div>
        )}

        {phase === 'celebrating' && (
          <PixelButton variant="pink" size="md" onClick={startCutting}>
            {'\u25B6'} Cut the Cake
          </PixelButton>
        )}

        {phase === 'done' && (
          <PixelButton variant="blue" size="md" onClick={() => navigate('/memories')}>
            Continue {'\u2192'}
          </PixelButton>
        )}
      </div>

      {/* Birthday banner */}
      {bannerVisible && (
        <div className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
          <div className="birthday-banner bg-navy-900/80 backdrop-blur-md border-2 border-neon-pink/50 px-6 py-3 mt-2" style={{ borderRadius: '2px', boxShadow: '0 0 24px rgba(244, 114, 182, 0.4)' }}>
            <div className="font-pixel text-sm sm:text-lg text-neon-pink uppercase tracking-widest text-center">
              HAPPY BIRTHDAY
            </div>
            <div className="font-pixel text-base sm:text-xl text-neon-sky uppercase tracking-widest text-center mt-1">
              {person.name.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* Fireworks + Confetti on celebrating */}
      <Fireworks active={phase === 'celebrating'} onTap={() => sfx.pop()} />
      <Confetti active={phase === 'celebrating'} />
    </div>
  )
}
