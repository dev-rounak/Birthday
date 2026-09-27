import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { person, dialogue } from '../config.js'
import { useBuddy } from '../context/BuddyContext'
import { useXP } from '../context/XPContext'
import { sfx } from '../utils/sfx'
import Sprite from '../components/Sprite'
import Confetti from '../components/Confetti'

// =========================================================================
// 📝 EDIT YOUR MAIN LETTER TEXT HERE
// You can edit paragraphs, line breaks, or personal nicknames.
// =========================================================================
const LETTER_BODY = `Happy Birthday to the most incredible person in my universe!

Looking back at our journey, every single memory, late-night conversation, and silly laugh with you has been a treasure. You bring a warmth and light into my life that makes even ordinary days feel magical.

Thank you for being my constant comfort, my greatest partner in crime, and the person who understands me like no one else does. Watching you grow and shine is one of my greatest joys, and I promise to always stand by you, cheer you on, and make you smile.

Here's to another year of unforgettable adventures, spontaneous dates, endless food runs, and memories we'll cherish forever. Happy Birthday, my favorite human! ❤️`
// =========================================================================

export default function Letter() {
    const { say } = useBuddy()
    const { completeLevel, isLevelCompleted } = useXP()

    // Retrieve secretly stored answers from the Arcade page
    const [datePlan, setDatePlan] = useState<string>('')
    const [lovedOne, setLovedOne] = useState<string>('')

    // Typewriter effect state
    const [displayedText, setDisplayedText] = useState('')
    const [isTypingDone, setIsTypingDone] = useState(false)
    const typingTimerRef = useRef<number | null>(null)

    useEffect(() => {
        // Read secret answers
        const storedDate = localStorage.getItem('bm_date_plan') || 'A romantic surprise sunset date'
        const storedLove = localStorage.getItem('bm_love_most') || 'You'
        setDatePlan(storedDate)
        setLovedOne(storedLove)

        // Buddy prompt
        const letterDialogue = dialogue?.letter?.text || 'A special letter written just for you. Open your heart!'
        say('happy', letterDialogue, 'smile')
    }, [say])

    // Typewriter effect
    useEffect(() => {
        let index = 0
        const fullText = LETTER_BODY

        const typeChar = () => {
            index++
            setDisplayedText(fullText.slice(0, index))

            if (index < fullText.length) {
                typingTimerRef.current = window.setTimeout(typeChar, 22)
            } else {
                setIsTypingDone(true)
                if (!isLevelCompleted('letter')) {
                    sfx?.success?.()
                    completeLevel('letter', 50)
                    say('blush', 'Every single word is from the bottom of my heart.', 'smile')
                }
            }
        }

        typingTimerRef.current = window.setTimeout(typeChar, 400)

        return () => {
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
        }
    }, [completeLevel, isLevelCompleted, say])

    // Instant skip typewriter
    const handleSkipTyping = () => {
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
        setDisplayedText(LETTER_BODY)
        setIsTypingDone(true)
        if (!isLevelCompleted('letter')) {
            completeLevel('letter', 50)
        }
    }

    return (
        <div className="relative w-full max-w-3xl mx-auto px-4 py-6 flex flex-col items-center select-none pb-28">
            {/* Sector Header */}
            <div className="text-center space-y-2 mb-6">
                <div className="font-pixel text-[8px] sm:text-[9px] text-neon-pink uppercase tracking-widest">
                    {'◀'} SECTOR: LOVE LETTER {'▶'}
                </div>
                <h1 className="font-pixel text-xl sm:text-2xl text-soft uppercase tracking-wider">
                    A Message From My Heart
                </h1>
                <p className="font-body text-xs sm:text-sm text-soft/60">
                    Declassified Birthday Transmission
                </p>

                <div className="flex justify-center pt-2">
                    <Sprite name="happy" kind="poses" scale={2.4} />
                </div>
            </div>

            {/* Main Letter Terminal Container */}
            <div
                className="w-full bg-navy-900/90 backdrop-blur-md border-2 border-neon-sky/60 p-5 sm:p-8 shadow-[0_0_30px_rgba(56,189,248,0.25)] relative"
                style={{ borderRadius: '2px' }}
            >
                {/* Corner Neon Brackets */}
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-pink pointer-events-none" />
                <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-pink pointer-events-none" />
                <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neon-pink pointer-events-none" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-pink pointer-events-none" />

                {/* Top Header of the Letter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neon-sky/30 pb-4 mb-6 gap-3">
                    <div>
                        <div className="font-pixel text-[7px] text-neon-pink uppercase tracking-widest">
                            CONFIDENTIAL TRANSMISSION
                        </div>
                        <div className="font-pixel text-xs sm:text-sm text-neon-sky uppercase mt-1">
                            TO: {person?.name || 'My Favorite Person'}
                        </div>
                    </div>

                    {/* Quick Skip button */}
                    {!isTypingDone && (
                        <div>
                            <button
                                onClick={handleSkipTyping}
                                className="font-pixel text-[7px] uppercase px-3 py-1.5 border border-soft/40 text-soft hover:border-neon-sky hover:text-neon-sky transition-all active:scale-95"
                                style={{ borderRadius: '2px' }}
                            >
                                Skip Typing ⏭
                            </button>
                        </div>
                    )}
                </div>

                {/* ========================================================================= */}
                {/* 🌟 SECRET ANSWERS SECTION (DISPLAYED AT THE BEGINNING) */}
                {/* ========================================================================= */}
                <div
                    className="mb-6 p-4 bg-navy-950/80 border border-neon-pink/50 space-y-3"
                    style={{ borderRadius: '2px', boxShadow: '0 0 14px rgba(244,114,182,0.15)' }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-neon-pink text-xs">🔒</span>
                        <span className="font-pixel text-[8px] text-neon-pink uppercase tracking-widest">
                            Decoded Intel From Arcade
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* Answer 1: Date Plan */}
                        <div className="p-2.5 bg-navy-900/60 border border-neon-sky/30">
                            <span className="font-pixel text-[6px] text-neon-sky/70 uppercase block mb-1">
                                Her Dream Date Plan:
                            </span>
                            <p className="font-body text-xs sm:text-sm text-soft italic font-medium">
                                "{datePlan}"
                            </p>
                        </div>

                        {/* Answer 2: Whom she loves most */}
                        <div className="p-2.5 bg-navy-900/60 border border-neon-sky/30">
                            <span className="font-pixel text-[6px] text-neon-sky/70 uppercase block mb-1">
                                Whom She Loves Most:
                            </span>
                            <p className="font-body text-xs sm:text-sm text-neon-pink italic font-medium">
                                "{lovedOne}"
                            </p>
                        </div>
                    </div>

                    <div className="font-pixel text-[6px] text-soft/40 pt-1 text-center sm:text-left">
                        * I took notes of every single word. Now here is what I wanted to tell you:
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* MAIN LETTER BODY (TYPEWRITER EFFECT) */}
                {/* ========================================================================= */}
                <div className="min-h-[220px] font-body text-sm sm:text-base text-soft leading-relaxed whitespace-pre-line tracking-wide">
                    {displayedText}
                    {!isTypingDone && (
                        <span className="cursor-blink text-neon-sky font-bold ml-1">▌</span>
                    )}
                </div>

                {/* Letter Signoff */}
                {isTypingDone && (
                    <div className="mt-8 pt-4 border-t border-neon-sky/20 flex flex-col items-end animate-fade-in">
                        <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-widest">
                            Forever & Always,
                        </div>
                        <div className="font-pixel text-xs sm:text-sm text-neon-sky uppercase mt-1">
                            With all my love ❤️
                        </div>
                    </div>
                )}
            </div>

            {/* Completion Confetti */}
            {isTypingDone && <Confetti active={true} />}

            {/* Return to Hub */}
            <div className="mt-10 flex flex-col items-center">
                <Link
                    to="/hub"
                    className="font-pixel text-[9px] uppercase px-5 py-2.5 border-2 border-neon-sky text-neon-sky bg-navy-900/90 hover:bg-neon-sky/20 transition-all shadow-[0_0_12px_rgba(56,189,248,0.3)] active:scale-95"
                    style={{ borderRadius: '2px' }}
                >
                    {'◀'} Return to Mission Control
                </Link>
            </div>
        </div>
    )
}