import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import { sfx } from '../utils/sfx'
import Sprite from '../components/Sprite'
import Confetti from '../components/Confetti'

interface QuestionChoice {
    type: 'choice'
    question: string
    options: string[]
    answer: number
}

interface QuestionText {
    type: 'text'
    question: string
    storageKey: string
    placeholder: string
}

type Question = QuestionChoice | QuestionText

const QUESTIONS: Question[] = [
    {
        type: 'choice',
        question: "What's your favourite colour?",
        options: ['Pink', 'Blue', 'Lavender', 'Emerald Green'],
        answer: 1, // Blue
    },
    {
        type: 'choice',
        question: "What's your favourite food?",
        options: ['Momos', 'Biryani', 'Cheesy Pizza', 'Sushi & Ramen'],
        answer: 1, // Biryani
    },
    {
        type: 'choice',
        question: 'Where does she like to go?',
        options: ['Sunny Beaches', 'Misty Mountains', 'Amusement Parks', 'Quiet Cafes'],
        answer: 0, // Beaches
    },
    {
        type: 'text',
        question: 'How do you want your date planned?',
        storageKey: 'bm_date_plan',
        placeholder: 'Tell me your dream date...',
    },
    {
        type: 'text',
        question: 'Whom do you love the most?',
        storageKey: 'bm_love_most',
        placeholder: 'Type your answer here...',
    },
]

interface SliceFruit {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    emoji: string
    points: number
    sliced: boolean
    isBomb: boolean
    rotation: number
    vRot: number
}

const FRUIT_EMOJIS = [
    { emoji: '🍉', points: 20 },
    { emoji: '🍓', points: 15 },
    { emoji: '🍍', points: 25 },
    { emoji: '🍌', points: 15 },
    { emoji: '🍊', points: 20 },
]

type ArcadePhase = 'intro' | 'trivia' | 'prep' | 'slice' | 'victory'

export default function Arcade() {
    const { say } = useBuddy()
    const { completeLevel, isLevelCompleted } = useXP()

    const [phase, setPhase] = useState<ArcadePhase>('intro')

    // Quiz state
    const [qIndex, setQIndex] = useState(0)
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null)
    const [typedAnswer, setTypedAnswer] = useState('')
    const [triviaScore, setTriviaScore] = useState(0)
    const [textSubmitted, setTextSubmitted] = useState(false)

    // Fruit Slicing Game state
    const [gameScore, setGameScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(25)
    const [fruits, setFruits] = useState<SliceFruit[]>([])
    const [bladeTrail, setBladeTrail] = useState<{ x: number; y: number }[]>([])
    const isPointerDownRef = useRef(false)
    const gameAreaRef = useRef<HTMLDivElement>(null)
    const gameLoopRef = useRef<number | null>(null)
    const spawnTimerRef = useRef<number | null>(null)

    useEffect(() => {
        say('happy', 'Welcome to the Arcade! Answer 5 questions, then slice some fruits!', 'smile')
    }, [say])

    // ==================== PHASE 1: TRIVIA LOGIC ====================
    const handleChoice = (index: number) => {
        if (selectedOpt !== null) return
        setSelectedOpt(index)

        const curr = QUESTIONS[qIndex] as QuestionChoice
        const isCorrect = index === curr.answer

        if (isCorrect) {
            sfx?.success?.()
            setTriviaScore((s) => s + 1)
            say('happy', 'Correct! Extra bonus time unlocked!', 'wink')
        } else {
            sfx?.pop?.()
            say('think', 'Close one! Keep rolling!', 'smile')
        }

        setTimeout(() => advanceQuestion(), 1100)
    }

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!typedAnswer.trim() || textSubmitted) return
        setTextSubmitted(true)

        const curr = QUESTIONS[qIndex] as QuestionText
        const val = typedAnswer.trim()

        // Secretly save answer to localStorage for the Love Letter page
        try {
            localStorage.setItem(curr.storageKey, val)
            const secretBag = JSON.parse(localStorage.getItem('bm_secret_answers') || '{}')
            secretBag[curr.storageKey] = val
            localStorage.setItem('bm_secret_answers', JSON.stringify(secretBag))
        } catch {
            // safe fallback
        }

        sfx?.success?.()
        setTriviaScore((s) => s + 1) // Always marks typed responses as correct
        say('blush', "Aww, that's noted in my memory banks!", 'wink')

        setTimeout(() => advanceQuestion(), 1100)
    }

    const advanceQuestion = () => {
        setSelectedOpt(null)
        setTypedAnswer('')
        setTextSubmitted(false)

        if (qIndex + 1 < QUESTIONS.length) {
            setQIndex((i) => i + 1)
        } else {
            setPhase('prep')
        }
    }

    // ==================== PHASE 2: FRUIT SLICE LOGIC ====================
    const startSliceGame = () => {
        const totalTime = 20 + triviaScore * 2
        setTimeLeft(totalTime)
        setGameScore(0)
        setFruits([])
        setBladeTrail([])
        setPhase('slice')
        say('stand', 'Swipe or drag your cursor across the fruits to slice them! Watch out for bombs!', 'smile')
    }

    // Fruit Spawner (Slower pace)
    useEffect(() => {
        if (phase !== 'slice') return

        spawnTimerRef.current = window.setInterval(() => {
            const isBomb = Math.random() < 0.2
            const randomFruit = FRUIT_EMOJIS[Math.floor(Math.random() * FRUIT_EMOJIS.length)]

            const newFruit: SliceFruit = {
                id: Date.now() + Math.random(),
                x: Math.floor(Math.random() * 66) + 17, // 17% to 83% width
                y: 104, // start slightly below viewport
                vx: (Math.random() - 0.5) * 0.7, // gentle horizontal drift
                vy: -(Math.random() * 1.1 + 2.1), // gentle vertical toss
                emoji: isBomb ? '💣' : randomFruit.emoji,
                points: isBomb ? -25 : randomFruit.points,
                sliced: false,
                isBomb,
                rotation: 0,
                vRot: (Math.random() - 0.5) * 4, // smooth gentle rotation
            }

            setFruits((prev) => [...prev, newFruit])
        }, 950) // More comfortable interval

        return () => {
            if (spawnTimerRef.current) clearInterval(spawnTimerRef.current)
        }
    }, [phase])

    // Physics Loop (Gentle gravity for slower flight)
    useEffect(() => {
        if (phase !== 'slice') return

        const gravity = 0.04 // Halved gravity for floating floaty arc
        const loop = () => {
            setFruits((prev) =>
                prev
                    .map((f) => ({
                        ...f,
                        x: f.x + f.vx,
                        y: f.y + f.vy,
                        vy: f.vy + gravity,
                        rotation: f.rotation + f.vRot,
                    }))
                    .filter((f) => f.y < 125)
            )
            gameLoopRef.current = requestAnimationFrame(loop)
        }

        gameLoopRef.current = requestAnimationFrame(loop)
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
        }
    }, [phase])

    // Slice check on coordinate
    const checkSliceAt = useCallback(
        (clientX: number, clientY: number) => {
            const rect = gameAreaRef.current?.getBoundingClientRect()
            if (!rect) return

            const pctX = ((clientX - rect.left) / rect.width) * 100
            const pctY = ((clientY - rect.top) / rect.height) * 100

            // Add to blade trail
            setBladeTrail((trail) => [...trail.slice(-8), { x: pctX, y: pctY }])

            setFruits((prev) =>
                prev.map((f) => {
                    if (f.sliced) return f

                    // Distance check
                    const dist = Math.hypot(f.x - pctX, f.y - pctY)
                    if (dist < 10) {
                        // Sliced!
                        if (f.isBomb) {
                            sfx?.pop?.()
                            setGameScore((s) => Math.max(0, s + f.points))
                        } else {
                            sfx?.click?.()
                            setGameScore((s) => s + f.points)
                        }
                        return { ...f, sliced: true, vy: f.vy * 0.4 }
                    }
                    return f
                })
            )
        },
        []
    )

    // Mouse & Touch Slice Handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        isPointerDownRef.current = true
        checkSliceAt(e.clientX, e.clientY)
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isPointerDownRef.current && e.pointerType === 'mouse' && e.buttons !== 1) return
        checkSliceAt(e.clientX, e.clientY)
    }

    const handlePointerUp = () => {
        isPointerDownRef.current = false
        setBladeTrail([])
    }

    const finishArcade = useCallback(() => {
        setPhase('victory')
        sfx?.success?.()
        if (!isLevelCompleted('arcade')) {
            completeLevel('arcade', 75)
        }
        say('celebrating', 'Masterful slicing! Arcade mission cleared!', 'smile')
    }, [isLevelCompleted, completeLevel, say])

    // Countdown timer
    useEffect(() => {
        if (phase !== 'slice') return

        const timer = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timer)
                    finishArcade()
                    return 0
                }
                return t - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [phase, finishArcade])

    const currQ = QUESTIONS[qIndex]

    return (
        <div className="relative w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center select-none pb-20">
            {/* Header */}
            <div className="text-center space-y-2 mb-4">
                <div className="font-pixel text-[8px] sm:text-[9px] text-neon-pink uppercase tracking-widest">
                    {'◀'} SECTOR: ARCADE ARENA {'▶'}
                </div>
                <h1 className="font-pixel text-lg sm:text-2xl text-soft uppercase tracking-wider">
                    Trivia & Fruit Slicer
                </h1>
                <p className="font-body text-xs text-soft/60">
                    Answer the questions to earn bonus time in the Fruit Slicing Arena!
                </p>
            </div>

            {/* ================= PHASE 1: INTRO ================= */}
            {phase === 'intro' && (
                <div
                    className="w-full bg-navy-900/80 border-2 border-neon-blue/50 p-6 flex flex-col items-center text-center gap-5 mt-4"
                    style={{ borderRadius: '2px', boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)' }}
                >
                    <Sprite name="happy" kind="poses" scale={3} />
                    <div className="space-y-2">
                        <h2 className="font-pixel text-sm text-neon-sky uppercase">Mission Objective</h2>
                        <p className="font-body text-xs sm:text-sm text-soft/80 max-w-md leading-relaxed">
                            Step 1: Answer 5 personal questions.<br />
                            Step 2: Swipe & slice flying fruits while dodging glitch bombs!
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            sfx?.click?.()
                            setPhase('trivia')
                        }}
                        className="font-pixel text-[10px] uppercase px-6 py-3 border-2 border-neon-pink text-neon-pink hover:bg-neon-pink/20 transition-all shadow-[0_0_12px_rgba(244,114,182,0.4)] active:scale-95"
                        style={{ borderRadius: '2px' }}
                    >
                        Start Mission ▶
                    </button>
                </div>
            )}

            {/* ================= PHASE 2: QUESTIONS ================= */}
            {phase === 'trivia' && (
                <div
                    className="w-full bg-navy-900/90 border-2 border-neon-sky p-5 sm:p-6 flex flex-col gap-4 mt-2"
                    style={{ borderRadius: '2px', boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)' }}
                >
                    <div className="flex justify-between items-center border-b border-neon-sky/30 pb-2">
                        <span className="font-pixel text-[8px] text-neon-pink">
                            QUESTION {qIndex + 1} OF {QUESTIONS.length}
                        </span>
                        <span className="font-pixel text-[8px] text-neon-sky">
                            BONUS EARNED: +{triviaScore * 2}s TIME
                        </span>
                    </div>

                    <h3 className="font-pixel text-xs sm:text-sm text-soft leading-relaxed my-2">
                        {currQ.question}
                    </h3>

                    {/* Multiple Choice Format (Q1 - Q3) */}
                    {currQ.type === 'choice' && (
                        <div className="grid grid-cols-1 gap-2.5">
                            {currQ.options.map((opt, i) => {
                                const isSelected = selectedOpt === i
                                const isAnswer = i === currQ.answer
                                let btnStyle = 'border-neon-blue/40 bg-navy-950 text-soft hover:border-neon-sky'

                                if (selectedOpt !== null) {
                                    if (isAnswer) {
                                        btnStyle = 'border-green-400 bg-green-500/20 text-green-300'
                                    } else if (isSelected) {
                                        btnStyle = 'border-red-400 bg-red-500/20 text-red-300'
                                    }
                                }

                                return (
                                    <button
                                        key={i}
                                        disabled={selectedOpt !== null}
                                        onClick={() => handleChoice(i)}
                                        className={`font-pixel text-[9px] text-left p-3 border-2 transition-all ${btnStyle}`}
                                        style={{ borderRadius: '2px' }}
                                    >
                                        <span className="text-neon-pink mr-2">[{i + 1}]</span>
                                        {opt}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* Open-Ended Type Input Format (Q4 & Q5) */}
                    {currQ.type === 'text' && (
                        <form onSubmit={handleTextSubmit} className="space-y-4">
                            <input
                                type="text"
                                autoFocus
                                disabled={textSubmitted}
                                value={typedAnswer}
                                onChange={(e) => setTypedAnswer(e.target.value)}
                                placeholder={currQ.placeholder}
                                className="w-full bg-navy-900 border-2 border-neon-sky/70 px-4 py-3 font-body text-sm sm:text-base text-white placeholder:text-soft/60 outline-none focus:border-neon-pink focus:shadow-[0_0_12px_rgba(244,114,182,0.4)] transition-all"
                                style={{ borderRadius: '2px' }}
                            />

                            <button
                                type="submit"
                                disabled={!typedAnswer.trim() || textSubmitted}
                                className="w-full font-pixel text-[9px] uppercase py-3 border-2 border-neon-sky text-neon-sky hover:bg-neon-sky/20 transition-all disabled:opacity-40"
                                style={{ borderRadius: '2px' }}
                            >
                                {textSubmitted ? '✓ Answer Recorded' : 'Submit Answer ▶'}
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* ================= PHASE 3: PREP SCREEN ================= */}
            {phase === 'prep' && (
                <div
                    className="w-full bg-navy-900/90 border-2 border-neon-pink p-6 flex flex-col items-center text-center gap-4 mt-2"
                    style={{ borderRadius: '2px' }}
                >
                    <h2 className="font-pixel text-sm text-neon-pink uppercase">Round 1 Cleared!</h2>
                    <div className="p-3 border border-neon-sky/30 bg-navy-950 w-full max-w-sm font-pixel text-[8px] text-neon-sky space-y-2">
                        <div>Questions Completed: {triviaScore} / {QUESTIONS.length}</div>
                        <div className="text-green-400">Bonus Time Awarded: +{triviaScore * 2} Seconds!</div>
                    </div>
                    <p className="font-body text-xs text-soft/70">
                        Swipe or drag across the fruits to slice them. Don't touch the bombs!
                    </p>
                    <button
                        onClick={startSliceGame}
                        className="font-pixel text-[10px] uppercase px-6 py-3 border-2 border-neon-sky text-neon-sky hover:bg-neon-sky/20 transition-all shadow-[0_0_16px_rgba(56,189,248,0.4)] active:scale-95"
                        style={{ borderRadius: '2px' }}
                    >
                        Launch Fruit Slicer ▶
                    </button>
                </div>
            )}

            {/* ================= PHASE 4: FRUIT SLICE ARENA ================= */}
            {phase === 'slice' && (
                <div className="w-full flex flex-col items-center gap-3">
                    {/* HUD Bar */}
                    <div className="w-full flex justify-between items-center bg-navy-900 border border-neon-sky/40 px-4 py-2 text-[8px] font-pixel">
                        <span className="text-neon-pink">SCORE: {gameScore}</span>
                        <span className="text-neon-sky animate-pulse">TIME LEFT: {timeLeft}s</span>
                    </div>

                    {/* Slicing Arena Box */}
                    <div
                        ref={gameAreaRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        className="relative w-full h-[360px] bg-navy-950 border-2 border-neon-blue/60 overflow-hidden shadow-inner cursor-crosshair touch-none select-none"
                        style={{ borderRadius: '2px' }}
                    >
                        {/* Blade Swipe Trail */}
                        {bladeTrail.map((p, i) => (
                            <div
                                key={i}
                                className="absolute w-2.5 h-2.5 rounded-full pointer-events-none bg-neon-sky shadow-[0_0_8px_#38bdf8]"
                                style={{
                                    left: `${p.x}%`,
                                    top: `${p.y}%`,
                                    opacity: (i + 1) / bladeTrail.length,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />
                        ))}

                        {/* Flying Fruits */}
                        {fruits.map((f) => (
                            <div
                                key={f.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-3xl select-none transition-transform pointer-events-none"
                                style={{
                                    left: `${f.x}%`,
                                    top: `${f.y}%`,
                                    transform: `translate(-50%, -50%) rotate(${f.rotation}deg)`,
                                }}
                            >
                                {f.sliced ? (
                                    <span className="opacity-70 text-2xl filter blur-[0.5px]">💥</span>
                                ) : (
                                    f.emoji
                                )}
                            </div>
                        ))}

                        <div className="absolute top-2 right-3 font-pixel text-[6px] text-soft/30 pointer-events-none">
                            SWIPE / DRAG TO SLICE
                        </div>
                    </div>
                </div>
            )}

            {/* ================= PHASE 5: VICTORY SCREEN ================= */}
            {phase === 'victory' && (
                <div
                    className="w-full bg-navy-900/90 border-2 border-neon-sky p-6 flex flex-col items-center text-center gap-4 mt-2"
                    style={{ borderRadius: '2px' }}
                >
                    <Confetti active={true} />
                    <Sprite name="celebrating" kind="poses" scale={3} />
                    <h2 className="font-pixel text-sm sm:text-base text-neon-pink uppercase">
                        ARCADE ARENA CLEARED!
                    </h2>
                    <div className="font-pixel text-[9px] text-neon-sky">
                        FINAL SCORE: {gameScore} PTS (+75 XP EARNED)
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-3 w-full max-w-xs">
                        <button
                            onClick={() => {
                                setPhase('intro')
                                setQIndex(0)
                                setSelectedOpt(null)
                                setTypedAnswer('')
                                setTriviaScore(0)
                            }}
                            className="w-full font-pixel text-[8px] uppercase py-2.5 border border-soft/50 text-soft hover:bg-white/10"
                            style={{ borderRadius: '2px' }}
                        >
                            Play Again
                        </button>
                        <Link
                            to="/hub"
                            className="w-full text-center font-pixel text-[8px] uppercase py-2.5 border-2 border-neon-sky text-neon-sky bg-neon-sky/10 hover:bg-neon-sky/20 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                            style={{ borderRadius: '2px' }}
                        >
                            Return to Hub ▶
                        </Link>
                    </div>
                </div>
            )}

            {/* Hub link */}
            {phase !== 'victory' && (
                <div className="mt-8">
                    <Link
                        to="/hub"
                        className="font-pixel text-[8px] uppercase px-4 py-2 border border-neon-sky/40 text-soft/70 hover:text-neon-sky hover:border-neon-sky transition-all"
                        style={{ borderRadius: '2px' }}
                    >
                        {'◀'} Back to Mission Control
                    </Link>
                </div>
            )}
        </div>
    )
}